import {Contact, FileBox, Message, MiniProgram, UrlLink} from "wechaty";
import Attribute = Interceptor.Attribute;

export type MessageSayType = string | number | Contact | FileBox | UrlLink | MiniProgram
type BasicType = string | number | boolean | any[] | Record<string, any>

export namespace Interceptor {
    export type Checker = (message: Message, checkerArgs: Record<string, any>) => void | boolean | Record<string, any> | Promise<void | boolean | Record<string, any>>
    export type Handler = (message: Message, checkerArgs: Record<string, any>) => void | MessageSayType | Promise<void | MessageSayType>
    export type Usage = string | ((message?: Message) => string | Promise<string>)
    export type Attribute = BasicType | ((...args: any) => BasicType | Promise<BasicType>)
}

export default class Interceptor {
    #name: string
    #title: string
    #alias: string[] = []
    #check: Interceptor.Checker[] = []
    #handler: Interceptor.Handler[] = []
    #usage: Interceptor.Usage | undefined
    #attributes: Record<string, { desc?: string, handler: Attribute }> = {}

    constructor(name: string) {
        if (name.match(/\s/)) throw new Error(`Cannot create interceptor: name cannot includes space: ${name}`)
        this.#name = name
        return this
    }

    get $name() {
        return this.#name
    }

    get $title() {
        return this.#title || this.#name
    }

    get $alias() {
        return this.#alias
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

    public async $attributes(...args: any): Promise<Record<string, { desc?: string, data: BasicType }>> {
        const result: Record<string, { desc?: string, data: BasicType }> = {}
        for (const a in this.#attributes) {
            const attr = this.#attributes[a]
            result[a] = {
                desc: attr.desc,
                data: (typeof attr.handler === "function") ? await attr.handler(...args) : attr.handler
            }
        }
        return result
    }

    public title(title: string) {
        if (!this.#alias.includes(title) && this.#name !== title) this.#title = title
        return this
    }

    public alias(alias: string) {
        if (!this.#alias.includes(alias) && this.#name !== alias && this.#title !== alias) this.#alias.push(alias);
        return this
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

    public attribute(name: string, attribute: Interceptor.Attribute, desc?: string) {
        this.#attributes[name] = {
            desc, handler: attribute
        };
        return this
    }
}
