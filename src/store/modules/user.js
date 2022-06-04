import { getToken, setToken, removeToken } from '@/utils/auth'
import { login } from '@/api/user'
// 状态
const state = {
  token: getToken()
}
const mutations = {
  setToken(state, token) {
    state.token = token
    setToken(token)
  },
  removeToken(state) {
    state.token = null
    removeToken()
  }
}
const actions = {
  async login(context, data) {
    // 调用api的接口
    const result = await login(data) // 拿到token

    // 如果为true则表示登录成功
    context.commit('setToken', result) // 设置token
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
