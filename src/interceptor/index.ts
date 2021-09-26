import {MessageProcessor} from "../lib/MessageProcessor";
import {loadBotConfig} from "../lib/BotConfig";
import {
    __build_dir,
    __data_dir,
    __interceptor_dir,
    __src_dir,
    callLimiter,
    sqliteTemplate,
    template,
    wechaty
} from "../bot";
import path from "path";
import fs from "fs";
import Context from "../lib/Context";
import {isAbsolute} from "../lib/Util";

const botConfig = loadBotConfig();
const context = new Context({
    bot: wechaty,
    config: botConfig,
    sqliteTemplate: sqliteTemplate,
    template: template,
    callLimiter: callLimiter,
    __data_dir: __data_dir,
    __src_dir: __src_dir,
    __build_dir: __build_dir,
    __interceptor_dir: __interceptor_dir
})
const mp = new MessageProcessor(context)

mp.on("error", (message, error) => {
    if (error.message === "ERR_CANNOT_GET_KEY")
        return context.template.use("error.api.key.missing")
    else if (error.message === "ERR_CALL_LIMIT")
        return context.template.use("error.api.call.limit")
    else if (error.message === "ERR_CALL_NO_PERMISSION")
        return context.template.use("error.api.call.no_permission")
    else {
        console.error(context.template.use("on.error"))
        console.error(error)
        return context.template.use("error.unknown")
    }
})

const enabledInterceptorList = botConfig.interceptor.enable || []
const loadInterceptor = async function () {
    let count = 0;
    for (const n of enabledInterceptorList) {
        const interceptor = await (async function () {
            try {
                if (isAbsolute(n)) return (await import(n)).default;
                else if (fs.existsSync(path.join(__data_dir, `./interceptor/${n}`))) return (await import(path.join(__data_dir, `./interceptor/${n}`))).default;
                else if (fs.existsSync(path.join(__data_dir, `./interceptor/${n}.js`))) return (await import(path.join(__data_dir, `./interceptor/${n}.js`))).default;
                return (await import(`./method/${n}`)).default;
            } catch (e) {
                console.warn(`Error occurred when import interceptor "${n}":`);
                console.warn(e);
                return null;
            }
        })();
        try {
            await mp.interceptor(interceptor);
            count++;
        } catch (e) {
            console.warn(`Error occurred when regist interceptor "${n}":`);
            console.warn(e);
        }

    }
    console.log(context.template.use("on.load.finish", { count }));
}
void loadInterceptor();

export {mp}
