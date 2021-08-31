import {template} from "../../bot";
import Interceptor from "../Interceptor";

template.add("helloWorld", "Hello Wechaty!")

const HelloInterceptor = new Interceptor()
    .check(message => {
        return /^test$/.test(message.text())
    })
    .handler(() => {
        return template.use("helloWorld")
    })
export default HelloInterceptor
