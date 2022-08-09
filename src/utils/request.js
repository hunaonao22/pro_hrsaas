import axios from 'axios'
import { Message } from 'element-ui'
import store from '@/store'
import { gettimeKey } from '@/utils/auth'
import router from '@/router'
const request = axios.create({
  baseURL: process.env.VUE_APP_BASE_API
})
const TimeOut = 600000000
function isTimeOut() {
  return Date.now() - gettimeKey() < TimeOut
}
// 请求拦截器
request.interceptors.request.use(config => {
  const token = store.getters.token
  if (token) {
    if (isTimeOut()) {
      config.headers.Authorization = `bearer ${token}`
    } else {
      store.dispatch('user/logOut')
      router.push('/login')
      Message.error('token超时了,请重新登录')
      return Promise.reject(new Error('token超时了'))
    }
  }
  return config
}, error => Promise.reject(error))
// 响应拦截器
request.interceptors.response.use(response => {
  const { data: { data, message, success }} = response
  if (success) {
    return data
  }
  Message.error(message || '系统错误')
  // 抛出一个Promise错误是为了让在请求的地方报错
  return Promise.reject(message || '系统错误')
}, error => {
  if (error.response.status === 401) {
    store.dispatch('user/logOut')
    router.push('/login')
  }
  Message.error(error.response?.data?.message || '系统错误')
  return Promise.reject(error)
})

export default request
