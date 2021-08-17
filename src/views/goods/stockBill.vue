<template>
  <div class="container">
    <!-- 查询条件 -->
    <el-collapse v-model="activename">
      <el-collapse-item name="1">
        <template slot="title">
          <span>查询条件<i class="el-icon-search" style="color: red"></i></span>
        </template>
        <el-form
          size="mini"
          :model="searchModel"
          label-position="right"
          label-width="92px"
        >
          <el-row>
            <el-col :sm="12" :md="6" :lg="6">
              <el-form-item label="交易单号">
                <el-input
                  v-model="searchModel.billId"
                  size="mini"
                  placeholder="输入出入库交易单号"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :sm="12" :md="6" :lg="6">
              <el-form-item label="商品名称">
                <el-input
                  v-model="searchModel.goodsName"
                  size="mini"
                  placeholder="输入商品名称"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :sm="12" :md="6" :lg="6">
              <el-form-item label="交易类型">
                <el-select
                  v-model="searchModel.transTypeId"
                  size="mini"
                  placeholder="选择交易类型"
                  ><el-option
                    v-for="item in transTypes"
                    :key="item.fNumber"
                    :label="item.fName"
                    :value="item.fNumber"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :sm="12" :md="6" :lg="6">
              <el-button
                size="mini"
                type="primary"
                plain
                icon="el-icon-search"
                @click="searchBill"
                >查询</el-button
              >
            </el-col>
          </el-row>
        </el-form>
      </el-collapse-item>
    </el-collapse>
    <!-- 数据列表 -->
    <el-table
      :data="billlistData"
      border
      size="mini"
      empty-text="暂无数据"
      style="width: 100%; margin-top: 10px"
      :header-cell-style="{
        'text-align': 'center',
        'background-color': '#F3F4F7',
      }"
    >
      <el-table-column type="index" label="#"></el-table-column>
      <el-table-column
        label="交易单号"
        prop="billId"
        width="130"
      ></el-table-column>
      <el-table-column label="交易类型" prop="transTypeName" width="80">
      </el-table-column>
      <el-table-column
        label="订单号"
        prop="orderId"
        width="120"
      ></el-table-column>
      <el-table-column
        label="状态"
        prop="billStateName"
        width="60"
      ></el-table-column>
      <el-table-column label="商品名称" prop="goodsName"></el-table-column>
      <el-table-column label="颜色" prop="colorName"></el-table-column>
      <el-table-column label="规格" prop="specName"></el-table-column>
      <el-table-column
        label="仓库"
        prop="stockName"
        width="90"
      ></el-table-column>
      <el-table-column
        label="单位"
        prop="unitName"
        width="80"
      ></el-table-column>
      <el-table-column
        label="数量"
        prop="quantity"
        width="80"
      ></el-table-column>
      <el-table-column
        label="创建日期"
        prop="createDate"
        width="100"
      ></el-table-column>
      <el-table-column label="操作" width="80">
        <template slot="header">
          <el-button
            size="mini"
            type="success"
            plain
            icon="el-icon-plus"
            @click="goDetailPage(true, '')"
            >新增</el-button
          >
        </template>
        <template scope="scope">
          <el-button
            type="primary"
            size="mini"
            @click="goDetailPage(false, scope.row.billId)"
            >编辑</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      background
      layout="total, prev, pager, next"
      :total="totalCount"
      :current-page.sync="searchModel.pageModel.pageNo"
      :page-size="searchModel.pageModel.pageSize"
      @current-change="loadData"
    >
    </el-pagination>
  </div>
</template>

<script>
import apiInventory from "@/api/inventory";
import apiSettings from "@/api/settings";
export default {
  name: "stockBill",
  data() {
    return {
      activename: "1",
      visibleBill: false, //显示单据对话框
      transTypes: [],
      totalCount: 0,
      //查询请求参数实体
      searchModel: {
        billId: "",
        goodsName: "",
        transTypeId: "",
        pageModel: {
          pageNo: 1,
          pageSize: 20,
          orderField: "",
          orderWay: "",
        },
      },
      //数据列表(主对象包括子对象的形式，以子项数作为记录数)
      billlistData: [],
    };
  },
  methods: {
    //转到添加/修改页
    goDetailPage(isnew, billid) {
      this.$router.push({
        name: "stockBillDetail",
        params: {
          isNew: isnew,
          billId: isnew ? "W" + this.$common.getDigitSerial() : billid,
        },
      });
    },
    //单据状态
    getBillState(stateId) {
      switch (Number.parseInt(stateId)) {
        case 0:
          return "待审";
        case 1:
          return "已审";
        case -1:
          return "作废";
        default:
          return "";
      }
    },
    //分页读取数据
    loadData() {
      apiInventory.SearchStockBill(this.searchModel).then((res) => {
        if (res.code == 200 && res.returnStatus == 1) {
          const { totalCount, items } = res.result;
          this.totalCount = totalCount;
          this.billlistData = [];
          for (let bill of items) {
            for (let i of bill.stockBillDetail) {
              let row = {
                billId: bill.billId,
                orderId: bill.orderId,
                billStateName: this.getBillState(bill.billState),
                transTypeName: bill.transType.transTypeName,
                goodsName: i.goodsInfo.goodsName,
                colorName: i.colorInfo.colorName,
                specName: i.spec.specName,
                unitName: i.goodsInfo.unitName,
                stockName: i.stock.stockName,
                quantity: i.quantity,
                remark: bill.remark,
                createDate: bill.createDate.substring(0, 10),
              };
              this.billlistData.push(row);
            }
          }
        }
      });
    },
    //查询
    searchBill() {
      this.searchModel.pageModel.pageNo = 1;
      this.loadData();
    },
  },
  created() {
    //交易类型
    apiSettings.GetSubMessageList("transtype").then((res) => {
      if (res.code == 200 && res.returnStatus == 1) {
        this.transTypes = res.result;
      }
    });
    this.searchBill();
  },
};
</script>

<style lang='less' scoped>
.container {
  margin: 15px;
}
</style>