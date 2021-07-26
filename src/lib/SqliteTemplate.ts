import Sqlite3 from "sqlite3"
import fs from "fs"
import {mkdirSync} from "./Util";
const Database = Sqlite3.verbose().Database
export default class SqliteTemplate {
    private readonly file: string
    constructor(file: string) {
        const path = file.substring(0, file.replace('\\', '/').lastIndexOf('/'))
        if (!fs.existsSync(file)) {
            console.warn("File not exists: " + file + ", will create it automatically.")
            mkdirSync(path)
        }
        this.file = file
    }

    public run(sql: string, ...params: any[]): Promise<{ changes: number, lastID: number }> {
        return new Promise((resolve, reject) => {
            const db = new Database(this.file)
            db.run(sql, params, function (err: Error | null) {
                const {changes, lastID} = this
                if (err) reject(err)
                else resolve({changes, lastID})
                db.close(function (closeErr) {
                    if (closeErr) console.error(closeErr)
                })
            })
        })
    }

    public get<T>(sql: string, ...params: any[]): Promise<T> {
        return new Promise<T>((resolve, reject) => {
            const db = new Database(this.file)
            db.get(sql, params, function (err: Error | null, row: any) {
                if (err) reject(err)
                else resolve(row as T)
                db.close(function (closeErr) {
                    if (closeErr) console.error(closeErr)
                })
            })
        })
    }

    public all<T>(sql: string, ...params: any[]): Promise<T[]> {
        return new Promise<T[]>((resolve, reject) => {
            const db = new Database(this.file)
            db.get(sql, params, function (err: Error | null, rows: any[]) {
                if (err) reject(err)
                else resolve(rows as T[])
                db.close(function (closeErr) {
                    if (closeErr) console.error(closeErr)
                })
            })
        })
    }

    public getConnection(): Sqlite3.Database {
        return new Database(this.file)
    }
}
