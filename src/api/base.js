import request from '../utils/request'

function UploadFiles(data) {
  return request({
    url: '/api/Upload/UploadFiles',
    method: 'post',
    data
  })
}

export default {
  UploadFiles
}
