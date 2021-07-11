// 爬取成语库的工具
// 数据来源：2345成语大全
import Axios from "axios"
import iconv from "iconv-lite"
import fs from "fs";
import path from "path";
import {mkdirSync} from "../src/lib/Util";
const axios = Axios.create()
const capital = ["A", "B", "C", "D", "E", "F", "G", "H", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "V", "W", "X", "Y", "Z"]
async function getIdioms(): Promise<string[]> {
    const idioms = new Array<string>()
    for (const c of capital) {
        console.log(`正在扫描 ${c} 开头的成语……`)
        let currentPage = `http://tools.2345.com/chengyu/${c}/${c}.htm`
        do {
            console.log(`正在扫描页面：${currentPage}`)
            const response = await axios.get(currentPage, {
                responseType: "arraybuffer"
            })
            const data: string = iconv.decode(Buffer.from(response.data), "gbk")
            const idiomMatch = data.match(/<li><a\s*href=".*?"\s*title=".*?">(.*?)<\/a><\/li>/g)
            for (const idiomMatchRow of idiomMatch) {
                const idiom = idiomMatchRow.match(/<li><a\s*href=".*?"\s*title=".*?">(.*?)<\/a><\/li>/)[1]
                idioms.push(idiom)
            }
            const nextPageMatch = data.match(/<a\s*class="next"\s*href="(.*?)">下一页<\/a>/)
            const next = nextPageMatch ? `http://tools.2345.com/chengyu/${c}/${nextPageMatch[1]}` : null
            currentPage = (next && next !== currentPage) ? next : null
        } while (currentPage)
    }
    return idioms
}
getIdioms().then(idioms => {
    mkdirSync(path.join(__dirname, "../data/idioms"))
    fs.writeFileSync(path.join(__dirname, "../data/idioms/idioms.json"), JSON.stringify(idioms), {
        encoding: "utf-8"
    })
    console.log(`已写出 ${idioms.length} 个成语。`)
})
