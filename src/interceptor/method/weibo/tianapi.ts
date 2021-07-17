/**
 * 热搜查询 TianAPI实现
 * 关于 TianAPI 的密钥申请与配置，请参考 /docs 文件夹下的 TianAPI.md
 */

import Axios, {AxiosResponse} from "axios";
import {getKey} from "../../../lib/APIs/TianAPI";
import {HotKey} from "./index";
const axios = Axios.create()
export default function weiboHot(): Promise<HotKey[]> {
    const key = getKey()
    return new Promise<HotKey[]>((resolve, reject) => {
        axios({
            method: "GET",
            url: "http://api.tianapi.com/txapi/weibohot/index",
            params: {key}
        }).then((value: AxiosResponse) => {
            if (value.data.code === 200) {
                // Tian API 返回的是50条微博热搜，但是没有标注“热”、“爆”、“沸”等标签。
                // 可以根据需要自己对返回值做调整。这里默认只返回前十的热搜。
                const result: HotKey[] = value.data.newslist.map(k => {
                    return {
                        key: k.hotword,
                        hot: k.hotwordnum
                    } as HotKey
                })
                resolve(result.slice(0, 10))
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
