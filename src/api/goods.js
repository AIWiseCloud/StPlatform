import request from '@/utils/request'

function SaveGoodsCategory(data) {
  // console.log('提交：', JSON.stringify(data))
  // data.isCancellation=data.isCancellation?1:0;
  return request({
    url: `/api/Goods/SaveGoodsCategory`,
    method: 'post',
    data
  })
}

function GetGoodsCategory(categoryId) {
  return request({
    url: `/api/Goods/GetGoodsCategory?categoryId=${categoryId}`,
    method: 'GET'
  })
}

// 获取商品分类列表:parentId (为空时获取1级分类，为*时所有分类, 其余情况为获取下级分类
function GetGoodsCategories(parentId, onlyValidCategory = false) {
  if (!parentId) {
    parentId = ''
  }
  return request({
    url: `/api/Goods/GetGoodsCategories?parentId=${parentId}&onlyValidCategory=${onlyValidCategory}`,
    method: 'GET'
  })
}

// 删除商品分类
function DeleteGoodsCategory(categoryId) {
  return request({
    url: `/api/Goods/DeleteGoodsCategory?categoryId=${categoryId}`,
    method: 'DELETE'
  })
}

// 保存商品
function SaveGoodsInfo(data) {
  return request({
    url: `/api/Goods/SaveGoodsInfo`,
    method: 'POST',
    data
  })
}

// 获取商品信息
function GetGoodsInfo(goodsId) {
  return request({
    url: `/api/Goods/GetGoodsInfo?goodsId=${goodsId}`,
    method: 'GET'
  })
}

// 查询商品（分页)
function QueryGoods(data) {
  return request({
    url: `/api/Goods/QueryGoods`,
    method: 'POST',
    data
  })
}

// 删除商品（连同颜色、规格等附表一并删除)
function DeleteGoodsInfo(goodsId) {
  return request({
    url: `/api/Goods/DeleteGoodsInfo?goodsId=${goodsId}`,
    method: 'DELETE'
  })
}

// 复制商品
function CopyGoodsInfo(goodsId, newGoodsId, userName) {
  return request({
    url: `/api/Goods/CopyGoodsInfo?goodsId=${goodsId}&newGoodsId=${newGoodsId}&userName=${userName}`,
    method: 'PUT'
  })
}

// 发布（上架）商品
function ReleaseGoods(isRelease, goodsId) {
  return request({
    url: `/api/Goods/ReleaseGoods?isRelease=${isRelease}&goodsId=${goodsId}`,
    method: 'PUT'
  })
}

// 保存商品颜色及图片
function SaveGoodsColor(data) {
  return request({
    url: `/api/Goods/SaveGoodsColor`,
    method: 'post',
    data
  })
}

// 获取商品颜色及图片记录
function GetGoodsColor(id) {
  return request({
    url: `/api/Goods/GetGoodsColor?id=${id}`,
    method: 'GET'
  })
}

// 获取商品所有颜色及图片记录
function GetGoodsColors(goodsId) {
  return request({
    url: `/api/Goods/GetGoodsColors?goodsId=${goodsId}`,
    method: 'GET'
  })
}

// 删除一条商品颜色及图片记录
function DeleteGoodsColor(id) {
  return request({
    url: `/api/Goods/DeleteGoodsColor?id=${id}`,
    method: 'DELETE'
  })
}

// 保存商品规格记录
function SaveGoodsSpec(data) {
  return request({
    url: `/api/Goods/SaveGoodsSpec`,
    method: 'POST',
    data
  })
}

// 获取商品规格与价格记录
function GetGoodsSpec(id) {
  return request({
    url: `/api/Goods/GetGoodsSpec?id=${id}`,
    method: 'GET'
  })
}

// 获取商品所有规格与定价记录
function GetGoodsSpecs(goodsId) {
  return request({
    url: `/api/Goods/GetGoodsSpecs?goodsId=${goodsId}`,
    method: 'GET'
  })
}

// 删除商品规格与定价记录
function DeleteGoodsSpec(id) {
  return request({
    url: `/api/Goods/DeleteGoodsSpec?id=${id}`,
    method: 'DELETE'
  })
}

// 保存spu图片记录
function SaveSpuImg(data) {
  return request({
    url: `/api/Goods/SaveSpuImg`,
    method: 'POST',
    data
  })
}

// 获取SPU图片记录
function GetSpuImg(id) {
  return request({
    url: `/api/Goods/GetSpuImg?id=${id}`,
    method: 'GET'
  })
}

// 获取商品所有Spu图片记录
function GetSpuImgs(goodsId) {
  return request({
    url: `/api/Goods/GetSpuImgs?goodsId=${goodsId}`,
    method: 'GET'
  })
}

// 删除SPu图片记录
function DeleteSpuImg(id) {
  return request({
    url: `/api/Goods/DeleteSpuImg?id=${id}`,
    method: 'GET'
  })
}

// 获取材料报价表
function GetGoodsQuotes() {
  return request({
    url: `/api/Goods/GetGoodsQuotes`,
    method: 'GET'
  })
}

// 更新报价说明
function UpdateQuoteExplain(data) {
  return request({
    url: `/api/Goods/UpdateQuoteExplain`,
    method: 'POST',
    data
  })
}

//获取所有商品列表（用于下载模板)
function GetAllGoodsInfo(){
  return request({ 
    url:`/api/Goods/GetAllGoodsInfo`,
    method:'GET'
  })
}

//批量更新价格
function BatchUpdatePrice(data){
  return request({
    url:`/api/Goods/BatchUpdatePrice`,
    method:'POSt',
    data
  })
}

export default {
  SaveGoodsCategory,
  GetGoodsCategory,
  GetGoodsCategories,
  DeleteGoodsCategory,
  SaveGoodsInfo,
  GetGoodsInfo,
  QueryGoods,
  DeleteGoodsInfo,
  CopyGoodsInfo,
  ReleaseGoods,
  SaveGoodsColor,
  GetGoodsColor,
  GetGoodsColors,
  DeleteGoodsColor,
  SaveGoodsSpec,
  GetGoodsSpec,
  GetGoodsSpecs,
  DeleteGoodsSpec,
  SaveSpuImg,
  GetSpuImg,
  GetSpuImgs,
  DeleteSpuImg,
  GetGoodsQuotes,
  UpdateQuoteExplain,
  GetAllGoodsInfo,
  BatchUpdatePrice
}
