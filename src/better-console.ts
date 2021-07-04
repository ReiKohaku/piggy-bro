const log = console.log
const warn = console.warn
const error = console.error
console.log = (...data: any) => {
    log("%s \x1b[0m", "\x1b[34m[I] \x1b[36mPiggy Bro", ...data)
}
console.warn = (...data: any) => {
    warn("%s \x1b[0m", "\x1b[33m[W] \x1b[36mPiggy Bro", ...data)
}
console.error = (...data: any) => {
    error("%s \x1b[0m", "\x1b[31m[E] \x1b[36mPiggy Bro", ...data)
}
