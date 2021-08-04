/**
 * 猜字谜 TianAPI实现
 * 关于 TianAPI 的密钥申请与配置，请参考 /docs 文件夹下的 TianAPI.md
 */

import Axios, {AxiosResponse} from "axios";
import {getKey} from "../../../lib/APIs/TianAPI";
export interface Puzzle {
    content: string
    answer: string
    reason: string
}
const axios = Axios.create()
export default function wordPuzzle(): Promise<Puzzle> {
    const key = getKey()
    return new Promise<Puzzle>((resolve, reject) => {
        axios({
            method: "GET",
            url: "http://api.tianapi.com/txapi/zimi/index",
            params: {key}
        }).then((value: AxiosResponse) => {
            if (value.data.code === 200) {
                const result: Puzzle[] = value.data.newslist
                resolve(result[0])
            }
            else if (value.data.code === 150)
                reject("ERR_CALL_LIMIT")
            else if (value.data.code === 160)
                reject("ERR_CALL_NO_PERMISSION")
            else if (value.data.code) reject(value.data.code)
            else reject()
        }).catch(reject)
    })
}
