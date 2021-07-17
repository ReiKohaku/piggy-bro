import fs from "fs";
import path from "path";
import {__data_dir} from "../../bot";
import Axios, {AxiosResponse} from "axios";
const axios = Axios.create()

/**
 * 获取指定API的密钥，如果密钥不存在会抛出“ERR_CANNOT_GET_KEY”异常
 * @param {string} name 要获取密钥的API的名称
 * @returns {string} 目标API密钥
 */
export function getAPIKey(name: string): string {
    try {
        const data = fs.readFileSync(path.join(__data_dir, "./api/caiyunapi.json"), "utf-8")
        const dataParsed = JSON.parse(data)
        if (!typeof dataParsed.key) throw new Error("Property \"key\" not defined")
        if (!typeof dataParsed.key[name]) throw new Error("Property \"key." + name + "\" not defined")
        if (typeof dataParsed.key[name] !== "string")
            throw new Error("Property \"key." + name + "\" is not string")
        return dataParsed.key[name]
    } catch (e) {
        console.error("获取 CaiyunAPI[" + name + "] 的密钥时出错")
        console.error(e)
        throw new Error("ERR_CANNOT_GET_KEY")
    }
}

interface PlaceResponse {
    status: string
    query: string
    places: {
        id: string
        name: string
        formatted_address: string
        location: {
            lat: number
            lng: number
        }
        place_id: string
    }[]
}

export function place(query: string): Promise<{
    name: string,
    address: string,
    location: {
        lat: number,
        lng: number
    }
}> {
    return new Promise((resolve, reject) => {
        axios({
            url: "https://api.caiyunapp.com/v2/place",
            params: {
                token: "96Ly7wgKGq6FhllM",
                count: 1,
                lang: "zh_CN",
                query,
                random: Math.random(),
                _: new Date().getTime()
            }
        }).then((value: AxiosResponse) => {
            const data = value.data as PlaceResponse
            if (data.status === "ok" && data.places && data.places[0])
                resolve({
                    name: data.places[0].name,
                    address: data.places[0].formatted_address,
                    location: data.places[0].location
                })
            else reject(value.data.message || "ERR_UNKNOWN")
        }).catch(reject)
    })
}
