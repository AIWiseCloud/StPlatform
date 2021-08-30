<template>
  <div class="container">
    <el-collapse v-model="activename">
      <el-collapse-item name="1">
        <template slot="title">
          <span>查询条件<i class="el-icon-search" style="color: red"></i></span>
        </template>
        <el-form
          :model="searchModel"
          label-width="92px"
          class="demo-ruleForm"
          size="mini"
        >
          <el-row :gutter="10">
            <el-col :sm="12" :md="8" :lg="6" :xl="4">
              <el-form-item label="关键字" title="关键字">
                <el-input
                  v-model="searchModel.queryValue"
                  placeholder="订单号\商品ID\商品名称"
                  clear
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :sm="12" :md="8" :lg="6" :xl="4">
              <el-form-item label="订单状态" title="订单状态">
                <el-select
                  v-model="searchModel.statusId"
                  placeholder="选择订单状态"
                >
                  <el-option
                    v-for="(item, i) in orderStatus"
                    :key="i"
                    :label="item.name"
                    :value="item.statusId"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :sm="12" :md="8" :lg="6" :xl="4">
              <el-form-item label="开始时间">
                <el-date-picker
                  v-model="searchModel.startDate"
                  type="datetime"
                  value-format="yyyy-MM-dd HH:mm:ss"
                  placeholder="选择开始日期时间"
                >
                </el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :sm="12" :md="8" :lg="6" :xl="4">
              <el-form-item label="结束时间">
                <el-date-picker
                  v-model="searchModel.endDate"
                  type="datetime"
                  value-format="yyyy-MM-dd HH:mm:ss"
                  placeholder="选择截止日期时间"
                ></el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :sm="12" :md="16" :lg="12" :xl="8">
              <el-button
                type="primary"
                icon="el-icon-search"
                size="small"
                plain
                @click="searchData"
                >查询</el-button
              >
            </el-col>
          </el-row>
        </el-form>
      </el-collapse-item>
    </el-collapse>
    <!-- 订单列表 -->
    <div class="wrapper" style="width: 100%">
      <el-row :gutter="10">
        <el-col
          v-for="(ordermain, i) in orderData"
          :key="i"
          style="padding-bottom: 10px"
        >
          <!-- 以卡片的形式显示每张订单 -->
          <el-card :body-style="{ padding: '0px' }" shadow="hover">
            <!-- 订单头 -->
            <div slot="header" class="clearfix">
              <span>{{ SetTime(ordermain.orderTime) }}</span>
              <span style="margin-left: 10px">{{
                `订单号：` + ordermain.orderId
              }}</span>
            </div>
            <!-- 订单明细 -->
            <el-table
              :data="ordermain.orderList"
              :span-method="RowspanMethod"
              size="small"
            >
              <el-table-column label="图片" width="80px">
                <template slot-scope="scope">
                  <el-popover ref="pooover" placement="top" trigger="hover">
                    <el-image
                      style="width: 300px; height: 300px"
                      :src="
                        $common.getBaseURL() + scope.row.goodsColor.imgFront
                      "
                      fit="scale-down"
                    />
                    <el-image
                      slot="reference"
                      :src="
                        $common.getBaseURL() + scope.row.goodsColor.imgFront
                      "
                      style="width: 60px; height: 60px"
                    />
                  </el-popover>
                </template>
              </el-table-column>
              <el-table-column label="商品信息">
                <template slot-scope="scope">
                  <span style="width: 320px"
                    >{{ scope.row.goodsInfo.goodsName
                    }}{{ scope.row.goodsInfo.goodsDesc }}</span
                  >
                </template>
              </el-table-column>
              <el-table-column label="颜色" width="72px">
                <template slot-scope="scope">{{
                  scope.row.goodsColorSpec.colorName
                }}</template>
              </el-table-column>
              <el-table-column label="规格" width="72px">
                <template slot-scope="scope">{{
                  scope.row.goodsColorSpec.specName
                }}</template>
              </el-table-column>
              <el-table-column label="单价" width="70px">
                <template slot-scope="scope">{{
                  scope.row.unitPrice
                }}</template>
              </el-table-column>
              <el-table-column label="数量" width="70px">
                <template slot-scope="scope">{{ scope.row.quantity }}</template>
              </el-table-column>
              <el-table-column label="合计" width="70px">
                <template slot-scope="scope">{{ scope.row.amount }}</template>
              </el-table-column>
              <el-table-column label="收货人" width="70px">
                <el-row>
                  <i style="font-size: 14px">{{ ordermain.receiver }}</i>
                </el-row>
              </el-table-column>
              <el-table-column label width="135px">
                <div>
                  <el-tag v-if="ordermain.statusId == 0" type="danger">
                    <!-- 待付款 -->
                    卖家未付款
                  </el-tag>
                  <el-tag
                    v-else-if="ordermain.statusId == 1"
                    type="warning"
                    effect="dark"
                  >
                    <!-- 待发货 -->
                    买家已付款
                  </el-tag>
                  <el-tag v-else-if="ordermain.statusId == 2" type="success">
                    <!-- 待收货 -->
                    等待收货
                  </el-tag>
                  <el-tag v-else-if="ordermain.statusId == 3" type="primary">
                    <!-- 已签收 -->
                    订单已签收
                  </el-tag>
                  <el-tag
                    v-else-if="ordermain.statusId == -2"
                    type="info"
                    effect="dark"
                    >已删除</el-tag
                  >
                  <el-tag v-else-if="ordermain.statusId == -1" type="info"
                    >已取消</el-tag
                  >
                </div>
                <!-- 订单详情 -->
                <div style="margin-top: 5px">
                  <el-button
                    type="primary"
                    icon="el-icon-tickets"
                    plain
                    size="mini"
                    >订单详情</el-button
                  >
                </div>
              </el-table-column>
              <el-table-column width="135px">
                <el-row v-show="ordermain.statusId == 1">
                  <el-button
                    type="success"
                    size="mini"
                    plain
                    icon="el-icon-truck"
                    @click.native="handleDeliver(i, ordermain)"
                    >去发货</el-button
                  >
                </el-row>
                <el-row v-show="ordermain.statusId == 2">
                  <el-button
                    type="danger"
                    size="mini"
                    plain
                    icon="el-icon-truck"
                    @click.native="handleCancelDeliver(i, ordermain)"
                    >取消发货</el-button
                  >
                </el-row>
                <el-row>
                  <el-button
                    type="blue"
                    plain
                    size="small"
                    icon="el-icon-printer"
                    @click.native="handlePrint(i, ordermain)"
                    >打印订单</el-button
                  >
                </el-row>
              </el-table-column>
            </el-table>
          </el-card>
        </el-col>
      </el-row>
      <!-- 分页组件 -->
      <div class="block">
        <el-pagination
          @current-change="loadData"
          :current-page.sync="searchModel.pageModel.pageNo"
          :page-size="searchModel.pageModel.pageSize"
          layout="total, prev, pager, next"
          :total="totalCount"
        >
        </el-pagination>
      </div>
      <!-- 发货对话框 -->
      <el-dialog title="订单发货" :visible.sync="dialogDeliver" width="70%">
        <el-row style="font-weight: bold; color: #409eff">商品</el-row>
        <el-table :data="orderInfo.orderList" size="mini">
          <el-table-column label prop width="80">
            <template slot-scope="scope">
              <el-popover ref="popover" placement="top" trigger="hover">
                <el-image
                  :src="$common.getBaseURL() + scope.row.goodsColor.imgFront"
                  style="width: 300px; height: 300px"
                  fit="scale-down"
                />
                <el-image
                  slot="reference"
                  :src="$common.getBaseURL() + scope.row.goodsColor.imgFront"
                  style="width: 60px; height: 60px"
                />
              </el-popover>
            </template>
          </el-table-column>
          <el-table-column label="商品信息" width="340" fit>
            <template slot-scope="scope">
              <el-row>
                <el-link type="primary" :underline="false">
                  {{
                    `${scope.row.goodsInfo.goodsName} ${scope.row.goodsInfo.goodsDesc}`
                  }}
                </el-link>
              </el-row>
              <el-row>
                {{
                  `${scope.row.goodsColorSpec.colorName} ${scope.row.goodsColorSpec.specName}`
                }}
              </el-row>
            </template>
          </el-table-column>
          <el-table-column label="单价" width="70px">
            <template slot-scope="scope">
              {{ `${scope.row.unitPrice}元/${scope.row.goodsInfo.unitName}` }}
            </template>
          </el-table-column>
          <el-table-column label="数量" width="70px" prop="quantity">
            <template slot-scope="scope">{{ scope.row.quantity }}</template>
          </el-table-column>
          <el-table-column label="合计" width="70px">
            <template slot-scope="scope">
              {{ `${scope.row.amount}` }}
            </template>
          </el-table-column>
        </el-table>
        <el-row class="magTop">
          <el-link type="danger" :underline="false">{{
            `买家留言:` + orderInfo.words
          }}</el-link>
        </el-row>
        <el-row class="magTop" style="font-weight: bold; color: #409eff"
          >配送信息</el-row
        >
        <el-row class="magTop">
          {{ `收货人及电话：${orderInfo.receiver}(${orderInfo.phoneNumber})` }}
        </el-row>
        <el-row class="magTop">{{
          `收货地址：` + orderInfo.deliveryAddress
        }}</el-row>
        <el-row class="magTop" style="font-weight: bold; color: #409eff">
          发货信息
        </el-row>
        <el-row class="magTop" style="margin-bottom: 20px">
          <span
            >配送方式：{{
              orderInfo.distributionMethod == 1 ? "快递" : "自取"
            }}</span
          >
        </el-row>
        <el-form
          v-model="deliveryInfo"
          label-width="92px"
          label-position="right"
          size="mini"
        >
          <el-row>
            <el-col :sm="12" :md="8" :lg="8" :xl="8">
              <el-form-item label="物流公司" prop="logisticsId">
                <el-input
                  v-model="deliveryInfo.logisticsId"
                  size="mini"
                  placeholder="输入物流公司"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :sm="12" :md="8" :lg="8" :xl="8">
              <el-form-item label="物流单号">
                <el-input
                  v-model="deliveryInfo.expressId"
                  size="mini"
                  placeholder="输入物流单号"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :sm="12" :md="8" :lg="8" :xl="8">
              <el-form-item label="出库单号">
                <el-input
                  v-model="deliveryInfo.billId"
                  size="mini"
                  placeholder="输入出库单号"
                  disabled
                ></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button type="primary" @click="btnDeliver()">发货</el-button>
          <el-button @click="dialogDeliver = false"> 取消 </el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
