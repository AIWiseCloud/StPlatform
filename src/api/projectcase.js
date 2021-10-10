import request from '../utils/request'

function SaveProjectCase(data){
    return request({
        url:`/api/ProjectCase/SaveProjectCase`,
        method:'POST',
        data
    })
}

function GetProjectCase(id){
    return request({
        url:`/api/ProjectCase/GetProjectCase?id=${id}`,
        method:'GET'
    })
}

function DeleteProjectCase(id){
    return request({
        url:`/api/ProjectCase/DeleteProjectCase?id=${id}`,
        method:'DELETE'
    })
}

function QueryProjectCases(data){
    return request({
        url:`/api/ProjectCase/QueryProjectCases`,
        method:'POSt',
        data
    })
}

export default{
    SaveProjectCase,
    GetProjectCase,
    DeleteProjectCase,
    QueryProjectCases
}