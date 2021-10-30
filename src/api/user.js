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

//从销客获取业务员列表
function GetEmps(){
  return request({
    url:`/api/Xiaoke/GetEmps`,
    method:'GET'
  })
}

//批量汇入业务员到App后台
function ImportSalesmen(data){
  return request({
    url:`/api/Xiaoke/ImportSalesmen`,
    method:'POST',
    data
  })
}

//从app数据库获取营销人员列表
function GetSalesmen(keywords, ignoreStop){
  return request({
    url:`/api/Xiaoke/GetSalesmen?keywords=${keywords}&ignoreStop=${ignoreStop}`,
    method:'GET'
  })
}

function GetSalesman(unionId){
  return request({
    url:`/api/User/GetSalesman?unionId=${unionId}`,
    method:'GET'
  })
}

export default {
  QueryUsers,
  QueryCertification,
  AuditCertificationInfo,
  SetUserRoles,
  GetEmps,
  ImportSalesmen,
  GetSalesmen, //业务员列表
  GetSalesman  //业务员信息（userInfo)
}
