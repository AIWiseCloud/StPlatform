import request from '@/utils/request'

function SaveCompanyNews(data){
    return request({
        url:`/api/CompanyNews/SaveCompanyNews`,
        method:'POST',
        data
    })
}

function GetCompanyNews(newsId){
    return request({
        url:`/api/CompanyNews/GetCompanyNews?newsId=${newsId}`,
        method:'GET'
    })
}

function DeleteCompanyNews(newsId){
    return request({
        url:`/api/CompanyNews/DeleteCompanyNews?newsid=${newsId}`,
        method:'DELETE'
    })
}

function SubmitAudit(newsId, isSubmit){
    return request({
        url:`/api/CompanyNews/SubmitAudit?newsId=${newsId}&isSubmit=${isSubmit}`,
        method:'PUT'
    })
}

function AuditNews(newsId,isAudit){
    return request({
        url:`/api/CompanyNews/AuditNews?newsId=${newsId}&isAudit=${isAudit}`,
        method:'PUT'
    })
}

function QueryCompanyNews(data){
    return request({
        url:`/api/CompanyNews/QueryCompanyNews`,
        method:'POSt',
        data
    })
}

export default{
    SaveCompanyNews,
    GetCompanyNews,
    DeleteCompanyNews,
    SubmitAudit,
    AuditNews,
    QueryCompanyNews
}