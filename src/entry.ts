// 入口是守护程序，目的是让bot在意外结束时不至于直接被关闭
// 同时也支持运行多个bot实例
import ChildProcess from "child_process"
import Path from "path"
import "./better-console"
import path from "path";
import fs from "fs";

interface GuardConfig {
    autoRestart: boolean
}
const defaultGuardConfig: GuardConfig = {
    autoRestart: false
}
const guardConfig: GuardConfig = (function () {
    try {
        return {
            ...defaultGuardConfig,
            ...JSON.parse(fs.readFileSync(path.join(__dirname, "../data/config/guard.json"), "utf-8")) as GuardConfig
        };
    } catch {
        return defaultGuardConfig;
    }
})()

function createBot() {
    const botProcess = ChildProcess.fork(Path.join(__dirname, "./bot"))
    botProcess.on("exit", function (code: number) {
        console.log("机器人进程已退出，退出码：" + code)
        if (code !== 0 && guardConfig.autoRestart) {
            console.log("正在重新启动……")
            createBot()
        }
    })
    botProcess.on("error", function (e) {
        console.log("机器人进程发生错误：" + e)
        if (guardConfig.autoRestart) {
            console.log("正在重新启动……")
            createBot()
        }
    })
}
createBot()
