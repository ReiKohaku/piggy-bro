import {MessageProcessor} from "../lib/MessageProcessor";
import {template} from "../bot";

const mp = new MessageProcessor()
mp.on("error", (message, error) => {
    if (error.message === "ERR_CANNOT_GET_KEY")
        return template.use("error.api.key.missing")
    else if (error.message === "ERR_CALL_LIMIT")
        return template.use("error.api.call.limit")
    else if (error.message === "ERR_CALL_NO_PERMISSION")
        return template.use("error.api.call.no_permission")
    else {
        console.error(template.use("on.error"))
        console.error(error)
        return template.use("error.unknown")
    }
})

import hello from "./method/hello"
import idiom from "./method/idiom"
import joke from "./method/joke"
import weibo from "./method/weibo"
import weather from "./method/weather"
import neteaseCloudMusic from "./method/netease-cloud-music"
mp.interceptor(hello)
mp.interceptor(idiom)
mp.interceptor(joke)
mp.interceptor(weibo)
mp.interceptor(weather)
mp.interceptor(neteaseCloudMusic)

export {mp}
