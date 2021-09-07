import Interceptor from "../../Interceptor";
import { mp } from "../../index";

const helpInterceptor = new Interceptor("help")
    .title("使用帮助")
    .alias("help")
    .check(message => {
        const text = message.text().replace(/^二师兄[，。,.\s]*/, "")
        if (/^二师兄(.*)?(使用帮助|怎么用|有(哪些|那些|什么|啥)功能)$/.test(message.text().toLowerCase())) return true
        else if (/(.*)怎么[用玩看找搜]/.test(text)) return {
            method: /(.*)怎么[用玩看找搜]/.exec(text)[1]
        }
    })
    .handler(async (message, checkerArgs) => {
        if (checkerArgs.method) {
            const usage = await mp.usage(checkerArgs.method, message)
            if (usage) return usage
        } else {
            const usages = await mp.usages(message)
            return usages.join("<br/>")
        }
    })
    .usage("使用帮助：获取二师兄的使用帮助")
export default helpInterceptor
