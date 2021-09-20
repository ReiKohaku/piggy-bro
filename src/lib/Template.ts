/*
  Template 类的作用是提供一个文本模板。
  预先设定好模板后，在指定的地方使用模板并提供变量，
  就可以返回预先设定好的应答。
  这样设计的优点是方便随时替换应答文本，简化代码。
 */
export default class Template {
    private templates: Record<string, string[] | string>
    constructor() {
        this.templates = {}
    }

    /**
     * 添加指定键值。
     * 如果目标键已经有了值，将不会做任何改动。
     */
    public add(name: string, value: string | string[]): void {
        if (!this.templates[name]) this.templates[name] = value
    }

    /**
     * 设定指定键值。如果先前键值包含一个值，将返回这个值。
     * 这个方法和 add() 的区别是，如果指定键已经有了值将不会替换，但这个方法会。
     */
    public set(name: string, value: string | string[]): string | string[] | void {
        const ori = this.templates[name]
        this.templates[name] = value
        if (ori) return ori
    }

    public use(name: string, args?: Record<string, any> | Array<any>): string {
        if (!this.templates[name]) {
            console.warn("Cannot find key \"" + name + "\", will return original key.")
            return name
        }
        const originalValue = this.templates[name]
        const value: string = Array.isArray(originalValue) ?
            originalValue[Math.floor(Math.random() * originalValue.length)] :
            originalValue
        if (args) return value.replace(/{.*?}/g, function (match) {
            const matchedArg = match.match(/{(.*)}/)[1]
            if (args[matchedArg] || (typeof args[matchedArg] === "number" && args[matchedArg] === 0)) return args[matchedArg]
            else return match
        })
        else return value
    }
}
