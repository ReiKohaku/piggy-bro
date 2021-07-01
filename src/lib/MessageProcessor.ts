/*
  这个文件将会提供一个用来处理消息的类。调用
  process 函数后，消息将依次传入拦截器中。如
  果拦截器返回了文本，则以此文本应答；如果没有
  匹配到任何命令，消息会忽略，原样传递给下个处
  理器。
*/
import {Message} from "wechaty";

type Interceptor =
    ((message: Message) => string) |
    ((message: Message) => string | void) |
    ((message: Message) => Promise<string>) |
    ((message: Message) => Promise<string | void>)

export class MessageProcessor {
    private interceptors: Array<Interceptor> = []

    public interceptor(interceptor: Interceptor): void {
        if (!this.interceptors.includes(interceptor)) this.interceptors.push(interceptor)
    }
    /**
     * 如果这个方法返回了文本，则将这个消息发送给来到时的会话
     * 否则，传递消息给下一个处理器
     */
    public async process(message: Message): Promise<string | null> {
        if (message.age() > 60) {
            // 消息到来太晚，不做响应
            return ""
        }
        for (const f of this.interceptors) {
            if (!f) continue
            const result = await f(message)
            if (typeof result === "string") return result
        }
        return null
    }
}
