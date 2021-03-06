import { getToken, setToken, removeToken, setTimeStamp } from '@/utils/auth'
import { login, getUserInfo, getUserDetailById } from '@/api/user'
import { resetRouter } from '@/router'
// 状态
const state = {
  token: getToken(),
  userInfo: {}
}
const mutations = {
  setToken(state, token) {
    state.token = token
    setToken(token)
  },
  removeToken(state) {
    state.token = null
    removeToken()
  },
  setUserInfo(state, result) {
    // 更新一个对象
    state.userInfo = result// 这是响应式
    // state.userInfo = { ...result } // 这样也是响应式 属于浅拷贝
  },
  removeUserInfo(state) {
    state.userInfo = {}
  }
}
const actions = {
  async login(context, data) {
    // 调用api的接口
    const result = await login(data) // 拿到token

    // 如果为true则表示登录成功
    context.commit('setToken', result) // 设置token
    setTimeStamp() // 设置当前的时间戳
  },

  async getUserInfo(context) {
    const result = await getUserInfo()
    // 获取用户的详情数据
    const baseInfo = await getUserDetailById(result.userId)

    context.commit('setUserInfo', { ...result, ...baseInfo }) // 提交到mutations
    return result
  },

  // 登出操作
  logout(context) {
    context.commit('removeToken')
    context.commit('removeUserInfo')
    resetRouter()
    context.commit('permission/setRoutes', [], { root: true })
  }

}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
