/*
  这个文件将会提供一个用来处理消息的类。调用
  process 函数后，消息将依次传入拦截器中。如
  果拦截器返回了文本，则以此文本应答；如果没有
  匹配到任何命令，消息会忽略，原样传递给下个处
  理器。
*/
import {Contact, Message, FileBox, UrlLink, MiniProgram} from "wechaty";
import {template} from "../bot";

type MessageSayType = string | number | Contact | FileBox | UrlLink | MiniProgram

type Interceptor =
    ((message: Message) => MessageSayType) |
    ((message: Message) => MessageSayType | void) |
    ((message: Message) => Promise<MessageSayType>) |
    ((message: Message) => Promise<MessageSayType | void>)

interface EventMap {
    'error'(message: Message, error: any): any
}
type EventName = keyof EventMap

export class MessageProcessor {
    private interceptors: Array<Interceptor> = []
    private events: EventMap = {
        'error'(message, error) {
            console.warn(template.use("on.error"))
            console.warn(error)
        }
    }

    public interceptor(interceptor: Interceptor): void {
        if (!this.interceptors.includes(interceptor)) this.interceptors.push(interceptor)
    }
    /**
     * 如果这个方法返回了文本，则将这个消息发送给来到时的会话
     * 否则，传递消息给下一个处理器
     */
    public async process(message: Message): Promise<MessageSayType | null> {
        for (const f of this.interceptors) {
            if (!f) continue
            try {
                const result = await f(message)
                if (typeof result === "number" || result) return result
            } catch (e) {
                const result = this.events.error(message, e)
                if (typeof result === "number" || result) return result
            }

        }
        return null
    }

    public on<K extends EventName>(event: K, listener: EventMap[K]) {
        this.events[event] = listener
    }
}
