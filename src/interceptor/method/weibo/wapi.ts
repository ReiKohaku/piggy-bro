/**
 * 热搜查询 WAPI实现
 * 偷偷讲：这个API是从公开页面上扒下来的，属于白嫖行为，不知道能坚持多久
 */
import Axios, {AxiosResponse} from "axios"
import {HotKey} from "./index";
const axios = Axios.create()
interface WapiHotKey {
    w_key: string
    w_hot: number
    w_label: string
    w_time: string
}
export default function hotSearch(): Promise<HotKey[]> {
    return new Promise<HotKey[]>((resolve, reject) => {
        axios({
            method: "POST",
            url: "https://www.wapi.cn/other/hot_search",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            data: `r=${Math.random()}&t=1hour&keyword=`
        }).then((value: AxiosResponse) => {
            if (value.data.codeid === 10000) {
                const hotSearchList = value.data.retdata as Array<WapiHotKey[]>
                const latestHotSearch = hotSearchList[hotSearchList.length - 1]
                latestHotSearch.sort((a, b) => b.w_hot - a.w_hot)
                resolve(latestHotSearch.map(h => {
                    return {
                        key: h.w_key,
                        hot: h.w_hot,
                        isHot: h.w_label.includes("热"),
                        isExplosive: h.w_label.includes("爆"),
                        isBoiled: h.w_label.includes("沸"),
                        isNew: h.w_label.includes("新")
                    } as HotKey
                }))
            } else if (value.data.codeid === 10010)
                reject("ERR_CALL_NO_PERMISSION")
            else if (value.data.codeid === 10018)
                reject("ERR_CALL_LIMIT")
            else reject(value.data.message)
        }).catch(reject)
    })
}
