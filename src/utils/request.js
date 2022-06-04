import axios from 'axios'
import { Message } from 'element-ui'
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API,
  timeout: 5000
})
service.interceptors.request.use()
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
  Message.error(error.message) // 提示错误信息
  return Promise.reject(error) // 返回执行错误，让当前的执行跳出成功，进入catch
})
export default service

