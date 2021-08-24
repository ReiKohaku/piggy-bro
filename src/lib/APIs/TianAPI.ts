import fs from "fs";
import {__data_dir} from "../../bot";
import path from "path";

export function getKey(): string {
    try {
        const data = fs.readFileSync(path.join(__data_dir, "./api/tianapi.json"), "utf-8")
        const dataParsed = JSON.parse(data)
        if (!dataParsed.key) throw new Error("Property \"key\" not defined")
        if (typeof dataParsed.key !== "string") throw new Error("Property \"key\" is not string")
        return dataParsed.key
    } catch (e) {
        console.error("获取 TianAPI 的密钥时出错")
        console.error(e)
        throw new Error("ERR_CANNOT_GET_KEY")
    }
}
