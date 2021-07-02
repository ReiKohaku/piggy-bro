import {Wechaty, Message, Contact} from "wechaty"

import path from "path"
import SqliteTemplate from "./lib/SqliteTemplate";
import {mkdirSync} from "./lib/Util";
export const __data_dir = path.join(__dirname, "../data")

mkdirSync(__data_dir)
const sqliteTemplate = new SqliteTemplate(path.join(__data_dir, "./database.db"))
export {sqliteTemplate}

const wechaty = Wechaty.instance()
wechaty.on("scan", (qrcode, status) => {
    // TODO: 此处为了方便用户扫码，有两个解决方案：1、把QRCode打印在控制台上；2、使用webhook传递QRCode Link，在外部提供扫码解决方案
    console.log("Please scan qrcode to login: " + status)
    console.log(`https://wechaty.js.org/qrcode/${encodeURIComponent(qrcode)}`)
})
wechaty.on("login", (user: Contact) => {
    console.log(`User ${user.name()} logged in.`)
})
wechaty.on("message", async (message: Message) => {
    console.log(`Message: ${message.text()}`)
    const {mp} = await import("./interceptor")
    const cmdResult = await mp.process(message)
    if (cmdResult) await message.say(cmdResult)
})
wechaty.start().then(() => {
    console.log("Bot application started!")
})
