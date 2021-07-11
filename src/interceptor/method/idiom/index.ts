import {Message} from "wechaty";
import fs from "fs";
import {__data_dir, template} from "../../../bot";
import path from "path";
import pinyin from "pinyin";
import IdiomGame from "./IdiomGame";

const Emoji = require("node-emoji");

// 持久化拼音数据
if (!fs.existsSync(path.join(__data_dir, "./idioms/idioms_converted.json"))) {
    if (!fs.existsSync(path.join(__data_dir, "./idioms/idioms.json"))) {
        console.error("您既没有下载源成语库数据文件，也没有下载转换后的成语库数据文件，所以成语接龙功能将处于不可用状态。")
        console.log("您可以运行tools目录下的idiom.ts来下载源成语库，也可以在本项目仓库的Github Release中下载资源文件。")
    } else {
        const oriIdiomsData = fs.readFileSync(path.join(__data_dir, "./idioms/idioms.json"), "utf-8")
        const convertedData = (JSON.parse(oriIdiomsData) as string[]).map(s => {
            return {
                name: s,
                pinyin: pinyin(s, {
                    style: pinyin.STYLE_NORMAL,
                    heteronym: true
                })
            }
        })
        fs.writeFileSync(path.join(__data_dir, "./idioms/idioms_converted.json"), JSON.stringify(convertedData))
    }
}

interface convertedIdiom {
    name: string
    pinyin: string[][]
}

const idiomList: convertedIdiom[] | null =
    fs.existsSync(path.join(__data_dir, "./idioms/idioms_converted.json")) ?
        JSON.parse(fs.readFileSync(path.join(__data_dir, "./idioms/idioms_converted.json"), "utf-8")) :
        null

function findIdiom(idiom: string): convertedIdiom | void {
    for (const i of idiomList) {
        if (i.name === idiom) return i
    }
}

function shuffleFindIdiomByFirstPinyin(pinyin: string, excepted?: string[]): convertedIdiom | void {
    const results = []
    for (const i of idiomList) {
        if (i.pinyin[0][0] === pinyin && (!excepted || !excepted.includes(i.name))) results.push(i)
    }
    if (results.length > 0) return results[Math.floor(Math.random() * results.length)]
}

function isEndToEnd(first: convertedIdiom, next: convertedIdiom): boolean {
    const firstEndPinyin: string[] = first.pinyin[first.pinyin.length - 1]
    const nextFirstPinyin: string[] = next.pinyin[0]
    for (const fep of firstEndPinyin) {
        for (const nfp of nextFirstPinyin) {
            if (fep === nfp) return true
        }
    }
    return false
}

const gameSpace: Record<string, IdiomGame<convertedIdiom>> = {}

template.add("idiom.game.playing", "现在正在进行一个成语接龙游戏哦，赶紧回答吧。")
template.add("idiom.game.start", "成语接龙游戏开始！<br/>请在30秒内写出一个以下面的成语的最后一个字（同音字亦可）开头的成语：<br/>{idiom}")
template.add("idiom.game.next", [
    "真棒！<br/>那二师兄再接一个：<br/>{idiom}",
    "不错不错~<br/>那二师兄再接一个：<br/>{idiom}",
])
template.add("idiom.game.playerWin", [
    "你真厉害！二师兄也接不上下一个了。<br/>本轮得分：<br/>{score}",
    "嗯……二师兄也不知道下一个该接什么，是你赢了。<br/>本轮得分：<br/>{score}"
])
template.add("idiom.game.botWin", [
    "既然接不上了，那么就算二师兄赢了哦。<br/>本轮得分：<br/>{score}",
    "没人能答上来了吗？那么二师兄赢了哦。<br/>本轮得分：<br/>{score}",
])

export default async function (message: Message): Promise<string | undefined> {
    const contact = message.talker()
    const room = message.room()
    const spaceId = room ?
        `room_${room.id}` :
        `contact_${contact.id}`
    if (/^二师兄/.test(message.text()) &&
        /成语接龙/.test(message.text())) {
        if (!idiomList) return undefined
        if (!gameSpace[spaceId] || gameSpace[spaceId].status === "idle") {
            gameSpace[spaceId] = new IdiomGame()
            const startIdiom = idiomList[Math.floor(Math.random() * idiomList.length)]
            gameSpace[spaceId].on("start", async () => {
                gameSpace[spaceId].push(startIdiom)
                await message.say(template.use("idiom.game.start", {
                    idiom: startIdiom.name
                }))
                gameSpace[spaceId].startTimer()
            })
            gameSpace[spaceId].on("answer", async (answer) => {
                const lastIdiom = gameSpace[spaceId].lastIdiom()
                const idiom = findIdiom(answer.content)
                if (idiom && isEndToEnd(lastIdiom, idiom)) {
                    gameSpace[spaceId].pause()
                    gameSpace[spaceId].stopTimer()

                    // 加分
                    gameSpace[spaceId].push(idiom)
                    gameSpace[spaceId].addScore(message.talker().id, message.talker().name())
                    // 接龙
                    let nextIdiom, count = 0
                    do {
                        nextIdiom = shuffleFindIdiomByFirstPinyin(idiom.pinyin[idiom.pinyin.length - 1][count])
                        count++
                    } while (!nextIdiom && count < idiom.pinyin[idiom.pinyin.length - 1].length)
                    if (nextIdiom) {
                        gameSpace[spaceId].push(nextIdiom)
                        await message.say(template.use("idiom.game.next", {
                            idiom: nextIdiom.name
                        }))
                        gameSpace[spaceId].startTimer()
                        gameSpace[spaceId].continue()
                    } else {
                        await gameSpace[spaceId].end("player")
                    }
                    return true
                }
            })
            gameSpace[spaceId].on("end", async (winner: string = "bot") => {
                gameSpace[spaceId].stopTimer()
                const scoreList = gameSpace[spaceId].getAllScore()
                const scoreArray: { name: string, score: number }[] = []
                for (const i in scoreList)
                    if (scoreList.hasOwnProperty(i))
                        scoreArray.push({name: scoreList[i].name, score: scoreList[i].score})
                scoreArray.sort((a, b) => b.score - a.score)
                let scoreResult = scoreArray.length > 0 ? "" : "没有人得分"
                scoreArray.forEach((s, i, a) => {
                    if (i === 0) scoreResult += Emoji.get("first_place_medal")
                    else if (i === 1) scoreResult += Emoji.get("second_place_medal")
                    else if (i === 2) scoreResult += Emoji.get("third_place_medal")
                    scoreResult += `${s.name}：${s.score}分`
                    if (i + 1 < a.length) scoreResult += "<br/>"
                })
                if (winner === "bot") {
                    await message.say(template.use("idiom.game.botWin", {
                        score: scoreResult
                    }))
                } else if (winner === "player") {
                    await message.say(template.use("idiom.game.botWin", {
                        score: scoreResult
                    }))
                }
            })
            await gameSpace[spaceId].start()
            return ""
        } else {
            return template.use("idiom.game.playing")
        }
    } else if (gameSpace[spaceId] && gameSpace[spaceId].status === "start") {
        const result = await gameSpace[spaceId].answer({
            content: message.text(),
            userId: message.talker().id,
            userName: message.talker().name()
        })
        if (result) return ""
    }
}
