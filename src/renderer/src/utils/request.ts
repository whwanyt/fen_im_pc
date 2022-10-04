import configUtil from '../config/config'
import axios, { AxiosInstance, AxiosRequestConfig, AxiosRequestHeaders, AxiosResponse } from 'axios'
import { HttpCode } from './httpCode'
import { useUserStore } from '@renderer/store/user'
import { useRouter } from 'vue-router'
export interface HttpParams {
  baseUrl: string
  timeout?: number
}
export interface responseParams {
  code: number
  message?: string
  error?: string
  data?: any
}

class Http {
  private client: AxiosInstance

  constructor(params: HttpParams) {
    this.client = axios.create({
      baseURL: params.baseUrl,
      timeout: params.timeout || 3000,
      headers: {}
    })
    this.client.interceptors.request.use(this.interceptorsRequest)
    this.client.interceptors.response.use(this.interceptorsResponse)
  }

  private static instance: Http

  public static getInstance() {
    if (!this.instance) {
      this.instance = new Http({ baseUrl: configUtil.apiConfig.baseUrl })
    }
    return this.instance
  }

  private interceptorsRequest(config: AxiosRequestConfig) {
    let authorization = {}
    if (!configUtil.WhiteUrlList.includes(config.url!)) {
      const user = useUserStore()
      authorization = { authorization: user.getToken }
    }
    config.headers = Object.assign(config.headers||{}, authorization)
    return config
  }

  private interceptorsResponse(response: AxiosResponse) {
    return response
  }

  get<T>(url: string, params: T) {
    return this.request({ url, params, method: 'GET' })
  }

  post<T>(url: string, params: T, headers?: AxiosRequestHeaders) {
    return this.request({ url, data: params, method: 'POST', headers })
  }

  async request(config: AxiosRequestConfig): Promise<responseParams> {
    try {
      const result: AxiosResponse<responseParams> = await this.client(config)
      if (result.data.code === HttpCode.auth) {
        const user = useUserStore()
        user.addToken('')
        const router = useRouter()
        router.resolve('/login')
        return result.data
      } else {
        return result.data
      }
    } catch (err) {
      return { code: 0, data: err }
    }
  }
}

const HttpUtil = Http.getInstance()
export default HttpUtil
