import {Contact, FileBox, Message, MiniProgram, UrlLink} from "wechaty";

export type MessageSayType = string | number | Contact | FileBox | UrlLink | MiniProgram

export namespace Interceptor {
    export type Checker = (message: Message) => void | boolean | Record<string, any> | Promise<void | boolean | Record<string, any>>
    export type Handler = (message: Message, checkerArgs: Record<string, any>) => void | MessageSayType | Promise<void | MessageSayType>
    export type Usage = string | ((message: Message) => string | Promise<string>)
}

export default class Interceptor {
    #check: Interceptor.Checker[] = []
    #handler: Interceptor.Handler[] = []
    #usage: Interceptor.Usage | undefined

    constructor() {
        return this
    }

    get $check() {
        return this.#check
    }

    get $handler() {
        return this.#handler
    }

    get $usage() {
        return this.#usage
    }

    public check(checker: Interceptor.Checker, append?: boolean) {
        if (append) this.#check.unshift(checker)
        else this.#check.push(checker)
        return this
    }

    /**
     *
     * @param handler 用于处理事件的函数
     * @param append 是否将该函数前置，提供true将会把函数插入到队列最前方，否则插入到最后方
     */
    public handler(handler: Interceptor.Handler, append?: boolean) {
        if (append) this.#handler.unshift(handler)
        else this.#handler.push(handler)
        return this
    }

    public usage(usage: Interceptor.Usage) {
        this.#usage = usage
        return this
    }
}
