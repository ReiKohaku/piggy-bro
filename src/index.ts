// 入口是守护程序，目的是让bot在意外结束时不至于直接被关闭
// 同时也支持运行多个bot实例
import ChildProcess from "child_process"
import Path from "path"
function createBot() {
    const botProcess = ChildProcess.fork(Path.join(__dirname, "./bot"))
    botProcess.on("exit", function (code: number) {
        console.log("Bot exited with exit code " + code)
        if (code !== 0) {
            console.log("Restarting...")
            createBot()
        }
    })
    botProcess.on("error", function (e) {
        console.log("Bot error: " + e)
        console.log("Restarting...")
        createBot()
    })
}
createBot()
