/*
9月17日追加：
    考虑到先行的拦截器耦合度依旧很高，这里引入一个“上下文”的概念。
    “上下文”在载入插件前就创建完毕，包含模板、数据库操作类、调用计数器、机器人实例等。
    这样做就允许开发者单独去开发一个插件，而不是fork仓库后再去开发插件。
*/

import {Wechaty} from "wechaty";
import SqliteTemplate from "./SqliteTemplate";
import Template from "./Template";
import CallLimiter from "./CallLimiter";
import path from "path";
import fs from "fs";
import {BotConfig} from "./BotConfig";

export default class Context {
    bot: Wechaty
    config: BotConfig
    sqliteTemplate: SqliteTemplate
    template: Template
    callLimiter: CallLimiter
    __data_dir: string
    __interceptor_dir: string
    __build_dir: string
    __src_dir: string

    constructor(mem: {
        bot: Wechaty,
        config: BotConfig,
        sqliteTemplate: SqliteTemplate,
        template: Template,
        callLimiter: CallLimiter
        __data_dir: string,
        __interceptor_dir: string,
        __build_dir: string,
        __src_dir: string
    }) {
        this.bot = mem.bot;
        this.sqliteTemplate = mem.sqliteTemplate;
        this.template = mem.template;
        this.callLimiter = mem.callLimiter;
        this.__data_dir = mem.__data_dir;
        this.__interceptor_dir = mem.__interceptor_dir;
        this.__build_dir = mem.__build_dir;
        this.__src_dir = mem.__src_dir;
    }

    getMethodConfig<T extends {} = {}>(name: string) {
        try {
            const configPath = path.join(this.__data_dir, `config/method/${name}.json`)
            if (fs.existsSync(configPath)) {
                const fileData = fs.readFileSync(configPath, "utf-8")
                return JSON.parse(fileData) as T
            }
        } catch {
            // Do nothing
        }
        return {} as T
    }
}
