import {RouteHandler} from "../../router/routes";
import {success} from "../../ResponseGenerator";
import {startAt, wechaty} from "../../../bot";

const handler: RouteHandler = async () => {
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
        mem: process.memoryUsage()
    })
}

export default handler
