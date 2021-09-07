import {RouteHandler} from "../../router/routes";
import {error, success} from "../../ResponseGenerator";
import fs from "fs";
import path from "path";
import {__build_dir, __interceptor_dir, __src_dir} from "../../../bot";
import {mp} from "../../../interceptor";

const parse = (str: string) => {
    try {
        return JSON.parse(str)
    } catch {
        return null
    }
}

const handler: RouteHandler = (req, res, data) => {
    if (!data) return success(mp.list());
    const params = parse(typeof data === "string" ? data : data.toString("utf-8"))
    if (!params) return error("ERR_PARAM_INVALID")

    const { name } = params
    if (!name) return error("ERR_PARAM_INVALID")

    const fileBuildDir = path.join(__interceptor_dir, `./method/${name}`)
    const fileSrcDir = fileBuildDir.replace(__build_dir, __src_dir)
    if (!fs.existsSync(fileBuildDir)) return error("ERR_METHOD_NOT_EXISTS")
    const fileBuildPath = path.join(fileBuildDir, "./README.md")
    if (fs.existsSync(fileBuildPath)) return success(fs.readFileSync(fileBuildPath, "utf-8"))
    const fileSrcPath = path.join(fileSrcDir, "./README.md")
    if (fs.existsSync(fileSrcPath)) return success(fs.readFileSync(fileSrcPath, "utf-8"))
    return success("")
}

export default handler
