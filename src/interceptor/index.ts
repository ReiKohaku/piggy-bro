import {MessageProcessor} from "../lib/MessageProcessor";
import {Message} from "wechaty";

const mp = new MessageProcessor()
mp.interceptor(function (message: Message): string | void {
    if (message.text().toLowerCase().match(/^test$/))
        return "Hello Wechaty!"
})
mp.interceptor(async function (message: Message): Promise<string | void> {
    if (message.text().toLowerCase().match(/^restart$/)) {
        await message.say("正在终止并重启bot进程……")
        process.exit(233)
    }
})

export {mp}
