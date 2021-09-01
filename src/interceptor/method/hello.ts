import {template} from "../../bot";
import Interceptor from "../Interceptor";

template.add("helloWorld", "Hello Wechaty!")

const HelloInterceptor = new Interceptor("Hello")
    .check(message => {
        return /^test$/.test(message.text())
    })
    .handler(() => {
        return template.use("helloWorld")
    })
    .usage("Hello World：Hello World 模块")
export default HelloInterceptor
