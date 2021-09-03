import mime from "mime";
import fs from "fs";
import path from "path";
import {ServerResponse} from "http";
import {isBinary} from "istextorbinary";

export default class Statics {
    public static get(pathname: string, res: ServerResponse) {
        const staticPath = path.join(__dirname, pathname);
        if (fs.existsSync(staticPath)) {
            try {
                const extname = path.extname(staticPath);
                const file = fs.readFileSync(staticPath);
                res.writeHead(200, {
                    "Content-Type": mime.getType(extname)
                });
                if (isBinary(null, file)) res.end(file, "binary");
                else res.end(file);
            } catch (e) {
                res.writeHead(500);
                res.end("Read file failed");
            }
        }
    }
}
