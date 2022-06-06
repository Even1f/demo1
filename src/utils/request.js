import axios from 'axios'
import store from '@/store'
import router from '@/router'
const Timeout = 3600
import { Message } from 'element-ui'
import { getTimeStamp } from '@/utils/auth'

const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API,
  timeout: 7000
})
// 请求拦截器
service.interceptors.request.use(config => {
  // config是请求的配置信息
  // 注入token
  if (store.getters.token) {
    if (IsTimeOut()) {
      store.dispatch('user/logout') // 登出操作
      // 跳转到登录页面
      router.push('/login')
      return Promise.reject(new Error('token超时了'))
    }
    // 只有在有token的条件下才有必要去检查时间戳是否超时
    config.headers['Authorization'] = `Bearer ${store.getters.token}`
  }
  return config
}, error => {
  return Promise.reject(error)
})
// 响应拦截器
service.interceptors.response.use(response => {
  const { data, message, success } = response.data
  // 要根据success成功与否决定下面的操作
  if (success) {
    return data
  } else {
    // 业务已经失败 不能进入then了 需要进入catch
    Message.error(message) // 提示错误信息
    return Promise.reject(new Error(message))
  }
}, error => {
  // error里面会有 response的对象
  if (error.response && error.response.data && error.response.data.code === 10002) {
    // 当等于10002的时候 表示后端告诉我token超时了
    store.dispatch('user/logout')
    router.push('/login')
  } else {
    Message.error(error.message) // 提示错误信息
    // 返回执行错误，让当前的执行跳出成功，进入catch
  }
  return Promise.reject(error)
})

// 是否超时  （当前时间 - 缓存中的时间） 是否大于时间差
function IsTimeOut() {
  var currentTime = Date.now()
  var timeStamp = getTimeStamp()
  // var test = (currentTime - timeStamp) / 1000
  // console.log(test)
  return (currentTime - timeStamp) / 1000 > Timeout
}
export default service

