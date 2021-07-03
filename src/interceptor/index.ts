import {MessageProcessor} from "../lib/MessageProcessor";

const mp = new MessageProcessor()
import hello from "./method/hello"
mp.interceptor(hello)

export {mp}
