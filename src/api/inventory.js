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

//获取指定商品在某仓库的实际库存
function GetInventoryDetail(goodsId,colorId,specId,stockNumber){
    return request({
        url:`/api/Inventory/GetInventoryDetail?goodsId=${goodsId}&colorId=${colorId}&specId=${specId}&stockNumber=${stockNumber}`,
        method:'GET'
    })
}

//获取待发货订单列表
function GetToBeShipped(orderId){
    return request({
        url:`/api/Inventory/GetToBeShipped?orderId=${orderId}`,
        method:'GET'
    })
}

export default{
    SaveStockBill,
    GetStockBill,
    SearchStockBill,
    DeleteStockBillRow,
    DeleteStockBill,
    AuditStockBill,
    SearchInventories,
    GetInventoryDetail,
    GetToBeShipped
}