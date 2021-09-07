/**
 * 讲笑话功能
 * 本文件提供讲笑话的实现，默认提供的是 聚合数据 API的实现。
 * 如果需要自己扩展实现，可以参照默认实现编写函数。
 */
import {template} from "../../../bot";

template.add("joke.success", [
    "好嘞，给您讲个笑话图一乐：<br/>{content}",
    "笑话来咯：<br/>{content}",
    "行，给老板讲个段子：<br/>{content}"
])
template.add("joke.failed", "哎呀，二师兄没找到合适的笑话。等会再来试试？")

import JuheAPIJoke from "./juheapi"
import Interceptor from "../../Interceptor";

const jokeInterceptor = new Interceptor("joke")
    .title("讲笑话")
    .alias("笑话")
    .alias("讲段子")
    .alias("段子")
    .check(message => /^(二师兄.*)讲个?(笑话|段子)/.test(message.text()))
    .handler(async () => {
        const result: string = await JuheAPIJoke()
        if (result && result.length > 0) {
            return template.use("joke.success", {
                content: result
            })
        } else {
            return template.use("joke.failed")
        }
    })
export default jokeInterceptor
