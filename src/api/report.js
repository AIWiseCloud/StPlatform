import request from '@/utils/request'

// function SaveReportItem(data){
//     return request({
//         url:`/api/Report/SaveReportItem`,
//         method:'POST',
//         data
//     })
// }

// function DeleteReportItem(reportId){
//     return request({
//         url:`/api/Report/DeleteReportItem?reportId=${reportId}`,
//         method:'Delete'
//     })
// }

// function GetReportItem(reportId){
//     return request({
//         url:`/api/Report/GetReportItem?reportId=${reportId}`,
//         method:'GET'
//     })
// }

// function QueryReportItems(data){
//     return request({
//         url:`/api/Report/QueryReportItems`,
//         method:'POST',
//         data
//     })
// }

function StringSaveAsJsonFile(data){
    return request({
        url:`/api/Report/StringSaveAsJsonFile`,
        method:'POST',
        data
    })
}

export default{
    // SaveReportItem,
    // DeleteReportItem,
    // GetReportItem,
    // QueryReportItems,
    StringSaveAsJsonFile,
}