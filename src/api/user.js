import request from '@/utils/request'

// 登录接口的封装
export function login(data) {
  return request({
    url: '/sys/login',
    method: 'post',
    data
  })
}

// 获取用户资料接口
export function getUserInfo() {
  return request({
    url: '/sys/profile',
    method: 'post'
  })
}

// 通过用户ID获取用户的头像
export function getUserDetailById(id) {
  return request({
    url: `/sys/user/${id}`
  })
}

export function logout() {

}
