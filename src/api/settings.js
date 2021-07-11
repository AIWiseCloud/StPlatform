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

export default {
  getSettings,
  saveSettings
}
