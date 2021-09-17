<template>
  <div class="container">
    <el-card>
      <!-- 警告提示区域 -->
      <el-alert
        :title="(isAddBill ? '添加' : '编辑') + '库存单据'"
        type="info"
        center
        show-icon
        :closable="false"
      />
      <!-- 操作按钮 -->
      <el-button-group class="btngroup">
        <el-button
          class="btn"
          plain
          icon="el-icon-plus"
          size="mini"
          :disabled="!buttonStatus.new"
          @click="newBill"
        >新增</el-button>
        <el-button
          class="btn"
          plain
          icon="el-icon-edit"
          size="mini"
          :disabled="!buttonStatus.edit"
          @click="editBill"
        >修改</el-button>
        <el-button
          class="btn"
          plain
          icon="el-icon-folder-add"
          size="mini"
          :disabled="!buttonStatus.order"
          @click="openOrdersDialog"
        >从订单生成
        </el-button>
        <el-button
          class="btn"
          plain
          icon="el-icon-folder"
          size="mini"
          :disabled="!buttonStatus.save"
          @click="saveBill"
        >保存</el-button>
        <el-button
          class="btn"
          plain
          icon="el-icon-top-left"
          size="mini"
          :disabled="!buttonStatus.cancelEdit"
          @click="cancelEdit"
        >取消</el-button>
        <el-button
          class="btn"
          plain
          icon="el-icon-check"
          size="mini"
          :disabled="!buttonStatus.audit"
          @click="auditBill"
        >审核</el-button>
        <el-button
          class="btn"
          plain
          icon="el-icon-minus"
          size="mini"
          :disabled="!buttonStatus.cancel"
          @click="cancelAuditBill"
        >反审</el-button>
        <el-button
          class="btn"
          type="danger"
          plain
          icon="el-icon-delete"
          size="mini"
          :disabled="!buttonStatus.delete"
          @click="deleteBill"
        >删除</el-button>
        <el-button
          class="btn"
          type="default"
          plain
          icon="el-icon-back"
          size="mini"
          :disabled="isEditStatus"
          @click="$router.go(-1)"
        >返回</el-button>
      </el-button-group>
      <!-- 单据区 -->
      <!-- 单据头 -->
      <el-form
        ref="billform"
        :model="stockBillData"
        :rules="billrules"
        label-position="right"
        label-width="92px"
      >
        <el-row :gutter="10">
          <el-col :sm="12" :md="6" :lg="6" :xl="6">
            <el-form-item label="交易单号">
              <el-tag type="sucess">{{ stockBillData.billId }}</el-tag>
            </el-form-item>
          </el-col>
          <el-col :sm="12" :md="6" :lg="6" :xl="6">
            <el-form-item label="业务类型" prop="transTypeId">
              <el-select
                v-model="stockBillData.transTypeId"
                size="mini"
                placeholder="选择交易类型"
                :disabled="!isEditStatus"
              >
                <el-option
                  v-for="item in transTypes"
                  :key="item.fNumber"
                  :value="item.fNumber"
                  :label="item.fName"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :sm="12" :md="6" :lg="6" :xl="6">
            <el-form-item label="订单号">
              <el-input
                v-model="stockBillData.orderId"
                placeholder="请输入订单号"
                disabled
              />
            </el-form-item>
          </el-col>
          <el-col :sm="12" :md="6" :lg="6" :xl="6">
            <el-form-item label="备注">
              <el-input
                v-model="stockBillData.remark"
                placeholder="请输入备注"
                :disabled="!isEditStatus"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <!-- 出入库明细列表 -->
        <el-table
          :data="stockBillData.stockBillDetail"
          size="mini"
          border
          :header-cell-style="{ background: '#F3F4F7', 'text-align': 'center' }"
          empty-text="无数据"
        >
          <el-table-column label="序号" :width="isEditStatus ? 120 : 60">
            <template scope="scope">
              <span>{{ scope.row.fIndex }}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="商品名称"
            prop="goodsInfo.goodsName"
          />
          <el-table-column
            label="商品描述"
            prop="goodsInfo.goodsDesc"
            width="170"
          />
          <el-table-column
            label="品牌"
            prop="goodsInfo.brand"
            width="70"
          />
          <el-table-column
            label="颜色"
            prop="goodsColor.colorName"
            width="80"
          />
          <el-table-column
            label="规格"
            prop="goodsSpec.specName"
            width="100"
          />
          <el-table-column label="仓库" width="140">
            <template scope="scope">
              <el-select v-if="isEditStatus" v-model="scope.row.stockNumber">
                <el-option
                  v-for="(item, i) in stocks"
                  :key="i"
                  :label="item.fName"
                  :value="item.fNumber"
                />
              </el-select>
              <span v-else>{{ scope.row.stock.stockName }}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="销售单位"
            prop="goodsSpec.saleUnit"
            align="center"
            width="80"
          />
          <el-table-column label="数量" prop="quantity" width="120">
            <template scope="scope">
              <el-input
                v-if="isEditStatus"
                v-model="scope.row.quantity"
                type="number"
              />
              <span v-else>{{ scope.row.quantity }}</span>
            </template>
          </el-table-column>
          <el-table-column width="160">
            <template slot="header">
              <el-button
                type="primary"
                size="mini"
                plain
                :disabled="
                  !isEditStatus || stockBillData.transTypeId == saletypeId
                "
                @click="visibleSelectDialog = true"
              >选择商品</el-button>
            </template>
            <template slot-scope="scope">
              <el-button
                size="mini"
                @click="getInventoryInfo(scope.$index, scope.row)"
              >库存</el-button>
              <el-button
                v-if="isEditStatus && stockBillData.billState == 0"
                type="danger"
                size="mini"
                icon="el-icon-delete"
                @click="deleteRow(scope.$index, scope.row.id)"
              >删行</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-form>

      <!-- 商品选择对话框 -->
      <el-dialog title="选择具体商品" :visible.sync="visibleSelectDialog">
        <el-container>
          <el-aside width="240px">
            <el-tag type="primary">只有发布后的商品才能在此出现</el-tag>
            <el-cascader
              ref="goodscate"
              :options="goodsCategories"
              :show-all-levels="false"
              multipe="false"
              size="mini"
              placeholder="选择商品类别"
              :props="{
                label: 'categoryName',
                value: 'categoryId',
                checkStrictly: 'false',
              }"
              @change="categoryChange"
            />
            <div
              v-for="(item, i) in goodsList"
              :key="i"
              class="goodscate"
              @click="goodshandle(i)"
            >
              <img :src="$common.getBaseURL() + item.imgUrl">
              <div class="desc">{{ item.goodsName }}</div>
            </div>
          </el-aside>
          <el-main>
            <el-table
              :data="selectList"
              border
              size="mini"
              :header-cell-style="{
                background: '#F3F4F7',
                'text-align': 'center',
              }"
            >
              <el-table-column width="40">
                <template slot="header">
                  <el-checkbox
                    v-model="checkAll"
                    @change="changecheckall"
                  />
                </template>
                <template slot-scope="scope">
                  <el-checkbox v-model="scope.row.check" />
                </template>
              </el-table-column>
              <el-table-column
                label="品牌"
                prop="goodsInfo.brand"
              />
              <el-table-column label="规格" prop="specName" />
              <el-table-column label="颜色" prop="colorName" />
              <el-table-column label="售价" prop="price" />
            </el-table>
          </el-main>
        </el-container>
        <div slot="footer" class="dialog-footer">
          <el-button
            size="mini"
            @click="visibleSelectDialog = false"
          >取消</el-button>
          <el-button
            type="primary"
            size="mini"
            :disabled="!selectList.length"
            @click="confirmSelect"
          >确定</el-button>
        </div>
      </el-dialog>
      <!-- 订单选择对话框 -->
      <el-dialog title="待发货订单选择" :visible.sync="visibleShipped">
        <el-table
          :data="toBeShipped"
          size="mini"
          highlight-current-row
          border
          empty-text="暂无数据"
          @row-dblclick="confirmSelectOrder"
          @current-change="handleCurrentChange"
        >
          <el-table-column label="订单号" prop="OrderId" />
          <el-table-column label="订单日期" prop="OrderTime" />
          <el-table-column
            label="收货人"
            prop="Receiver"
            width="70"
          />
          <el-table-column label="收货地址" prop="DeliveryAddress" width="300">
            <template slot="header">
              <el-input
                v-model="searchKeywords"
                placeholder="搜索框按enter执行查询"
                size="mini"
                @keyup.enter.native="searchOrders"
              ><i slot="suffix" class="el-input__icon el-icon-search" /></el-input>
            </template>
          </el-table-column>
        </el-table>
        <div slot="footer" class="dialog-footer">
          <el-button
            size="mini"
            @click="visibleShipped = false"
          >取消</el-button>
          <el-button
            type="primary"
            size="mini"
            @click="confirmSelectOrder"
          >确定</el-button>
        </div>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
