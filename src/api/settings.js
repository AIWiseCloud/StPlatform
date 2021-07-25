import request from '../utils/request'

function getSettings() {
  return request({
    url: `api/Sys/GetSettings`,
    method: 'get'

  })
}

function saveSettings(data) {
  return request({
    url: `api/Sys/SaveSettings`,
    method: 'post',
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
    url: `/api/Sys/SaveShop`,
    method: 'post',
    data
  })
}

function GetShop(shopId) {
  return request({
    url: `/api/Sys/GetShop?shopId=${shopId}`,
    method: 'GET'
  })
}

function GetShops() {
  return request({
    url: `/api/Sys/GetShops`,
    method: 'GET'
  })
}

function DeleteShop(shopId) {
  return request({
    url: `/api/Sys/DeleteShop?shopId=${shopId}`,
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
  DeleteShop
}
