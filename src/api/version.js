import request from '@/utils/request'

function SaveVersion(data){
    return request({
        url:`/api/Version/SaveVersionManagement`,
        method:'POST',
        data
    })
}

function DeleteVersonManagement(versionId){
    return request({
        url:`/api/Version/DeleteVersonManagement?versionId=${versionId}`,
        method:'DELETE'
    })
}

function QueryVersionManagement(data){
    return request({
        url:`/api/Version/QueryVersionManagement`,
        method:'POST',
        data
    })
}

function GetNewestVersionManagement(){
    return request({
        url:`/api/Version/GetNewestVersionManagement`,
        method:'GET'
    })
}

//上传app打包文件
function UploadAppPackage(data) {
    return request({
      url: '/api/version/UploadAppPackage',
      method: 'post',
      data
    })
  }

export default{
    SaveVersion,
    DeleteVersonManagement,
    QueryVersionManagement,
    GetNewestVersionManagement,
    UploadAppPackage
}