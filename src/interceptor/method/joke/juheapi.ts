import Axios, {AxiosResponse} from "axios";
import {getAPIKey} from "../../../lib/APIs/JuheAPI";

const axios = Axios.create()
export default function randomJoke(): Promise<string> {
    return new Promise<string>((resolve, reject) => {
        const apiKey = getAPIKey("joke")
        axios({
            method: "GET",
            url: "http://v.juhe.cn/joke/randJoke.php",
            params: {
                key: apiKey
            }
        }).then((value: AxiosResponse) => {
            if (value.data.error_code) reject(value.data.reason)
            else {
                interface JuheJokeResult {
                    content: string
                    hashId: string
                    unixtime: number
                }
                const result: JuheJokeResult[] = value.data.result as JuheJokeResult[]
                resolve(result[0].content)
            }
        })
    })
}
