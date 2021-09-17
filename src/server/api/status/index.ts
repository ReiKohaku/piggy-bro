import {RouteHandler} from "../../router/routes";
import {success} from "../../ResponseGenerator";
import {startAt, wechaty} from "../../../bot";
import {mp} from "../../../interceptor";

const parse = (str: string) => {
    try {
        return JSON.parse(str)
    } catch {
        return null
    }
}

const handler: RouteHandler = async (req, res, data) => {
    const args = data ? parse(typeof data === "string" ? data : data.toString("utf-8")) : {}
    const userSelf = (() => {
        try {
            return wechaty.userSelf()
        } catch {
            return null
        }
    })()

    return success({
        isLogin: !!userSelf,
        name: userSelf ? userSelf.name() : null,
        avatar: userSelf ? `data:image/png;base64,${await (await userSelf.avatar()).toBase64()}` : null,
        startAt: startAt,
        mem: process.memoryUsage(),
        attributes: await mp.attributes(args)
    })
}

export default handler
