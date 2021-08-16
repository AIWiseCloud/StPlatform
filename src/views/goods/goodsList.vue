<template>
  <div class="container">
    <el-card>
      <el-row :gutter="10">
        <el-col :span="8">
          <el-input
            v-model="queryInfo.queryValue"
            placeholder="请输入内容"
            clearable
            @keyup.enter.native="searchGoods"
            ><el-button
              slot="append"
              icon="el-icon-search"
              style="
                background: rgb(24, 144, 255);
                color: white;
                border: 1px solid rgb(24, 144, 255);
              "
              @click="searchGoods"
          /></el-input>
        </el-col>
      </el-row>
      <!-- 商品列表 -->
      <el-table
        v-infinite-scroll="loadData"
        class="goodslist"
        :data="goodsList"
        style="width: 100%; overflow: auto"
        border
        stripe
        empty-text="暂无数据"
        size="mini"
        :header-cell-style="{ 'text-align': 'center', background: '#F3F4F7' }"
      >
        <el-table-column type="index" label="#" />
        <el-table-column label="商品ID" width="140" prop="goodsId" />
        <el-table-column label="商品名称" width="120" prop="goodsName" />
        <el-table-column label="销售单位" width="100" prop="unitName" />
        <el-table-column label="商品描述" prop="goodsDesc" />
        <el-table-column label="销量" prop="salesTimes" width="60" />
        <el-table-column label="推荐商品" width="80"
          ><template slot-scope="scope"
            ><el-switch
              v-model="scope.row.isRecommend"
              active-color="rgb(55,55,55)"
              :active-value="1"
              :inactive-value="0"
              disabled /></template
        ></el-table-column>
        <el-table-column label="最新商品" width="80"
          ><template slot-scope="scope">
            <el-switch
              v-model="scope.row.isNew"
              active-color="rgb(55,55,55)"
              :active-value="1"
              :inactive-value="0"
              disabled
          /></template>
        </el-table-column>
        <el-table-column label="是否下架" prop="isUnder" width="80"
          ><template slot-scope="scope"
            ><el-switch
              v-model="scope.row.isUnder"
              active-color="rgb(55,55,55)"
              :active-value="1"
              :inactive-value="0"
              disabled /></template
        ></el-table-column>
        <el-table-column label="操作" width="120">
          <template slot="header">
            <el-button
              type="primary"
              size="mini"
              icon="el-icon-plus"
              @click="goGoodsInfo($common.getDigitSerial(), 1)"
              >添加</el-button
            >
          </template>
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="primary"
              icon="el-icon-edit"
              round
              @click="goGoodsInfo(scope.row.goodsId, 0)"
            />
            <el-button
              size="mini"
              type="danger"
              icon="el-icon-delete"
              round
              @click="deleteGoodsInfo(scope.row.goodsId, scope.$index)"
            />
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        background
        layout="prev, pager, next"
        :total="queryInfo.totalCount"
        :current-page="queryInfo.pageModel.pageNo"
        @current-change="loadData"
      >
      </el-pagination>
    </el-card>
  </div>
</template>

<script>
import apiGoods from "@/api/goods";
export default {
  name: "Goodslist",
  data() {
    return {
      queryInfo: {
        queryScheme: 0, //0表示按关键字搜索
        hideUnderGoods: 0, //不隐藏下架商品
        queryValue: "", //查询值
        pageModel: {
          pageNo: 1,
          pageSize: 20,
          orderField: "",
          orderWay: "",
        },
        totalCount: 0,
      },
      goodsList: [],
    };
  },
  methods: {
    goGoodsInfo(id, isnew) {
      this.$router.push({
        name: "goodsInfo",
        params: { goodsId: id, isNew: isnew },
      });
    },
    // 分页加载数据
    loadData() {
      apiGoods.QueryGoods(this.queryInfo).then((res) => {
        if (res.code == 200 && res.returnStatus == 1) {
          const { items } = res.result;
          this.queryInfo.totalCount = res.result.totalCount;
          this.goodsList = items;
        } else {
          this.$message.error(JSON.stringify(res.msg));
        }
      });
    },
    // 商品搜索
    searchGoods() {
      // 初始化搜索
      this.queryInfo.pageModel.pageNo = 1;
      this.queryInfo.pageModel.pageSize = 20;
      this.queryInfo.totalCount = 0;
      this.goodsList = [];
      this.loadData();
    },
    // 删除记录(连同附表)
    deleteGoodsInfo(goodsId, index) {
      this.$confirm("确定要删除吗？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
      }).then((r) => {
        apiGoods.DeleteGoodsInfo(goodsId).then((res) => {
          if (res.code == 200 && res.returnStatus == 1) {
            this.goodsList.splice(index, 1);
          } else {
            this.$message.error(JSON.stringify(res.msg));
          }
        });
      });
    },
  },
};
</script>

<style lang="less" scoped>
.container {
  margin: 10px;
}
.goodslist {
  margin-top: 10px;
}
</style>
