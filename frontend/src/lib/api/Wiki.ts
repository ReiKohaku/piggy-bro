import {apiSuccessResponse, axiosInstance} from 'src/lib/api/index';

export default class WikiAPI {
  public static async readme(): Promise<{ name: string, title: string, alias: string[] }[]>
  public static async readme(name: string): Promise<string>
  public static async readme(name?: string): Promise<string | { name: string, title: string, alias: string[] }[]> {
    if (name) {
      const response = await axiosInstance.post<apiSuccessResponse<string>>('/api/wiki', { name });
      return response.data.data;
    }
    const response = await axiosInstance.get<apiSuccessResponse<{ name: string, title: string, alias: string[] }[]>>('/api/wiki');
    return response.data.data;
  }
}
