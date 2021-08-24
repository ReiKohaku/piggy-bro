import fs from "fs";
import path from "path";
import {__data_dir} from "../../bot";

/**
 * 获取指定API的密钥，如果密钥不存在会抛出“ERR_CANNOT_GET_KEY”异常
 * @param {string} name 要获取密钥的API的名称
 * @returns {string} 目标API密钥
 */
export function getAPIKey(name: string): string {
    try {
        const data = fs.readFileSync(path.join(__data_dir, "./api/juheapi.json"), "utf-8")
        const dataParsed = JSON.parse(data)
        if (!dataParsed.key) throw new Error("Property \"key\" not defined")
        if (!dataParsed.key[name]) throw new Error("Property \"key." + name + "\" not defined")
        if (typeof dataParsed.key[name] !== "string")
            throw new Error("Property \"key." + name + "\" is not string")
        return dataParsed.key[name]
    } catch (e) {
        console.error("获取 JuheAPI[" + name + "] 的密钥时出错")
        console.error(e)
        throw new Error("ERR_CANNOT_GET_KEY")
    }
}
