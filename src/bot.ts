import "./better-console"

import {Wechaty, Message, Contact, FileBox, UrlLink, MiniProgram} from "wechaty"
import qrcodeTerminal from "qrcode-terminal";

import path from "path"
import {mkdirSync} from "./lib/Util";
export const __data_dir = path.join(__dirname, "../data")
mkdirSync(__data_dir)

import SqliteTemplate from "./lib/SqliteTemplate";
const sqliteTemplate = new SqliteTemplate(path.join(__data_dir, "./database.db"))
export {sqliteTemplate}

import Template from "./lib/Template";
const template = new Template()
export {template}

// 给公共模板设置默认值
import "./template"

import {mp} from "./interceptor";

const wechaty = Wechaty.instance({
    name: "PiggyBro"
})
wechaty.on("scan", (qrcode, status) => {
    switch (status) {
        case 2:
            console.log(template.use("on.scan.link"))
            console.log(`https://wechaty.js.org/qrcode/${encodeURIComponent(qrcode)}`)
            // 生成二维码打印在屏幕上
            qrcodeTerminal.generate(qrcode, function (output) {
                console.log(template.use("on.scan.terminal", {
                    qrcode: output
                }))
            })
            break
        case 3:
            console.log(template.use("on.scan.confirm"))
            break
        case 4:
            console.log(template.use("on.scan.login"))
            break
        default:
            console.log(status, qrcode)
    }
})
wechaty.on("login", (user: Contact) => {
    console.log(template.use("on.login", {
        name: `\x1B[43m${user.name()}\x1b[0m`
    }))
})
wechaty.on("logout", (user: Contact) => {
    console.log(template.use("on.logout", {
        name: `\x1B[43m${user.name()}\x1b[0m`
    }))
})
wechaty.on("message", async (message: Message) => {
    if (message.self()) return
    const cmdResult = await mp.process(message)
    if (typeof cmdResult === "string") await message.say(cmdResult)
    else if (typeof cmdResult === "number") await message.say(cmdResult)
    else if (cmdResult instanceof Contact) await message.say(cmdResult)
    else if (cmdResult instanceof FileBox) await message.say(cmdResult)
    else if (cmdResult instanceof UrlLink) await message.say(cmdResult)
    else if (cmdResult instanceof MiniProgram) await message.say(cmdResult)
})
wechaty.on("error", async (error) => {
    console.error(template.use("on.error"))
    console.error(error)
})
wechaty.start().then(() => {
    console.log(template.use("on.start"))
})
