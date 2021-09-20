import Interceptor from "../Interceptor";



const HelloInterceptor = new Interceptor("Hello", context => {
    context.template.add("helloWorld", "Hello Wechaty!")
})
    .check((context, message) => {
        return /^test$/.test(message.text())
    })
    .handler((context) => {
        return context.template.use("helloWorld")
    })
    .attribute("date", () => new Date(), "当前时间")
export default HelloInterceptor
