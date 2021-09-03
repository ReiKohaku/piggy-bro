import {RouteHandler} from "../../router/routes";
import {success} from "../../ResponseGenerator";
import {startAt, wechaty} from "../../../bot";

const handler: RouteHandler = () => {
    const userSelf = (() => {
        try {
            return wechaty.userSelf()
        } catch {
            return null
        }
    })()
    return success({
        name: userSelf ? userSelf.name : null,
        startAt: startAt,
        mem: process.memoryUsage()
    })
}

export default handler
