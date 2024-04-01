import axios from 'axios'
import { useUserStore } from '@/stores/index.js'
import { message } from 'ant-design-vue'

const instance = axios.create({
  baseURL: 'http://localhost:8002/',
  timeout: 10000
})

// 添加请求拦截器
instance.interceptors.request.use(
  function (config) {
    // 在发送请求之前携带token
    const userStore = useUserStore()
    if (userStore.tokenInfo.tokenName) {
      const tokenInfo = userStore.tokenInfo
      config.headers[tokenInfo.tokenName] = tokenInfo.tokenValue
    }
    return config
  },
  function (error) {
    // 对请求错误做些什么
    return Promise.reject(error)
  }
)

// 添加响应拦截器
instance.interceptors.response.use(
  function (response) {
    // 2xx 范围内的状态码都会触发该函数。
    // 对响应数据做点什么
    if (response.data.code === '200') {
      return response.data
    }
    message.error(response.data.msg || '操作失败，请稍后再试')
  },
  function (error) {
    // 超出 2xx 范围的状态码都会触发该函数。
    // 对响应错误做点什么
    return Promise.reject(error)
  }
)

export default instance
