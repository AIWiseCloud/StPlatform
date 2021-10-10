import request from '../utils/request'

// 获取开票记录（发票id或订单号作为参数)
function GetInvoice(id) {
  return request({
    url: `/api/Invoice/GetInvoice?id=${id}`,
    method: 'GET'
  })
}

// 财务确认完成开票
function MakeInvoice(id, drawer, invoiceUrl) {
  return request({
    url: `/api/Invoice/MakeInvoice?id=${id}&drawer=${drawer}&invoiceurl=${invoiceUrl}`,
    method: 'PUT'
  })
}

export default {
  GetInvoice,
  MakeInvoice
}