import apiGoods from '@/api/goods'
import apiSettings from '@/api/settings'
import apiInventory from '@/api/inventory'
import apiOrder from '@/api/order'
import { mapGetters } from 'vuex'
export default {
  name: 'StockBillDetail',
  data() {
    return {
      isAddBill: false,
      visibleShipped: false,
      visibleSelectDialog: false,
      transTypes: [], // 交易类型
      stocks: [], // 仓库列表
      isEditStatus: true, // 单据是否处于编辑状态
      // 单据实体
      stockBillData: {
        billId: '',
        Creator: this.userName,
        transTypeId: '',
        billState: 0,
        orderId: '',
        remark: '',
        stockBillDetail: []
      },
      // 验证实体
      billrules: {
        billId: {
          required: true,
          message: '交易单号不能为空',
          trigger: 'blur'
        },
        transTypeId: {
          required: true,
          message: '交易类型不能为空',
          trigger: 'blur'
        }
      },
      // 某最小类别下的goods列表
      goodsList: [],
      // 选择列表
      selectList: [],
      saletypeId: 'transtype_sale', // 销售出库类型代码
      // 所有商品分类(用于商品选择)
      goodsCategories: [],
      checkAll: false,
      searchKeywords: '', // 搜索订单关键字
      selectOrderId: 0, // 选中订单号
      toBeShipped: [] // 待发货订单
    }
  },
  beforeMount() {
    this.isAddBill = this.$route.params.isNew
    const billId = this.$route.params.billId
    // 路由参数中有isNew，当完成新增后刷新又会被initialBill, 为防这种情况所以用下面的写法，刷新后一律加载
    apiInventory.GetStockBill(billId).then((res) => {
      if (res.code == 200 && res.returnStatus == 0) {
        this.initialBill(billId)
      } else if (res.code == 200 && res.returnStatus == 1) {
        this.stockBillData = res.result
        this.isEditStatus = false
      }
    })
  },
  created() {
    // 交易类型
    apiSettings.GetSubMessageList('transtype').then((res) => {
      if (res.code == 200 && res.returnStatus == 1) {
        this.transTypes = res.result
      }
    })
    // 商品分类
    apiGoods.GetGoodsCategories('*').then((res) => {
      if (res.code == 200 && res.returnStatus == 1) {
        this.goodsCategories = res.result
      }
    })
    // 仓库列表
    apiSettings.GetSubMessageList('stock').then((res) => {
      if (res.code == 200 && res.returnStatus == 1) {
        this.stocks = res.result
      }
    })
  },
  methods: {
    // 显示获取订单对话框
    openOrdersDialog() {
      if (this.stockBillData.transTypeId != this.saletypeId) {
        this.$message.info('业务类型请选择“销售出库')
      } else {
        this.visibleShipped = true
      }
    },
    // 搜索待发货订单列表
    searchOrders() {
      apiInventory.GetToBeShipped(this.searchKeywords).then((res) => {
        if (res.code == 200 && res.returnStatus == 1) {
          this.toBeShipped = res.result
        }
      })
    },
    handleCurrentChange(val) {
      this.selectOrderId = val.OrderId
    },
    // 确定选择订单
    confirmSelectOrder() {
      if (this.selectOrderId) {
        apiOrder.GetOrderInfo(this.selectOrderId).then((res) => {
          this.visibleShipped = false
          this.stockBillData.orderId = this.selectOrderId
          this.stockBillData.remark = '由订单生成'
          this.stockBillData.stockBillDetail = [] // 覆盖掉上次的
          for (const i of res.result.orderList) {
            ``
            this.stockBillData.stockBillDetail.push({
              ...this.rowDefaultInfo, // 附上默认信息
              id: this.$common.guid(),
              goodsId: i.goodsId,
              goodsInfo: i.goodsInfo,
              specId: i.specId,
              goodsSpec: i.goodsSpec,
              specName: i.goodsSpec.specName,
              colorId: i.colorId,
              goodsColor: i.goodsColor,
              colorName: i.goodsColor.colorName,
              quantity: i.quantity
            })
          }
        })
      } else {
        this.$message({ message: '请选择订单', type: 'info' })
      }
    },
    // 选择商品类别
    categoryChange(selarr) {
      if (selarr) {
        const data = {
          queryScheme: 1, // 按商品分类
          hideUnderGoods: 1, // 隐藏下架
          queryValue: selarr[selarr.length - 1], // 商品分类
          pageModel: {
            pageNo: 1,
            pageSize: 30,
            orderField: '',
            orderWay: ''
          }
        }
        this.selectList = []
        apiGoods.QueryGoods(data).then((res) => {
          if (res.code == 200 && res.returnStatus == 1) {
            this.goodsList = res.result.items.map((x) => {
              return {
                goodsId: x.goodsId,
                goodsName: x.goodsName,
                imgUrl: x.goodsColors[0].imgFront
              }
            })
            this.$refs.goodscate.dropDownVisible = false // 关闭选择框
          }
        })
      }
    },
    // 点选对话框左侧商品
    goodshandle(index) {
      const goodsId = this.goodsList[index].goodsId
      this.checkAll = false
      apiGoods.GetGoodsInfo(goodsId).then((res) => {
        if (res.code == 200 && res.returnStatus == 1) {
          const arr = []
          for (const i of res.result.goodsSpecs) {
            for (const j of res.result.goodsColors) {
              arr.push({
                check: false,
                goodsId: res.result.goodsId,
                goodsInfo: res.result,
                specId: i.id,
                goodsSpec: i,
                specName: i.specName,
                colorId: j.id,
                goodsColor: j,
                colorName: j.colorName,
                price: i.price
              })
            }
          }
          this.selectList = arr
        }
      })
    },
    // 全选/全清
    changecheckall(e) {
      // console.log(e);
      this.selectList.forEach((p) => (p.check = e))
    },
    // 确定选取勾选的商品到单据
    confirmSelect() {
      const selects = this.selectList.filter((x) => x.check)
      if (selects.length == 0) {
        return this.$message({
          message: '请选择要加入的项目后再确定!',
          type: 'info'
        })
      }
      for (const i of selects) {
        this.stockBillData.stockBillDetail.push({
          id: this.$common.guid(),
          ...i,
          ...this.rowDefaultInfo // 新增行默认信息
        })
      }
      // 添加一下序号
      for (const i in this.stockBillData.stockBillDetail) {
        this.stockBillData.stockBillDetail[i].fIndex = Number.parseInt(i) + 1
      }
      this.visibleSelectDialog = false
    },
    // 初始化单据
    initialBill(newBillId) {
      this.stockBillData.billId = newBillId
      this.stockBillData.Creator = ''
      this.stockBillData.transTypeId = ''
      this.stockBillData.orderId = 0
      this.stockBillData.billState = 0
      this.stockBillData.remark = ''
      this.stockBillData.stockBillDetail = []
      this.isEditStatus = true
    },
    // 新增
    newBill() {
      // 产生新单号并修改路由参数中的单号
      const newId = 'W' + this.$common.getDigitSerial()
      this.$router.replace({
        name: 'stockBillDetail',
        params: { isNew: true, billId: newId }
      })
      this.initialBill(newId)
    },
    // 修改
    editBill() {
      this.isEditStatus = true
    },
    // 保存
    saveBill() {
      if (this.stockBillData.stockBillDetail.length == 0) {
        return this.$message.error('请添加商品!')
      }
      for (const i of this.stockBillData.stockBillDetail) {
        if (i.quantity == 0) {
          return this.$message.warning(`出入库数量不能为0！`)
        }
      }
      if (
        this.stockBillData.transTypeId == this.saletypeId &&
        !this.stockBillData.orderId
      ) {
        return this.$message.info(`销售出库没有对应的订单号！`)
      }
      if (
        this.stockBillData.transTypeId != this.saletypeId &&
        this.stockBillData.orderId
      ) {
        this.stockBillData.orderId = ''
      }
      for (const i in this.stockBillData.stockBillDetail) {
        this.stockBillData.stockBillDetail[i].fIndex = i * 1 + 1
      }

      // 去掉不必要跟随提交的数据
      const data = JSON.parse(JSON.stringify(this.stockBillData))
      data.goodsColors = []
      data.goodsSpecs = []
      data.stockBillDetail.map((x) => (x.stock = null))
      // 验证并提交
      this.$refs.billform.validate((valid) => {
        if (valid) {
          apiInventory.SaveStockBill(data).then((res) => {
            if (res.code == 200 && res.returnStatus == 1) {
              this.isEditStatus = false
              this.$message({ message: '保存成功', type: 'success' })
            } else {
              this.$message.error(JSON.stringify(res.msg))
            }
          })
        } else {
          return false
        }
      })
    },
    cancelEdit() {
      this.isEditStatus = false
    },
    // 审核
    auditBill() {
      apiInventory.AuditStockBill(this.stockBillData.billId, 1).then((res) => {
        if (res.code == 200 && res.returnStatus == 1 && res.result.status) {
          this.stockBillData.billState = 1
        } else {
          this.$message.error('审核失败' + JSON.stringify(res.msg))
        }
      })
    },
    // 反审
    cancelAuditBill() {
      apiInventory.AuditStockBill(this.stockBillData.billId, 0).then((res) => {
        if (res.code == 200 && res.returnStatus == 1 && res.result.status) {
          this.stockBillData.billState = 0
        } else {
          this.$message.error('反审核失败' + JSON.stringify(res.msg))
        }
      })
    },
    // 删除行
    deleteRow(index, id) {
      apiInventory.DeleteStockBillRow(id).then((res) => {
        if (res.code == 200 && res.returnStatus == 1 && res.result) {
          this.stockBillData.stockBillDetail.splice(index, 1)
        } else {
          this.$message.error(JSON.stringify(res.msg))
        }
      })
    },
    // 删除
    deleteBill() {
      this.$confirm('确定要删除吗？', '询问', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      }).then((r) => {
        apiInventory.DeleteStockBill(this.stockBillData.billId).then((res) => {
          if (res.code == 200 && res.returnStatus == 1) {
            this.$message({ message: '删除成功!', type: 'success' })
            this.$router.go(-1)
          } else {
            this.$message.error(JSON.stringify(res.msg))
          }
        })
      })
    },
    // 点击显示库存
    getInventoryInfo(index, row) {
      apiInventory
        .GetInventoryDetail(
          row.goodsId,
          row.colorId,
          row.specId,
          row.stockNumber
        )
        .then((res) => {
          this.$message.info(`第${index + 1}行库存数量：${res.result}`)
        })
    }
  },
  computed: {
    // 按钮状态
    buttonStatus() {
      return {
        new: !this.isEditStatus,
        edit:
          !this.isEditStatus &&
          this.stockBillData &&
          this.stockBillData.billState == 0,
        save: this.isEditStatus,
        cancelEdit: this.isEditStatus,
        order: this.isEditStatus,
        audit:
          !this.isEditStatus &&
          this.stockBillData &&
          this.stockBillData.billState == 0,
        cancel: this.stockBillData && this.stockBillData.billState == 1,
        delete:
          !this.isEditStatus &&
          this.stockBillData &&
          this.stockBillData.billState == 0
      }
    },
    // 默认仓库
    defaultStock() {
      if (this.stocks.length) {
        return {
          stockNumber: this.stocks[0].fNumber,
          stockName: this.stocks[0].fName
        }
      } else {
        return {
          stockNumber: '',
          stockName: ''
        }
      }
    },
    // 新增行默认数据
    rowDefaultInfo() {
      return {
        billId: this.stockBillData.billId,
        fIndex: 100,
        isNew: 1,
        stockNumber: this.defaultStock.stockNumber,
        stock: this.defaultStock,
        quantity: 0
      }
    },
    ...mapGetters(['userName'])
  }
}
</script>

<style lang="less" scoped>
@import "~@/styles/common.less";
.btngroup {
  margin: 10px auto;
  .btn {
    margin-right: 2px;
  }
}
.goodscate {
  height: 60px;
  width: 100%;
  img {
    width: 50px;
    height: 50px;
    margin-right: 10px;
  }
  .desc {
    width: 140px;
    height: 50px;
    line-height: 24px;
    .overLines(2);
  }
  display: flex;
  align-items: center;
  justify-content: flex-start;
  &:hover {
    cursor: pointer;
    background-color: rgb(2220, 220, 220);
  }
}
</style>
