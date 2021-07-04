import {template} from "./bot";

template.add("on.start", "机器人应用已启动。")
template.add("on.scan.link", "请在浏览器内打开下方链接，使用机器人的手机微信扫描二维码：")
template.add("on.scan.terminal", "您也可以扫描下方的二维码：\n{qrcode}")
template.add("on.scan.confirm", "已扫码，请确认登录。")
template.add("on.login", "用户 {name} 已登录。")
template.add("on.logout", "用户 {name} 已登出。")
template.add("on.error", "发生了未经处理的错误。")
template.add("error.unknown", "二师兄这里出了点问题，没能帮到你真是抱歉。")
template.add("error.api.key.missing", "二师兄没有查询数据的令牌，现在没法给您看这个。")
template.add("error.api.call.limit", "今天二师兄查这个数据有点多了，明天再来吧^_^")
template.add("error.api.call.no_permission", "哎呀，对方不让二师兄查这个数据。")
