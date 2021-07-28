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
          v-model="searchModel"
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
              <el-button size="mini" type="primary" plain icon="el-icon-search"
                >查询</el-button
              >
              <el-button
                size="mini"
                type="success"
                plain
                icon="el-icon-plus"
                @click="goDetailPage(true)"
                >添加</el-button
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
      <el-table-column label="交易单号" prop="billId"></el-table-column>
      <el-table-column label="交易类型" prop="transTypeId"> </el-table-column>
      <el-table-column label="状态" prop="billState"></el-table-column>
      <el-table-column label="备注" prop="remark"></el-table-column>
      <el-table-column label="创建人" prop="creator"></el-table-column>
      <el-table-column label="创建日期" prop="createDate"></el-table-column>
      <el-table-column label="操作">
        <template scope="scope">
          <el-button
            type="primary"
            size="mini"
            @click="goDetailPage(false,scope.row.billId)"
            >编辑</el-button
          >
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import apiGoods from "@/api/goods";
import apiSettings from "@/api/settings";
import common from "@/utils/common";
export default {
  name: "stockBill",
  data() {
    return {
      activename: "1",
      visibleBill: false, //显示单据对话框
      transTypes: [],
      searchModel: {
        billId: "",
        goodsName: "",
        transTypeId: "",
      },
      //数据列表
      billlistData: [
        {
          billId: "A000001",
          goodsName: "我们的跑道材料",
          transTypeId: "243423",
          billState: "2",
          remark: "没有需要备注的",
          creator: "admin",
          createDate: "2021-9-12",
        },
      ],
    };
  },
  methods: {
    //转到添加/修改页
    goDetailPage(isnew, billid) {
      this.$router.push({
        name: "stockBillDetail",
        params: { isNew: isnew, billId: isnew?('W'+common.getDigitSerial()): billid },
      });
    },
  },
  created() {
    //交易类型
    apiSettings.GetSubMessageList("transtype").then((res) => {
      if (res.code == 200 && res.returnStatus == 1) {
        this.transTypes = res.result;
      }
    });
  },
};
</script>

<style lang='less' scoped>
.container {
  margin: 15px;
}
</style>