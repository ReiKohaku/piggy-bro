const log = console.log
const warn = console.warn
const error = console.error
const getPrefix = (...data: any) => {
    let prefix = "Piggy Bro"
    let output = data
    if (typeof data[0] === "string" && /^\[(.*)]/.test(data[0])) {
        prefix = data[0].match(/^\[(.*)]/)[1]
        output = data.slice(1, data.length)
    }
    return { output, prefix }
}
console.log = (...data: any) => {
    const { prefix, output } = getPrefix(...data)
    log("%s \x1b[0m", `\x1b[34m[I] \x1b[36m${prefix}`, ...output)
}
console.warn = (...data: any) => {
    const { prefix, output } = getPrefix(...data)
    warn("%s \x1b[0m", `\x1b[33m[W] \x1b[36m${prefix}`, ...output)
}
console.error = (...data: any) => {
    const { prefix, output } = getPrefix(...data)
    error("%s \x1b[0m", `\x1b[31m[E] \x1b[36m${prefix}`, ...output)
}
