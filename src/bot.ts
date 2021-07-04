import "./better-console"

import {Wechaty, Message, Contact} from "wechaty"
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

template.add("on.start", "机器人应用已启动。")
template.add("on.scan.link", "请在浏览器内打开下方链接，使用机器人的手机微信扫描二维码：")
template.add("on.scan.terminal", "您也可以扫描下方的二维码：\n{qrcode}")
template.add("on.scan.confirm", "已扫码，请确认登录。")
template.add("on.login", "用户 {name} 已登录。")
template.add("on.logout", "用户 {name} 已登出。")

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
    const {mp} = await import("./interceptor")
    const cmdResult = await mp.process(message)
    if (cmdResult) await message.say(cmdResult)
})
wechaty.start().then(() => {
    console.log(template.use("on.start"))
})
