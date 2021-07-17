/**
 * 讲笑话功能
 * 本文件提供讲笑话的实现，默认提供的是 聚合数据 API的实现。
 * 如果需要自己扩展实现，可以参照默认实现编写函数。
 */
import {Message} from "wechaty";
import {template} from "../../../bot";

template.add("joke.success", [
    "好嘞，给您讲个笑话图一乐：<br/>{content}",
    "笑话来咯：<br/>{content}",
    "行，给老板讲个段子：<br/>{content}"
])

import JuheAPIJoke from "./juheapi"

export default async function (message: Message) {
    if (message.text().match(/^(二师兄.*)讲个?(笑话|段子)/)) {
        try {
            const result: string = await JuheAPIJoke()
            if (result && result.length > 0) {
                return template.use("joke.success", {
                    content: result
                })
            }
        } catch (e) {
            return e.toString()
        }
    }
}