/* eslint-disable */
import apiOrder from "@/api/order";
import apiReport from "@/api/report";
import openwindow from "@/utils/open-window.js";
export default {
  name: "orders",
  data() {
    return {
      activename: "1",
      totalCount: 0,
      orderData: [], //订单列表数据
      searchModel: {
        queryScheme: 0, //方案0表示按关键字、状态、日期范围搜索
        statDate: "",
        endDate: "",
        unionId: "*", //*表示后端调用
        queryValue: "",
        statusId: 1, //1待发货,9表示所有订单状态
        pageModel: {
          pageNo: 1,
          pageSize: 10,
          orderField: "",
          orderWay: "",
        },
      },
      orderStatus: [
        { statusId: 9, name: "全部" },
        { statusId: 0, name: "待付款" },
        { statusId: 1, name: "待发货" },
        { statusId: 2, name: "待签收" },
        { statusId: 3, name: "待评论" },
        { statusId: -1, name: "已取消" },
        { statusId: -2, name: "已删除" },
      ],
      spanArr: [],
      dialogDeliver: false, //显示发货对话框
      orderInfo: {}, //订单信息
      deliveryInfo: {
        orderId: "",
        logisticsId: "DB",
        expressId: "",
        billId: "",
        isDelivery: 1,
      },
    };
  },
  methods: {
    //加载数据
    loadData() {
      apiOrder.QueryOrders(this.searchModel).then((res) => {
        if (res.code == 200 && res.returnStatus == 1) {
          const { totalCount, items } = res.result;
          this.totalCount = totalCount;
          this.orderData = items;
          // console.log(JSON.stringify(this.orderData));
        }
      });
    },
    //查询
    searchData() {
      this.searchModel.pageModel.pageNo = 1;
      this.loadData();
    },
    //设置日期显示
    SetTime(datetime) {
      if (datetime != null) return datetime.replace("T", " ");
      else return "";
    },
    RowspanMethod({ row, column, rowIndex, columnIndex }) {
      if (columnIndex === 7 || columnIndex === 8 || columnIndex === 9) {
        if (rowIndex === 0) {
          // console.log("合并的数据:", row, "index:", rowIndex);
          let count = 1;
          this.spanArr.forEach((item) => {
            if (item.orderId == row.orderId) count = item.cellMerge;
          });
          return {
            rowspan: count,
            colspan: 1,
          };
        } else {
          return {
            rowspan: 0,
            colspan: 0,
          };
        }
      }
    },
    //去发货
    handleDeliver(index, ordermain) {
      this.orderInfo = ordermain;
      this.deliveryInfo.orderId = ordermain.orderId;
      this.deliveryInfo.expressId = "";
      apiOrder
        .GetBillId(this.orderInfo.orderId)
        .then((res) => {
          if (res.code == 200 && res.returnStatus == 1) {
            this.deliveryInfo.billId = res.result;
          }
        })
        .catch((err) => {
          console.log(err);
        });
      this.dialogDeliver = true;
    },
    //发货
    btnDeliver() {
      if (!this.deliveryInfo.billId) {
        return this.$message({ message: "缺少销售出库单", type: "info" });
      }
      if (
        this.orderInfo.distributionMethod == "1" &&
        (!this.deliveryInfo.logisticsId || !this.deliveryInfo.expressId)
      ) {
        return this.$message({
          message: "请录入物流公司及物流单号",
          type: "info",
        });
      }
      this.deliveryInfo.isDelivery = 1;
      apiOrder.DeliveryOrder(this.deliveryInfo).then((res) => {
        if (res.code == 200 && res.returnStatus == 1) {
          this.$message({ message: "发货成功", type: "success" });
          this.dialogDeliver = false;
        } else {
          this.$message.info(res.msg);
        }
      });
    },
    //取消发货
    handleCancelDeliver(i, ordermain) {
      this.deliveryInfo.orderId = ordermain.orderId;
      this.deliveryInfo.isDelivery = 0;
      this.$confirm("确定要取消吗？", "询问", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
      })
        .then((r) => {
          return apiOrder.GetBillId(this.deliveryInfo.orderId);
        })
        .then((res) => {
          if (res.code == 200 && res.returnStatus == 1) {
            this.deliveryInfo.billId = res.result;
            return apiOrder.DeliveryOrder(this.deliveryInfo);
          } else {
            return Promise.Promise("未找到销售出库单!");
          }
        })
        .then((res) => {
          if (res.code == 200 && res.returnStatus == 1) {
            this.$message({ message: "取消发货成功", type: "success" });
            this.dialogDeliver = false;
          } else {
            this.$message.info(res.msg);
          }
        });
    },
    //打印订单
    handlePrint(i, ordermain) {
      let printOrderData = {
        orderId: ordermain.orderId,
        distributionMethod: ordermain == "1" ? "快递" : "自取",
        receiver: ordermain.receiver,
        phoneNumber: ordermain.phoneNumber,
        deliveryAddress: ordermain.deliveryAddress,
        statusId: ordermain.statusId,
        amount: ordermain.amount,
        freight: ordermain.freight,
        discount: ordermain.discount,
        realPay: ordermain.realPay,
        logisticsId: ordermain.logisticsId,
        expressId: ordermain.expressId,
        paymentChannel: ordermain.paymentChannel,
        orderTime: ordermain.orderTime,
        orderList: [],
      };
      for (let i of ordermain.orderList) {
        printOrderData.orderList.push({
          lineId: i.lineId,
          goodsName: `${i.goodsInfo.goodsName} ${i.goodsInfo.goodsDesc} ${i.goodsColorSpec.colorName} ${i.goodsColorSpec.specName}`,
          localId: "ST-002",
          unitPrice: i.unitPrice,
          quantity: i.quantity,
          amount: i.amount,
          unitName: i.goodsInfo.unitName,
        });
      }
      let data = {
        reportId: "001",
        billId: ordermain.orderId,
        source: printOrderData,
      };
      // console.log(JSON.stringify(data));
      // return;
      apiReport
        .StringSaveAsJsonFile(data)
        .then((res) => {
          if(res.code==200 && res.returnStatus==1 && res.result.status){
             //返回的id作为调用报表的参数
            openwindow(this.$common.REPORT_URL+`preview?id=${res.result.id}`);
          }else{
            this.$message.error(res.msg);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
  },
  created() {
    this.loadData();
  },
};
</script>

<style lang="less" scoped>
.container {
  margin: 18px;
}
.el-select {
  display: inline-block;
  position: relative;
  width: 100%;
}

/deep/.el-date-editor {
  width: 100%;
}
/deep/.el-tag--primary {
  background-color: #ecf5ff;
  color: #409eff;
  border: 1px solid #d9ecff;
}
/deep/.el-button--primary {
  color: #409eff;
  background: #ecf5ff;
  border-color: #b3d8ff;
}

/deep/.el-card__header {
  background-color: #f5f5f5;
  border: 1px solid #e8e8e8;
}

/deep/.el-card {
  color: #3c3c3c;
}

/deep/.el-table .success-row {
  background: #f0f9eb;
}

/deep/.el-card__header {
  padding: 15px 15px;
}

// 步骤条完成后，蓝色显示
/deep/.el-step__head.is-finish {
  color: #409eff;
  border-color: #409eff;
}

// 步骤条未完成，灰色显示
/deep/.el-step__head.is-process {
  color: #9ea4af;
}

/deep/.el-step__icon-inner {
  font-size: 32px;
}

/deep/.el-dialog__body {
  padding: 10px 20px;
}

/deep/.video-js {
  height: 100px;
  width: 100px;
  background-color: black;
  margin: 10px;
}

.HideText {
  // width: 100%;
  display: inline-block;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

/deep/.el-tabs--border-card > .el-tabs__header .el-tabs__item.is-active {
  color: #409eff;
}

.magTop {
  margin-top: 8px;
}

.magBottom {
  margin-top: 8px;
  margin-bottom: 8px;
}

.el-link.el-link--primary {
  color: #409eff;
}

.iConMargin {
  margin-top: 5px;
}

/deep/.el-checkbox.is-bordered.is-checked {
  border-color: #409eff;
}

/deep/.el-checkbox__input.is-checked + .el-checkbox__label {
  color: #409eff;
}

/deep/.el-checkbox__input.is-checked .el-checkbox__inner {
  background-color: #409eff;
  border-color: #409eff;
}

/deep/.el-checkbox.is-bordered.is-disabled {
  border-color: #ebeef5;
}
</style>