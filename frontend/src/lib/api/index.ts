import axios, {AxiosInstance} from 'axios';
const axiosInstance: AxiosInstance = axios.create();
export { axiosInstance };

export interface apiResponseBase {
  status: boolean
}

export interface apiSuccessResponse<T> extends apiResponseBase {
  status: true
  data: T
}

export interface apiErrorResponse extends apiResponseBase {
  status: false
  error: string
}

export type apiResponse<T> = apiSuccessResponse<T> | apiErrorResponse
