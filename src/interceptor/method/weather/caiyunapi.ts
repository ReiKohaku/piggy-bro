/**
 * 天气查询 彩云实现
 */

import {getAPIKey} from "../../../lib/APIs/CaiyunAPI";
import Axios, {AxiosResponse} from "axios";
import {template} from "../../../bot";
const axios = Axios.create()
interface CaiyunError {
    status: "failed"
    error: string
    api_version: string
}
// https://open.caiyunapp.com/%E5%AE%9E%E5%86%B5%E5%A4%A9%E6%B0%94%E6%8E%A5%E5%8F%A3/v2.5
export interface RealtimeWeather {
    status: string
    api_version: string
    api_status: string
    lang: string
    unit: string
    location: [number, number]
    server_time: number
    tzshift: number
    result: {
        realtime: {
            status: string
            temperature: number
            apparent_temperature: number
            pressure: number
            humidity: number
            wind: {
                direction: number
                speed: number
            }
            precipitation: {
                nearest: {
                    status: string
                    distance: number
                    intensity: number
                }
                local: {
                    status: string
                    intensity: number
                    datasource: string
                }
            }
            cloudrate: number
            dswrf: number
            visibility: number
            skycon: string
            life_index: {
                comfort: {
                    index: number
                    desc: string
                }
                ultraviolet: {
                    index: number
                    desc: string
                }
            }
            air_quality: {
                pm25: number
                pm10: number
                o3: number
                no2: number
                so2: number
                co: number
                aqi: {
                    chn: number
                    usa: number
                }
                description: {
                    usa: string
                    chn: string
                }
            }
        }
    }
}
export const skyconDict = {
    CLEAR_DAY: "晴（白天）",
    CLEAR_NIGHT: "晴（夜间）",
    PARTLY_CLOUDY_DAY: "多云（白天）",
    PARTLY_CLOUDY_NIGHT: "多云（夜间）",
    CLOUDY: "阴",
    LIGHT_HAZE: "轻度雾霾",
    MODERATE_HAZE: "中度雾霾",
    HEAVY_HAZE: "重度雾霾",
    LIGHT_RAIN: "小雨",
    MODERATE_RAIN: "中雨",
    HEAVY_RAIN: "大雨",
    STORM_RAIN: "暴雨",
    FOG: "雾",
    LIGHT_SNOW: "小雪",
    MODERATE_SNOW: "中雪",
    HEAVY_SNOW: "大雪",
    STORM_SNOW: "暴雪",
    DUST: "浮尘",
    SAND: "沙尘",
    WIND: "大风"
}

export const ultravioletDict = ["无", "很弱", "很弱", "弱", "弱", "中等", "中等", "强", "强", "很强", "很强", "极强"]
export const dressingDict = ["极热", "极热", "很热", "热", "温暖", "凉爽", "冷", "寒冷", "极冷"]
export const coldRiskDict = [null, "少发", "较易发", "易发", "极易发"]
export const toAqiDesc = (aqi: number): string => {
    if (aqi <= 50) return "优"
    else if (aqi <= 100) return "良"
    else if (aqi <= 200) return "轻度污染"
    else if (aqi <= 300) return "中度污染"
    else return "重度污染"
}

template.set("weather.success", "{address}的实时天气情况：<br/>{weather}<br/>温度：{temperature}℃<br/>体感温度：{apparent_temperature}℃<br/>空气质量：{aqi}<br/>舒适指数：{comfort}<br/>紫外线指数：{ultraviolet}<br/>以上数据来源于彩云天气")

export default function caiyunWeather(lng: number, lat: number): Promise<RealtimeWeather> {
    const apiKey = getAPIKey("weather")
    return new Promise<RealtimeWeather>((resolve, reject) => {
        axios({
            method: "GET",
            url: `https://api.caiyunapp.com/v2.5/${apiKey}/${lng},${lat}/realtime.json`,
            params: {
                lang: "zh-CN",
                unit: "metric"
            }
        }).then((value: AxiosResponse) => {
            const data = value.data
            if (data.status === "ok") resolve(data as RealtimeWeather)
            else reject((data as CaiyunError).error)
        }).catch(reject)
    })
}
