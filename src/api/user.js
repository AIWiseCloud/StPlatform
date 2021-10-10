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

function QueryUsers(data) {
  return request({
    url: `/api/User/QueryUsers`,
    method: 'POST',
    data
  })
}

function QueryCertification(data) {
  return request({
    url: `/api/User/QueryCertification`,
    method: 'POST',
    data
  })
}

function AuditCertificationInfo(unionId, certificationType, authState, reason) {
  return request({
    url: `/api/User/AuditCertificationInfo?unionId=${unionId}&certifycationType=${certificationType}&authState=${authState}&reason=${reason}`,
    method: 'PUT'
  })
}

function SetUserRoles(unionId, roles) {
  return request({
    url: `/api/User/SetUserRoles?unionId=${unionId}&roles=${roles}`,
    method: 'PUT'
  })
}


export default {
  QueryUsers,
  QueryCertification,
  AuditCertificationInfo,
  SetUserRoles,
}
