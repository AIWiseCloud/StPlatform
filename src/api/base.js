import request from '../utils/request'

function UploadFiles(data) {
  return request({
    url: '/api/Upload/UploadFiles',
    method: 'post',
    data
  })
}

function GetAdminAreas(level,areaId){
  return request({
    url:`/api/Address/GetAdminAreas?level=${level}&areaId=${areaId}`,
    method:'GET'
  })
}

export default {
  UploadFiles,
  GetAdminAreas
}
