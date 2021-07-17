/*
查天气功能
本文件提供查天气功能的实现，默认提供的是 彩云天气 API实现。
 */

import {template} from "../../../bot";
import {Message} from "wechaty";

template.add("weather.location.unknown", "二师兄不知道你说的是哪里，确认一下？")
template.add("weather.success", "{address}的天气情况：<br/>{weather}<br/>温度：{temperature}")

// 将具体实现引用放在后面，就可以在该引用文件里使用 template.set 来修改默认的返回值
import caiyunWeather, {dressingDict, skyconDict, toAqiDesc, ultravioletDict} from "./caiyunapi";
import {place} from "../../../lib/APIs/CaiyunAPI";

export default async function (message: Message) {
    if (/^二师兄/.test(message.text()) &&
        (/查(.*)的?天气/.test(message.text()) || /(.*)的?天气(如何|怎么?样)/.test(message.text()))) {
        const text = message.text().replace(/^二师兄[，。,.\s]*/, "")
        const matchArg = () => {
            if (text.match(/查(.*)的?天气/)) return text.match(/查(.*)的?天气/)[1]
            else if (text.match(/(.*)的?天气(如何|怎么?样)/))
                return text.match(/(.*)的?天气(如何|怎么?样)/)[1]
            else return undefined
        }
        const arg = matchArg()
        if (!arg) return template.use("weather.location.unknown")
        else {
            const location = await place(arg)
            const data = await caiyunWeather(location.location.lng, location.location.lat)
            return template.use("weather.success", {
                address: `${location.name}（${location.address}）`,
                weather: skyconDict[data.result.realtime.skycon],
                temperature: data.result.realtime.temperature,
                apparent_temperature: data.result.realtime.apparent_temperature,
                aqi: `${data.result.realtime.air_quality.aqi.chn}（${toAqiDesc(data.result.realtime.air_quality.aqi.chn)}）`,
                comfort: `${data.result.realtime.life_index.comfort.index}（${dressingDict[data.result.realtime.life_index.comfort.index]}）`,
                ultraviolet: `${data.result.realtime.life_index.ultraviolet.index}（${ultravioletDict[data.result.realtime.life_index.ultraviolet.index]}）`
            })
        }
    }
}
