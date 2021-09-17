import {IncomingMessage, ServerResponse} from "http";
import routes from "./routes";

export default class Router {
    public static async get(req: IncomingMessage, res: ServerResponse) {
        res.setHeader("Content-Type", "application/json; charset=utf-8")
        const pathname = req.url;
        for (const route of routes) {
            if (route.path === pathname) {
                if (route.method && !route.method.split(",").map(m => m.toUpperCase()).includes("GET")) {
                    res.writeHead(405);
                    res.end();
                    return;
                }
                const result = await route.handler(req, res);
                if (result) res.end(result);
                break;
            }
        }
    }

    public static async post(req: IncomingMessage, res: ServerResponse) {
        res.setHeader("Content-Type", "application/json; charset=utf-8")
        const pathname = req.url;
        for (const route of routes) {
            if (route.method && !route.method.split(",").map(m => m.toUpperCase()).includes("POST")) {
                res.writeHead(405);
                res.end();
                return;
            }
            if (route.path === pathname) {
                let data
                req.on("data", function (chunk) {
                    if (!data) data = chunk
                    else data += chunk
                })
                req.on("end", async function () {
                    const result = await route.handler(req, res, data);
                    if (result) res.end(result);
                })
                break;
            }
        }
    }
}
