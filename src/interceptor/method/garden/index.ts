import Interceptor from "../../Interceptor";
import {getMethodConfig} from "../../../lib/Util";

interface GardenConfig {
    baseUrl: string
}

const gardenInterceptor = new Interceptor("garden")
    .title("后花园")
    .check(message => {
        const room = message.room();
        if (!room) return;
        if (!/^二师兄的?后花园(在[哪那]儿?])?/.test(message.text())) return;
        return {
            id: room.id
        }
    })
    .handler((message, checkerArgs) =>  {
        const { id } = checkerArgs;
        const { baseUrl } = {
            ...getMethodConfig<GardenConfig>("garden")
        }
        return new URL(`${baseUrl}${baseUrl.endsWith("/") ? "" : "/"}${id}/status`).toString()
    })
export default gardenInterceptor
