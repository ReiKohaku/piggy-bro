import {Message} from "wechaty";
import {template} from "../../bot";

template.add("helloWorld", "Hello Wechaty!")

export default function (message: Message) {
    if (/^test$/.test(message.text()))
        return template.use("helloWorld")
}
