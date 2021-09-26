import fs from "fs";
import path from "path";
import {__data_dir} from "../bot";

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
export function loadBotConfig () {
    if (!fs.existsSync(path.join(__data_dir, "./config/bot.json"))) {
        console.warn("Bot config is not exists, will use default config.")
        return defaultBotConfig
    }
    try {
        return {
            ...defaultBotConfig,
            ...JSON.parse(fs.readFileSync(path.join(__data_dir, "./config/bot.json"), "utf-8")) as BotConfig
        }
    } catch (e) {
        console.warn("Load bot config error, will use default config.")
        console.warn(e)
        return defaultBotConfig
    }
}
