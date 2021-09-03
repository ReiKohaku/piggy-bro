import http from "http";
import router from "./router";
import statics from "./statics";

const staticExp = /\/public\/(img|css|js)\/[a-z]*\.(jpg|png|gif|webp|css|js)/

export default function (port: number = 8088) {
    http.createServer(async (req, res) => {
        const pathname = req.url;
        if (staticExp.test(pathname)) statics.get(pathname, res);
        else if (req.method.toUpperCase() === "POST") await router.post(req, res);
        else if (req.method.toUpperCase() === "GET") await router.get(req, res);
        else {
            res.statusCode = 405;
            res.end();
        }
    }).listen(port);
    console.log("[Server]", `Backend server started at http://0.0.0.0:${port}`)
}
