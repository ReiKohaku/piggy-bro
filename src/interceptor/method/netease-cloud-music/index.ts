import NeteaseCloudMusic, {SearchType} from "NeteaseCloudMusicApi"
import {UrlLink} from "wechaty";
import {template} from "../../../bot";
import Interceptor from "../../Interceptor";

// 这个方法用于解析搜索参数
function getSearchArgs(text: string): null | { type: SearchType, keywords: string } {
    if (!text || text.length === 0) return null
    let match: RegExpMatchArray

    const singerRegExp = new RegExp("我想听(.*)的歌")
    match = singerRegExp.exec(text)
    if (match && match.length > 0) return {
        type: SearchType.artist,
        keywords: match[1]
    }

    const singerAndSingleRegExp = new RegExp("我想听(.*)唱?的(.*)")
    match = singerAndSingleRegExp.exec(text)
    if (match && match.length > 0) return {
        type: SearchType.single,
        keywords: `${match[1]} ${match[2]}`
    }

    const singleRegExp = new RegExp("我想听(.*)")
    match = singleRegExp.exec(text)
    if (match && match.length > 0) return {
        type: SearchType.single,
        keywords: match[1]
    }

    return null
}

template.add("netease-cloud-music.search.failed", "很抱歉，搜索 {search} 时失败了，请你等会再试试吧。")
template.add("netease-cloud-music.search.success", "二师兄给你找到了一首歌~<br/>{title} - {artists}<br/>{url}")

namespace NeteaseCloudMusicTypes {
    export interface Artist {
        id: number
        name: string
        picUrl: string | null
        alias: string[]
        albumSize: number
        picId: number
        img1v1Url: string
        img1v1: number
        trans: null
    }

    export interface Album {
        id: number
        name: string
        artist: Artist
        publishTime: number
        size: number
        copyrightId: number
        status: number
        picId: number
        mark: number
    }

    export interface SearchResponse extends NeteaseCloudMusic.Response {
        status: number
        body: {
            code: number
            result: {
                songs: {
                    id: number
                    name: string
                    artists: Artist[]
                    album: Album
                    duration: number
                    copyrightId: number
                    status: number
                    alias: string[]
                    rtype: number
                    ftype: number
                    mvid: number
                    fee: number
                    rUrl: string | null
                    mark: number
                }[],
                hasMore: boolean
                songCount: number
            },
            cookie: string | undefined
        },
        cookie: string[]
    }

    export interface SongDetailResponse {
        status: number
        body: {
            songs: {
                name: string
                id: number
                pst: number
                t: number
                ar: {
                    id: number
                    name: string
                    tns: unknown[]
                    alias: string[]
                }[]
                alia: string[]
                pop: number
                st: number
                rt: null
                fee: number
                v: number
                crbt: null
                cf: string
                al: {
                    id: number
                    name: string
                    picUrl: string
                    tns: unknown[]
                    pic_str: string
                    pic: number
                }
                dt: number
                h: {
                    br: number
                    fid: number
                    size: number
                    vd: number
                }
                m: {
                    br: number
                    fid: number
                    size: number
                    vd: number
                }
                l: {
                    br: number
                    fid: number
                    size: number
                    vd: number
                }
                a: null
                cd: string
                no: number
                rtUrl: string | null
                ftype: number
                rtUrls: string[]
                djId: number
                copyright: number
                s_id: number
                mark: number
                originCoverType: number
                originSongSimpleData: null
                resourceState: boolean
                version: number
                single: number
                noCopyrightRcmd: null
                mv: number
                rtype: number
                rurl: string | null
                mst: number
                cp: number
                publishTime: number
            }[]
            privileges: {
                id: number
                fee: number
                payed: number
                st: number
                pl: number
                dl: number
                sp: number
                cp: number
                subp: number
                cs: boolean
                maxbr: number
                fl: number
                toast: boolean
                flag: number
                preSell: boolean
                playMaxbr: number
                downloadMaxbr: number
                rscl: {}
                freeTrialPrivilege: {
                    resConsumable: boolean
                    userConsumable: boolean
                }
                chargeInfoList: {
                    rate: number
                    chargeUrl: null
                    chargeMessage: unknown | null
                    chargeType: number
                }[]
            }[]
            code: number
            cookie: string | undefined
        }
        cookie: string[]
    }
}

const neteaseMusicInterceptor = new Interceptor()
    .check(message => {
        const searchArgs = getSearchArgs(message.text())
        if (/^二师兄/.test(message.text()) && searchArgs) {
            return {searchArgs}
        }
    })
    .handler(async (message, checkerArgs: { searchArgs: {type: SearchType, keywords: string} }) => {
        const {searchArgs} = checkerArgs
        // 调用搜索API
        const searchResult: NeteaseCloudMusicTypes.SearchResponse = (await NeteaseCloudMusic.search({
            ...searchArgs
        })) as NeteaseCloudMusicTypes.SearchResponse
        if (searchResult.status === 200 && searchResult.body.result.songs.length > 0) {
            const resultSong = searchResult.body.result.songs[0]
            // 调用歌曲详情API
            const resultSongDetailResponse: NeteaseCloudMusicTypes.SongDetailResponse = (await NeteaseCloudMusic.song_detail({
                ids: `${resultSong.id}`
            })) as NeteaseCloudMusicTypes.SongDetailResponse
            if (resultSongDetailResponse.status === 200 && resultSongDetailResponse.body.songs.length > 0) {
                const resultSongDetail = resultSongDetailResponse.body.songs[0]
                // 获取展示需要的信息
                const thumbnail = resultSongDetail.al.picUrl
                const url = `https://music.163.com/#/song?id=${resultSongDetail.id}`
                const title = resultSongDetail.name
                const artists = resultSongDetail.ar.map(a => a.name).join("/")
                // 创建链接卡片
                const urlLink = new UrlLink({
                    title,
                    description: artists,
                    url,
                    thumbnailUrl: thumbnail
                })
                console.log(urlLink)
                try {
                    await message.say(urlLink)
                } catch (e) {
                    // 发送失败时，回落到文本消息
                    // 注：不明白为什么wechaty-puppet-wechat不能发UrlLink……看说明应该可以发才对，但输出是不支持……
                    // 2021-08-31：后来看了看文档，web协议不支持，那没事了
                    console.warn("Send UrlLink failed, fallback to text message.")
                    console.warn(e)
                    await message.say(template.use("netease-cloud-music.search.success", {title, artists, url}))
                }
                return ""
            }
        }
        return template.use("netease-cloud-music.search.failed", {
            search: searchArgs.keywords
        })
    })
export default neteaseMusicInterceptor
