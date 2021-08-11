import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/api/Authentication/requestToken',
    method: 'post',
    data
  })
}

export function getInfo(token) {
  return request({
    url: `/api/user/GetUserInfoByToken?token=${token}`,
    method: 'get'
  })
}

export function logout() {
  return request({
    url: '/vue-element-admin/user/logout',
    method: 'post'
  })
}
