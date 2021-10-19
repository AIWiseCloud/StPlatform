import request from '../utils/request'

//获取商城数据
function GetMallData(){
    return request({
        url:`/api/DataCenter/GetMallData`,
        method:'GET'
    })
}

export  default{
    GetMallData
}