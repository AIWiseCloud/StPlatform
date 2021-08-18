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

export function logout(token) {
  return request({
    url: `/api/user/logout?token=${token}`,
    method: 'PUT'
  })
}
