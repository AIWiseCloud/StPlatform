import request from'@/utils/request'

function SaveStockBill(data){
    return request({
        url:`/api/Inventory/SaveStockBill`,
        method:'POST',
        data
    })
}

function GetStockBill(billId){
    return request({
        url:`/api/Inventory/GetStockBill?billId=${billId}`,
        method:'GET'
    })
}

function SearchStockBill(data){
    return request({
        url:`/api/Inventory/SearchStockBill`,
        method:'POST',
        data
    })
}

function DeleteStockBillRow(id){
    return request({
        url:`/api/Inventory/DeleteStockBillRow?id=${id}`,
        method:'DELETE'
    })
}

function DeleteStockBill(billId){
    return request({
        url:`/api/Inventory/DeleteStockBill?billId=${billId}`,
        method:'DELETE'
    })
}

function AuditStockBill(billId, isAudit){
    return request({
        url:`/api/Inventory/AuditStockBill?billId=${billId}&isAudit=${isAudit}`,
        method:'PUT'
    })
}

function SearchInventories(data){
    return request({
        url:`/api/Inventory/SearchInventories`,
        method:'POSt',
        data
    })
}

export default{
    SaveStockBill,
    GetStockBill,
    SearchStockBill,
    DeleteStockBillRow,
    DeleteStockBill,
    AuditStockBill,
    SearchInventories
}