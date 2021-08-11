import request from '../utils/request'

//弃用
function getSettings() {
  return request({
    url: `api/Sys/GetSettings`,
    method: 'get'

  })
}

//弃用
function saveSettings(data) {
  return request({
    url: `api/Sys/SaveSettings`,
    method: 'post',
    data
  })
}

//保存资源配置
function SaveResourceSettings(data) {
  return request({
    url: `/api/Sys/SaveResourceSettings`,
    method: 'POST',
    data
  })
}

//获取指定资源
function GetResourceSettings(sourceId) {
  return request({
    url: `/api/Sys/GetResourceSettings?sourceId=${sourceId}`,
    method: 'GET'
  })
}

//按分组获取资源配置
function GetResourceSettingsByGroup(groupNo) {
  return request({
    url: `/api/Sys/GetResourceSettingsByGroup?groupNo=${groupNo}`,
    method: 'GET'
  })
}

//获取资源分组码
function GetGroups() {
  return request({
    url: `/api/Sys/GetGroups`,
    method: 'GET'
  })
}

//删除指定资源
function DeleteResourceSettings(sourceId) {
  return request({
    url: `/api/Sys/DeleteResourceSettings?sourceId=${sourceId}`,
    method: 'DELETE'
  })
}

//资源查询
function QueryResourceSettings(data) {
  return request({
    url: `/api/Sys/QueryResourceSettings`,
    method: 'POST',
    data
  })
}

function SaveSubMesType(data) {
  return request({
    url: `/api/Sys/SaveSubMesType`,
    method: 'post',
    data
  })
}

function GetSubMesType(id) {
  return request({
    url: `/api/Sys/GetSubMesTypes?id=${id}`,
    method: 'get'
  })
}

function GetSubMesTypes() {
  return request({
    url: `/api/Sys/GetSubMesTypes`,
    method: 'get'
  })
}

function DeleteSubMesType(id) {
  return request({
    url: `/api/Sys/DeleteSubMesType?id=${id}`,
    method: 'delete'
  })
}

function SaveSubMessage(data) {
  return request({
    url: '/api/Sys/SaveSubMessage',
    method: 'post',
    data
  })
}

function GetSubMessage(id) {
  return request({
    url: `/api/Sys/GetSubMessage?id=${id}`,
    method: 'get'
  })
}

function GetSubMessageList(parentId) {
  return request({
    url: `/api/Sys/GetSubMessageList?parentid=${parentId}`,
    method: 'get'
  })
}

function DeleteSubMessage(id) {
  return request({
    url: `/api/Sys/DeleteSubMessage?id=${id}`,
    method: 'delete'
  })
}

function SaveShop(data) {
  return request({
    url: `/api/shop/SaveShop`,
    method: 'post',
    data
  })
}

function GetShop(shopId) {
  return request({
    url: `/api/shop/GetShop?shopId=${shopId}`,
    method: 'GET'
  })
}

function GetShops() {
  return request({
    url: `/api/shop/GetShops`,
    method: 'GET'
  })
}

function DeleteShop(shopId) {
  return request({
    url: `/api/shop/DeleteShop?shopId=${shopId}`,
    method: 'DELETE'
  })
}

export default {
  getSettings,
  saveSettings,
  SaveSubMesType,
  GetSubMesType,
  GetSubMesTypes,
  DeleteSubMesType,
  SaveSubMessage,
  GetSubMessage,
  GetSubMessageList,
  DeleteSubMessage,
  SaveShop,
  GetShop,
  GetShops,
  DeleteShop,
  SaveResourceSettings,
  GetResourceSettings,
  GetResourceSettingsByGroup,
  GetGroups,
  DeleteResourceSettings,
  QueryResourceSettings
}
