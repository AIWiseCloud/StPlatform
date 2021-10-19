import request from '@/utils/request'

// 获取订单详情
function GetOrderInfo(orderId) {
  return request({
    url: `/api/Order/GetOrderInfo?orderId=${orderId}`,
    method: 'GET'
  })
}

// 订单发货
function DeliveryOrder(data) {
  return request({
    url: `/api/Order/DeliveryOrder`,
    method: 'PUT',
    data
  })
}

// 订单查询
function QueryOrders(data) {
  return request({
    url: `/api/Order/QueryOrders`,
    method: 'POST',
    data
  })
}

// 修改订单地址信息
function UpdateOrderAddress(data) {
  return request({
    url: `​/api​/Order​/UpdateOrderAddress`,
    method: 'PUT',
    data
  })
}

// 由订单号获取销售出库单号
function GetBillId(orderId) {
  return request({
    url: `/api/Order/GetBillId?orderId=${orderId}`,
    method: 'GET'
  })
}

// 确认线下到款
function ConfirmPay(orderId, isconfirm) {
  return request({
    url: `/api/Order/ConfirmPay?orderId=${orderId}&isconfirm=${isconfirm}`,
    method: 'PUT'
  })
}

//客服确认定金到账
function ConfirmReceipt(id,userName,isConfirm,paytime){
  return request({
    url:`/api/AdvanceMoney/ConfirmReceipt?id=${id}&userName=${userName}&isconfirm=${isConfirm}&paytime=${paytime}`,
    method:'PUT'
  })
}

//分页查询定金
function QueryAdvanceMoney(data){
  return request({
    url:`/api/AdvanceMoney/QueryAdvanceMoney`,
    method:'POST',
    data
  })
}

export default {
  GetOrderInfo,
  DeliveryOrder,
  QueryOrders,
  UpdateOrderAddress,
  UpdateOrderAddress,
  GetBillId,
  ConfirmPay,
  ConfirmReceipt,
  QueryAdvanceMoney
}
