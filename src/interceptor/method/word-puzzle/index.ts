import PuzzleGame from "./PuzzleGame";
import {callLimiter, template} from "../../../bot";
import getPuzzle, {Puzzle} from "./tianapi"
import {getMethodConfig} from "../../../lib/Util";
import Interceptor from "../../Interceptor";

const gameSpace: Record<string, PuzzleGame<Puzzle>> = {}

interface WordPuzzleConfig {
    limit: number
}

const defaultWordPuzzleConfig = (): WordPuzzleConfig => {
    return {
        limit: 5
    }
}

template.add("word-puzzle.game.start", [
    "来啦，猜字谜：<br/>{puzzle}",
    "要猜字谜吗？那么来试试吧：<br/>{puzzle}"
])
template.add("word-puzzle.game.playing", "当前正在进行一个猜字谜游戏，赶紧回答吧。")
template.add("word-puzzle.game.win", [
    "{name}答对啦！<br/>谜底是：{answer}<br/>{reason}"
])
template.add("word-puzzle.game.lose", [
    "没有人回答出来吗？那么二师兄公布答案了。<br/>谜底是：{answer}<br/>{reason}"
])

const wordPuzzleInterceptor = new Interceptor()
    .check(message => {
        const contact = message.talker()
        const room = message.room()
        const spaceId = room ?
            `room_${room.id}` :
            `contact_${contact.id}`
        const args = { contact, room, spaceId }
        if (/^二师兄/.test(message.text()) && /猜字谜/.test(message.text())) {
            return {
                ...args,
                action: "start"
            }
        } else if (gameSpace[spaceId] && gameSpace[spaceId].status === "start") {
            return {
                ...args,
                action: "answer",
                content: message.text()
            }
        }
    })
    .handler(async (message, checkerArgs) => {
        const {spaceId, action, content} = checkerArgs
        if (action === "start") {
            const config = {
                ...defaultWordPuzzleConfig(),
                ...getMethodConfig<WordPuzzleConfig>("word_puzzle")
            }
            if (!gameSpace[spaceId] || gameSpace[spaceId].status === "idle") {
                if (config.limit && await callLimiter.check(spaceId, "word-puzzle") >= config.limit)
                    return template.use("word-puzzle.game.limit")
                gameSpace[spaceId] = new PuzzleGame<Puzzle>()
                gameSpace[spaceId].on("start", async () => {
                    try {
                        const puzzle = await getPuzzle()
                        gameSpace[spaceId].data = puzzle
                        await message.say(template.use("word-puzzle.game.start", {
                            puzzle: puzzle.content
                        }))
                    } catch (e) {
                        throw e
                    }
                })
                gameSpace[spaceId].on("answer", async (answer) => {
                    if (answer.content === gameSpace[spaceId].data.answer) {
                        await gameSpace[spaceId].end(answer.userName)
                        return true
                    }
                })
                gameSpace[spaceId].on("end", async (userName: string) => {
                    if (userName) await message.say(template.use("word-puzzle.game.win", {
                        name: userName,
                        answer: gameSpace[spaceId].data.answer,
                        reason: gameSpace[spaceId].data.reason
                    }))
                    else await message.say(template.use("word-puzzle.game.lose", {
                        answer: gameSpace[spaceId].data.answer,
                        reason: gameSpace[spaceId].data.reason
                    }))
                })
                await gameSpace[spaceId].start()
            } else {
                return template.use("word-puzzle.game.playing")
            }
        } else if (action === "answer") {
            const result = await gameSpace[spaceId].answer({
                content,
                userId: message.talker().id,
                userName: message.talker().name()
            })
            if (result) return ""
        }
    })
export default wordPuzzleInterceptor
