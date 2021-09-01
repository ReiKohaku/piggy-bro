import {Contact, FileBox, Message, MiniProgram, UrlLink} from "wechaty";

export type MessageSayType = string | number | Contact | FileBox | UrlLink | MiniProgram

export namespace Interceptor {
    export type Checker = (message: Message, checkerArgs: Record<string, any>) => void | boolean | Record<string, any> | Promise<void | boolean | Record<string, any>>
    export type Handler = (message: Message, checkerArgs: Record<string, any>) => void | MessageSayType | Promise<void | MessageSayType>
    export type Usage = string | ((message?: Message) => string | Promise<string>)
}

const usedNameList: string[] = []
const usedAliasList: { interceptor: string, alias: string }[] = []

export default class Interceptor {
    #name: string
    #alias: string[] = []
    #check: Interceptor.Checker[] = []
    #handler: Interceptor.Handler[] = []
    #usage: Interceptor.Usage | undefined

    constructor(name: string) {
        if (name.match(/\s/)) throw new Error(`Cannot create interceptor: name cannot includes space: ${name}`)
        if (usedNameList.includes(name)) throw new Error(`Cannot create interceptor: name already exists: ${name}`)
        this.#name = name
        usedNameList.push(name)
        return this
    }

    get $name() {
        return this.#name
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

    public alias(alias: string) {
        if (usedNameList.includes(alias)) throw new Error(`Cannot add alias: there has an interceptor named ${alias}`)
        for (const usedAlias of usedAliasList) {
            if (usedAlias.alias === alias) throw new Error(`Cannot add alias: alias ${alias} already used by interceptor ${usedAlias.interceptor}`)
        }
        if (!this.#alias.includes(alias)) {
            this.#alias.push(alias);
            usedAliasList.push({ interceptor: this.#name, alias })
        }
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
}
