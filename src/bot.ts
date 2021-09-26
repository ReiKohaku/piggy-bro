import fs from "fs";
import path from "path";

import "./better-console"

import {Wechaty, Message, Contact} from "wechaty"
import qrcodeTerminal from "qrcode-terminal";

import {mkdirSync} from "./lib/Util";
export const __data_dir = path.join(__dirname, "../data")
export const __interceptor_dir = path.join(__dirname, "./interceptor")
export const __build_dir = __dirname
export const __src_dir = path.join(__dirname, "../src")
mkdirSync(__data_dir)

export interface BotConfig {
    interceptor: {
        enable: string[]
    }
    server: {
        port: number
    }
}
const defaultBotConfig: BotConfig = {
    interceptor: {
        enable: ["hello", "garden"]
    },
    server: {
        port: 8088
    }
}
function loadBotConfig () {
    if (!fs.existsSync(path.join(__data_dir, "./config/bot.json"))) {
        console.warn("Bot config is not exists, will use default config.")
        return {} as BotConfig
    }
    try {
        return JSON.parse(fs.readFileSync(path.join(__data_dir, "./config/bot.json"), "utf-8")) as BotConfig
    } catch (e) {
        console.warn("Load bot config error, will use default config.")
        console.warn(e)
        return {} as BotConfig
    }
}
const botConfig: BotConfig = {
    ...defaultBotConfig,
    ...loadBotConfig()
}
export {botConfig}

import SqliteTemplate from "./lib/SqliteTemplate";
const sqliteTemplate = new SqliteTemplate(path.join(__data_dir, "./database.db"))
export {sqliteTemplate}

import CallLimiter from "./lib/CallLimiter";
const callLimiter = new CallLimiter(sqliteTemplate)
export {callLimiter}

import Template from "./lib/Template";
const template = new Template()
export {template}

// 给公共模板设置默认值
import "./template"

// 启动http服务器
import server from "./server"
server(botConfig.server.port)

// 引入拦截器
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
    await mp.process(message)
})
wechaty.on("error", async (error) => {
    console.error(template.use("on.error"))
    console.error(error)
})
wechaty.start().then(() => {
    console.log(template.use("on.start"))
})
export {wechaty}

const startAt = new Date()
export {startAt}
