import request from '@/utils/request'

//获取订单详情
function GetOrderInfo(orderId){
    return request({
        url:`/api/Order/GetOrderInfo?orderId=${orderId}`,
        method:'GET'
    })
}

//订单发货
function DeliveryOrder(orderId){
    return request({
        url:`/api/Order/DeliveryOrder?orderId=${orderId}`,
        method:'PUT'
    })
}

//订单查询
function QueryOrders(data){
    return request({
        url:`/api/Order/QueryOrders`,
        method:'POST',
        data
    })
}


//修改订单地址信息
function UpdateOrderAddress(data){
    return request({
        url:`​/api​/Order​/UpdateOrderAddress`,
        method:'PUT',
        data
    })
}

export default{
    GetOrderInfo,
    DeliveryOrder,
    QueryOrders,
    UpdateOrderAddress,
    UpdateOrderAddress
}