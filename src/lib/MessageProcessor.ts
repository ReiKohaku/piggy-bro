import {Contact, FileBox, Message, MiniProgram, UrlLink} from "wechaty";
import Interceptor, {MessageSayType} from "../interceptor/Interceptor";
import {template} from "../bot";

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
    public async process(message: Message): Promise<void | (Message | undefined)[]> {
        const send = (content: MessageSayType | void) => new Promise<void | Message>((resolve, reject) => {
            if (content === undefined ||
                content === null ||
                (content === "string" && content.length === 0)) resolve(void 0)
            else if (typeof content === "string") message.say(content).then(resolve).catch(reject)
            else if (typeof content === "number") message.say(content).then(resolve).catch(reject)
            else if (content instanceof Contact) message.say(content).then(resolve).catch(reject)
            else if (content instanceof FileBox) message.say(content).then(resolve).catch(reject)
            else if (content instanceof UrlLink) message.say(content).then(resolve).catch(reject)
            else if (content instanceof MiniProgram) message.say(content).then(resolve).catch(reject)
        })

        for (const i of this.interceptors) {
            if (!i) continue
            try {
                let checkResult: boolean = true
                let checkerArgs: Record<string, any> = {}
                for (const checker of i.$check) {
                    const result = await checker(message)
                    if (!result) {
                        checkResult = false
                        break
                    } else if (typeof result === "object") checkerArgs = {
                        ...checkerArgs,
                        ...result
                    }
                }
                if (!checkResult) continue

                const sentMessages: Array<Message | undefined> = []
                for (const handler of i.$handler) {
                    const result = await handler(message, checkerArgs)
                    if (typeof result === "string" && !result.length) continue
                    if (result) {
                        const sentMessage = await send(result)
                        sentMessages.push(sentMessage || undefined)
                    }
                }

                return sentMessages
            } catch (e) {
                const result = this.events.error(message, e)
                const sentMessage = await send(result)
                return [sentMessage || undefined]
            }
        }
        return void 0
    }

    public on<K extends EventName>(event: K, listener: EventMap[K]) {
        this.events[event] = listener
    }
}
