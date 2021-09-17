import {apiSuccessResponse, axiosInstance} from 'src/lib/api/index';

export interface BotStatus {
  isLogin: boolean
  name: string | null
  avatar: string | null
  startAt: string
  mem: {
    rss: number
    heapTotal: number
    heapUsed: number
    external: number
    arrayBuffers: number
  }
  attributes: Record<string, Record<string, { desc?: string, data: string | number | boolean | unknown[] | Record<string, unknown> }>>
}

export default class StatusAPI {
  public static async status(id: string): Promise<BotStatus> {
    const response = await axiosInstance.post<apiSuccessResponse<BotStatus>>('/api/status', { id });
    return response.data.data;
  }
}
