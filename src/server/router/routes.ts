import {success} from "../ResponseGenerator";
import {IncomingMessage, ServerResponse} from "http";

/**
 * 路由的处理函数。
 *
 * 需注意：
 *
 * 如果返回了string，则路由会自动调用 res.end() 将返回的内容追加到响应内容的末尾。
 *
 * 如果返回为空值，则不会对响应做任何的操作，需要自己在函数内部调用 res.end() 结束调用，否则响应将会卡死。
 */
export type RouteHandler = (req: IncomingMessage, res: ServerResponse, data?: string | Buffer) => string | void | Promise<string | void>

export interface Route {
    path: string
    method?: string
    handler: RouteHandler
    meta?: Record<string, any>
}

import wiki from "../api/wiki"
import status from "../api/status"

const routes: Route[] = [
    { path: "/api", handler: () => success("Hello Piggy Bro!") },
    { path: "/api/wiki", handler: wiki, method: "GET,POST" },
    { path: "/api/status", handler: status, method: "GET,POST" }
]

export default routes
