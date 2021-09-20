import Interceptor from "../../Interceptor";

interface GardenConfig {
    baseUrl: string
}

const gardenInterceptor = new Interceptor("garden")
    .title("后花园")
    .usage("查看详细的使用帮助和运行状态")
    .check((context, message) => {
        const room = message.room();
        if (!room) return;
        if (!/^二师兄的?后花园(在[哪那]儿?])?/.test(message.text())) return;
        return {
            id: room.id
        }
    })
    .handler((context, message, checkerArgs) =>  {
        const { id } = checkerArgs;
        const { baseUrl } = {
            ...context.getMethodConfig<GardenConfig>("garden")
        }
        return new URL(`${baseUrl}${baseUrl.endsWith("/") ? "" : "/"}${id}/status`).toString()
    })
export default gardenInterceptor
