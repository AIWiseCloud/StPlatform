<template>
  <div class="container">
    <el-collapse v-model="activename">
      <el-collapse-item name="1">
        <template slot="title">
          <span>查询条件<i class="el-icon-search" style="color: red" /></span>
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
                />
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
                  />
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
                />
              </el-form-item>
            </el-col>
            <el-col :sm="12" :md="8" :lg="6" :xl="4">
              <el-form-item label="结束时间">
                <el-date-picker
                  v-model="searchModel.endDate"
                  type="datetime"
                  value-format="yyyy-MM-dd HH:mm:ss"
                  placeholder="选择截止日期时间"
                />
              </el-form-item>
            </el-col>
            <el-col :sm="12" :md="16" :lg="12" :xl="8">
              <el-button
                type="primary"
                icon="el-icon-search"
                size="small"
                plain
                @click="searchData"
              >查询</el-button>
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
                        $common.getBaseURL() +
                          '/2021-09-18/20210918110412057.png'
                      "
                      fit="scale-down"
                    />
                    <el-image
                      slot="reference"
                      :src="
                        $common.getBaseURL() +
                          '/2021-09-18/20210918110412057.png'
                      "
                      style="width: 60px; height: 60px"
                    />
                  </el-popover>
                </template>
              </el-table-column>
              <el-table-column label="商品信息">
                <template slot-scope="scope">
                  <span
                    style="width: 320px"
                  >{{ scope.row.goodsInfo.goodsName
                  }}{{ scope.row.goodsInfo.goodsDesc }}</span>
                </template>
              </el-table-column>
              <el-table-column label="配比" width="72px">
                <template slot-scope="scope">{{
                  scope.row.goodsInfo.mixture
                }}</template>
              </el-table-column>
              <el-table-column label="品牌" width="72px">
                <template slot-scope="scope">{{
                  scope.row.goodsInfo.brand
                }}</template>
              </el-table-column>
              <el-table-column label="单价" width="70px">
                <template slot-scope="scope">{{
                  scope.row.unitPrice
                }}</template>
              </el-table-column>
              <el-table-column label="数量" width="70px">
                <template
                  slot-scope="scope"
                >{{ scope.row.quantity
                }}{{ scope.row.goodsInfo.unitName }}</template>
              </el-table-column>
              <el-table-column label="合计" width="70px">
                <template slot-scope="scope">{{ scope.row.amount }}</template>
              </el-table-column>
              <el-table-column label="收货人" width="70px">
                <el-row>
                  <i style="font-size: 14px">{{ ordermain.receiver }}</i>
                </el-row>
              </el-table-column>
              <el-table-column label="状态" width="85" align="center">
                <el-tag v-if="ordermain.statusId == 0" type="danger">
                  待付款
                </el-tag>
                <el-tag
                  v-else-if="ordermain.statusId == 1"
                  type="warning"
                  effect="dark"
                >
                  待发货
                </el-tag>
                <el-tag v-else-if="ordermain.statusId == 2" type="success">
                  <!-- 待收货 -->
                  待收货
                </el-tag>
                <el-tag v-else-if="ordermain.statusId == 3" type="primary">
                  <!-- 已签收 -->
                  已签收
                </el-tag>
                <el-tag
                  v-else-if="ordermain.statusId == -2"
                  type="info"
                  effect="dark"
                >已删除</el-tag>
                <el-tag
                  v-else-if="ordermain.statusId == -1"
                  type="info"
                >已取消</el-tag>
              </el-table-column>
              <el-table-column min-width="185" label="订单操作" align="center">
                <template scope="scope">
                  <el-button
                    type="success"
                    icon="el-icon-tickets"
                    plain
                    size="mini"
                    style="margin-left: 4px"
                  >详情</el-button>
                  <el-button
                    type="blue"
                    plain
                    size="small"
                    icon="el-icon-printer"
                    @click.native="handlePrint(ordermain)"
                  >打印</el-button>
                  <el-button
                    v-if="ordermain.statusId == 0 && ordermain.paymentWay == 1"
                    type="danger"
                    size="mini"
                    plain
                    icon="el-icon-truck"
                    @click="goConfirmPay(i, ordermain.orderAttach)"
                  >线下到款确认</el-button>
                  <el-button
                    v-if="ordermain.statusId == 1 && ordermain.paymentWay == 1"
                    type="danger"
                    size="mini"
                    plain
                    icon="el-icon-truck"
                    @click="cancelConfirmPay(i, ordermain.orderAttach)"
                  >取消到款确认</el-button>
                  <el-button
                    v-if="ordermain.statusId == 1"
                    type="primary"
                    size="mini"
                    plain
                    icon="el-icon-truck"
                    @click.native="handleDeliver(i, ordermain)"
                  >去发货</el-button>
                  <el-button
                    v-if="ordermain.statusId == 2"
                    type="danger"
                    size="mini"
                    plain
                    icon="el-icon-truck"
                    @click.native="handleCancelDeliver(i, ordermain)"
                  >取消发货</el-button>
                  <el-button
                    v-if="ordermain.statusId >= 2"
                    type="danger"
                    size="mini"
                    plain
                    icon="el-icon-tickets"
                    @click="viewInvoice(ordermain.orderId)"
                  >发票</el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-card>
        </el-col>
      </el-row>
      <!-- 分页组件 -->
      <div class="block">
        <el-pagination
          :current-page.sync="searchModel.pageModel.pageNo"
          :page-size="searchModel.pageModel.pageSize"
          layout="total, prev, pager, next"
          :total="totalCount"
          @current-change="loadData"
        />
      </div>
      <!-- 发货对话框 -->
      <el-dialog title="订单发货" :visible.sync="dialogDeliver" width="70%">
        <el-row style="font-weight: bold; color: #409eff">商品</el-row>
        <el-table :data="orderInfo.orderList" size="mini">
          <el-table-column label prop width="80">
            <template slot-scope="scope">
              <el-popover ref="popover" placement="top" trigger="hover">
                <el-image
                  :src="
                    $common.getBaseURL() + '/2021-09-18/20210918110412057.png'
                  "
                  style="width: 300px; height: 300px"
                  fit="scale-down"
                />
                <el-image
                  slot="reference"
                  :src="
                    $common.getBaseURL() + '/2021-09-18/20210918110412057.png'
                  "
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
        <el-row
          class="magTop"
          style="font-weight: bold; color: #409eff"
        >配送信息</el-row>
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
          <span>配送方式：{{
            orderInfo.distributionMethod == 1 ? "快递" : "自取"
          }}</span>
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
                />
              </el-form-item>
            </el-col>
            <el-col :sm="12" :md="8" :lg="8" :xl="8">
              <el-form-item label="物流单号" prop="expressId">
                <el-input
                  v-model="deliveryInfo.expressId"
                  size="mini"
                  placeholder="输入物流单号"
                />
              </el-form-item>
            </el-col>
            <el-col :sm="12" :md="8" :lg="8" :xl="8">
              <el-form-item label="出库单号">
                <el-input
                  v-model="deliveryInfo.billId"
                  size="mini"
                  placeholder="输入出库单号"
                  disabled
                />
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button type="primary" @click="btnDeliver()">发货</el-button>
          <el-button @click="dialogDeliver = false"> 取消 </el-button>
        </div>
      </el-dialog>
      <!-- 线下到款确认对话框 -->
      <el-dialog title="线下到款确认" :visible.sync="dialogpay">
        <el-form :model="orderAttach" size="mini" label-width="92px">
          <el-form-item label="上传日期">
            <el-input v-model="orderAttach.createDate" disabled />
          </el-form-item>
          <el-form-item label="打款凭证">
            <el-image
              :src="$common.getBaseURL() + orderAttach.payVoucherUrl"
              style="width: 300px; height: 300px"
              fit="scale-down"
            />
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button
            type="danger"
            size="mini"
            @click="confirmPay(1)"
          >确认到款</el-button>
          <el-button size="mini" @click="dialogpay = false"> 取消 </el-button>
        </div>
      </el-dialog>
      <!-- 发票对话框 -->
      <el-dialog title="开发票记录" :visible.sync="dialoginvoice">
        <el-form :model="invoiceData" label-width="92px" size="mini">
          <el-row>
            <el-col :span="8">
              <el-form-item
                label="订单号"
              ><el-input v-model="invoiceData.orderId" readonly /></el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item
                label="开票金额"
              ><el-input v-model="invoiceData.invoAmt" readonly /></el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item
                label="开票状态"
              ><el-input v-model="invoiceData.statusName" readonly /></el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <el-form-item
                label="申请日期"
              ><el-input v-model="invoiceData.applyTime" readonly /></el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item
                label="开票日期"
              ><el-input v-model="invoiceData.invoiceTime" readonly /></el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item
                label="发票类型"
              ><el-input v-model="invoiceData.invoiceTypeName" readonly /></el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <el-form-item
                label="抬头类型"
              ><el-input v-model="invoiceData.titleTypeName" readonly /></el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item
                label="抬头名称"
              ><el-input v-model="invoiceData.titleName" readonly /></el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item
                label="发票内容"
              ><el-input v-model="invoiceData.contentTypeName" readonly /></el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item
                label="开户银行"
              ><el-input v-model="invoiceData.bankName" readonly /></el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item
                label="银行账号"
              ><el-input v-model="invoiceData.bankAccount" readonly /></el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item
                label="企业税号"
              ><el-input v-model="invoiceData.taxId" readonly /></el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item
                label="注册电话"
              ><el-input v-model="invoiceData.registerTel" readonly /></el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <el-form-item
                label="注册地址"
              ><el-input
                v-model="invoiceData.registerAddress"
                readonly
              /></el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item
                label="收票人"
              ><el-input v-model="invoiceData.orderId" readonly /></el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item
                label="收票人电话"
              ><el-input v-model="invoiceData.invoAmt" readonly /></el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item
                label="收票人邮箱"
              ><el-input v-model="invoiceData.statusId" readonly /></el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item
                label="收票人地址"
              ><el-input v-model="invoiceData.orderId" readonly /></el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="16">
              <el-form-item label="发票图片">
                <el-upload
                  class="avatar-uploader"
                  :show-file-list="false"
                  action
                  :before-upload="handleImageBefore"
                  :http-request="(params) => requestImgUpload(params)"
                >
                  <el-image
                    v-if="invoiceData.invoiceUrl"
                    class="avatar"
                    :src="$common.getBaseURL() + invoiceData.invoiceUrl"
                    :onerror="ErrorImg"
                  />
                  <i v-else class="el-icon-plus avatar-uploader-icon" />
                </el-upload>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="开票人">
                <el-input v-model="invoiceData.drawer" readonly />
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button
            type="danger"
            size="mini"
            @click="finishInvoice"
          >确认已开票</el-button>
          <el-button size="mini" @click="dialoginvoice = false">
            取消
          </el-button>
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
import apiInvoice from "@/api/invoice";
import upload from "@/api/base.js";
import { mapGetters } from "vuex";
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
      dialogpay: false,
      dialoginvoice: false,
      orderInfo: {}, //订单信息
      deliveryInfo: {
        orderId: "",
        logisticsId: "DB",
        expressId: "WL001",
        billId: "*",
        isDelivery: 1,
      },
      orderAttach: {
        orderId: "",
        unionId: "",
        payVoucherUrl: "",
        createDate: "",
        rindex: 0,
      },
      invoiceData: {
        id: "",
        orderId: "",
        invoAmt: 0,
        unionId: "",
        statusId: 0,
        applyTime: "",
        invoiceTime: "",
        invoiceType: "",
        contentType: "",
        titleName: "",
        titleType: "",
        taxId: "",
        registerAddress: "",
        registerTel: "",
        bankName: "",
        bankAccount: "",
        collector: "",
        collectorPhone: "",
        collectorMail: "",
        drawer: "",
        invoiceUrl: "",
      },
      fileName: "",
      ErrorImg: 'this.src="' + require("@/assets/images/blankimg.png") + '"', //图片错误地址
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
      this.deliveryInfo.expressId = "WL0000001";
      this.deliveryInfo.rindex = index;
      // apiOrder
      //   .GetBillId(this.orderInfo.orderId)
      //   .then((res) => {
      //     if (res.code == 200 && res.returnStatus == 1) {
      //       this.deliveryInfo.billId = res.result;
      //     }
      //   })
      //   .catch((err) => {
      //     console.log(err);
      //   });
      this.dialogDeliver = true;
    },
    //发货
    btnDeliver() {
      // if (!this.deliveryInfo.billId) {
      //   return this.$message({ message: "缺少销售出库单", type: "info" });
      // }
      if (
        this.orderInfo.distributionMethod == "1" &&
        (!this.deliveryInfo.logisticsId || !this.deliveryInfo.expressId)
      ) {
        return this.$message({
          message: "请录入物流公司及物流单号",
          type: "info",
        });
      }
      let index = this.deliveryInfo.rindex;
      this.deliveryInfo.isDelivery = 1;
      apiOrder.DeliveryOrder(this.deliveryInfo).then((res) => {
        if (res.code == 200 && res.returnStatus == 1) {
          this.orderData[index].statusId = 2;
          this.$set(this.orderData, index, this.orderData[index]);
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
          //由订单号获取出库单号(盛天不关联库存，注销一些相关代码)
          // return apiOrder.GetBillId(this.deliveryInfo.orderId);
          return apiOrder.DeliveryOrder(this.deliveryInfo);
        })
        // .then((res) => {
        //   if (res.code == 200 && res.returnStatus == 1) {
        //     this.deliveryInfo.billId = res.result;
        //     return apiOrder.DeliveryOrder(this.deliveryInfo);
        //   } else {
        //     this.$message.error(res.msg);
        //     return Promise.reject(res.msg);
        //   }
        // })
        .then((res) => {
          if (res.code == 200 && res.returnStatus == 1) {
            this.orderData[i].statusId = 1;
            this.$set(this.orderData, i, this.orderData[i]);
            this.$message({ message: "取消发货成功", type: "success" });
            this.dialogDeliver = false;
          } else {
            this.$message.info(res.msg);
          }
        });
    },
    //打印订单
    handlePrint(ordermain) {
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
          if (res.code == 200 && res.returnStatus == 1 && res.result.status) {
            //返回的id作为调用报表的参数
            openwindow(this.$common.REPORT_URL + `preview?id=${res.result.id}`);
          } else {
            this.$message.error(res.msg);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
    //去确认线下到款
    goConfirmPay(rindex, attach) {
      if (!attach.payVoucherUrl) {
        return this.$message.error("买家尚未上传打款凭证");
      }
      this.orderAttach = attach;
      this.orderAttach.rindex = rindex;
      this.dialogpay = true;
    },
    //确认到款
    confirmPay(isConfirm) {
      // console.log(rindex,isConfirm,JSON.stringify(this.orderAttach));
      apiOrder.ConfirmPay(this.orderAttach.orderId, isConfirm).then((res) => {
        // console.log(JSON.stringify(res))
        let rindex = this.orderAttach.rindex;
        if (res.code == 200 && res.returnStatus == 1) {
          this.orderData[rindex].statusId = isConfirm;
          this.$set(this.orderData, rindex, this.orderData[rindex]);
          this.dialogpay = false;
        } else {
          this.$message.error(res.msg);
        }
      });
    },
    //取消确认到款
    cancelConfirmPay(rindex, attach) {
      this.orderAttach = attach;
      this.orderAttach.rindex = rindex;
      this.confirmPay(0);
    },
    //查看发票
    viewInvoice(orderId) {
      apiInvoice.GetInvoice(orderId).then((res) => {
        if (res.code == 200 && res.returnStatus == 1) {
          this.invoiceData = res.result;
          if (this.invoiceData.statusId == -1) {
            this.invoiceData.statusName = "已取消";
          } else if (this.invoiceData.statusId == 0) {
            this.invoiceData.statusName = "申请中";
          } else {
            this.invoiceData.statusName = "已开票";
          }
          this.invoiceData.invoiceTypeName =
            this.invoiceData.invoiceType == 1
              ? "增值税普通发票"
              : "增值税专用发票";
          this.invoiceData.titleTypeName =
            this.invoiceData.titleType == 0 ? "个人" : "单位";
          this.invoiceData.contentTypeName =
            this.invoiceData.contentType == 0 ? "商品明细" : "商品类别";
        }
      });
      this.dialoginvoice = true;
    },
    //开始上传
    handleImageBefore(file) {
      this.fileName = file.name; //记录文件名称
      //如果需要控制格式及文件尺寸在此进行
    },
    //请求上传
    requestImgUpload(params) {
      const file = params.file;
      // 根据后台需求数据格式
      const form = new FormData();
      // 文件对象
      form.append("file", file);
      upload
        .UploadFiles(form)
        .then((res) => {
          const { result } = res;
          this.invoiceData.invoiceUrl = result.diclist[this.fileName];
        })
        .catch((error) => {
          console.log("文件上传error:", error);
        });
    },
    //确认已开票
    finishInvoice() {
      let text = !this.invoiceData.invoiceUrl ? "您没有上传发票，" : "";
      this.$confirm(`${text}要确认已开票吗？`, "询问", {
        cancelButtonText: "取消",
        confirmButtonText: "确定",
      })
        .then((r) => {
          this.invoiceData.drawer = this.userName;
          apiInvoice
            .MakeInvoice(
              this.invoiceData.id,
              this.userName,
              this.invoiceData.invoiceUrl
            )
            .then((res) => {
              if (res.code == 200 && res.returnStatus == 1) {
                this.$message.success("成功完成已开票设定!");
                this.dialoginvoice = false;
              } else {
                this.$message.error(res.msg);
              }
            });
        })
        .catch((e) => {
          return false;
        });
    },
  },
  created() {
    this.loadData();
  },
  computed: {
    ...mapGetters(["userName"]),
  },
};
</script>

<style lang="less" scoped>
.container {
  margin: 18px;
}
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
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
© 2021 GitHub, Inc.
Terms
Privacy
Security
Status
Docs
Contact GitHub
Pricing
API
Training
Blog
About
