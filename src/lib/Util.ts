import path from "path";
import fs from "fs";
import {__data_dir} from "../bot";

export function mkdirSync(dirPath: string) {
    if (dirPath === null || dirPath === "") return
    dirPath = isAbsolute(dirPath) ? path.normalize(dirPath) : path.join(process.cwd(), dirPath)
    if (fs.existsSync(dirPath)) return

    const arr = dirPath.split(path.sep)
    let index = arr.length - 1
    let tempStr = arr[index]
    while (tempStr === "" && arr.length > 0) {
        index--;
        tempStr = arr[index]
    }
    if (tempStr === "") return
    const newPath = dirPath.substring(0, dirPath.length - tempStr.length - 1)
    if (!fs.existsSync(newPath)) mkdirSync(newPath)
    fs.mkdirSync(dirPath)
}

function isAbsolute(filePath: string) {
    filePath = path.normalize(filePath)
    if (filePath.substring(0, 1) === "/") return true
    return filePath.search(/[\w]+:/) === 0

}

export function getMethodConfig<T extends {} = {}>(name: string) {
    try {
        const configPath = path.join(__data_dir, `config/method/${name}.json`)
        if (fs.existsSync(configPath)) {
            const fileData = fs.readFileSync(configPath, "utf-8")
            return JSON.parse(fileData) as T
        }
    } catch {

    }
    return {} as T
}
