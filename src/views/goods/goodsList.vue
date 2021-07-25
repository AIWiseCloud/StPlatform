<template>
  <div class="container">
    <el-card>
      <el-row :gutter="10">
        <el-col :span="8">
          <el-input
            v-model="queryInfo.keywords"
            placeholder="请输入内容"
            clearable
            @keyup.enter.native="searchGoods"
            ><el-button
              slot="append"
              icon="el-icon-search"
              @click="searchGoods"
              style="
                background: rgb(24, 144, 255);
                color: white;
                border: 1px solid rgb(24, 144, 255);
              "
            ></el-button
          ></el-input>
        </el-col>
      </el-row>
      <!-- 商品列表 -->
      <el-table
        class="goodslist"
        :data="goodsList"
        style="width: 100%; overflow: auto"
        border
        stripe
        v-infinite-scroll="loadData"
        empty-text="暂无数据"
        :header-cell-style="{ 'text-align': 'center', background: '#F3F4F7' }"
      >
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column
          label="商品ID"
          width="140"
          prop="goodsId"
        ></el-table-column>
        <el-table-column
          label="商品名称"
          width="120"
          prop="goodsName"
        ></el-table-column>
        <el-table-column
          label="销售单位"
          width="100"
          prop="unitName"
        ></el-table-column>
        <el-table-column label="商品描述" prop="goodsDesc"></el-table-column>
        <el-table-column
          label="销量"
          prop="salesTimes"
          width="60"
        ></el-table-column>
        <el-table-column label="推荐商品" width="80"
          ><template slot-scope="scope"
            ><el-switch
              v-model="scope.row.isRecommend"
              :active-value="1"
              :inactive-value="0"
              disabled
            ></el-switch></template
        ></el-table-column>
        <el-table-column label="最新商品" width="80"
          ><template slot-scope="scope">
            <el-switch
              v-model="scope.row.isNew"
              :active-value="1"
              :inactive-value="0"
              disabled
            >
            </el-switch
          ></template>
        </el-table-column>
        <el-table-column label="是否下架" prop="isUnder" width="80"
          ><template slot-scope="scope"
            ><el-switch
              v-model="scope.row.isUnder"
              :active-value="1"
              :inactive-value="0"
              disabled
            ></el-switch></template
        ></el-table-column>
        <el-table-column label="操作" width="120">
          <template slot="header">
            <el-button
              type="primary"
              size="mini"
              icon="el-icon-plus"
              @click="goAddGoodsInfo"
              >添加</el-button
            >
          </template>
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="primary"
              icon="el-icon-edit"
              @click="goEditGoodsInfo(scope.row.goodsId)"
            ></el-button>
            <el-button
              size="mini"
              type="danger"
              icon="el-icon-delete"
              @click="deleteGoodsInfo(scope.row.goodsId, scope.$index)"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
import apiGoods from "@/api/goods";
export default {
  name: "goodslist",
  data() {
    return {
      queryInfo: {
        keywords: "",
        totalCount: 0,
        pageNo: 0,
        pageSize: 20,
        isLoad: false, //是否加载过的标记
      },
      goodsList: [],
    };
  },
  methods: {
    goAddGoodsInfo() {
      this.$router.push({ name: "goodsInfo", params: { goodsId: "" } });
    },
    //编辑
    goEditGoodsInfo(goodsId) {
      this.$router.push({ name: "goodsInfo", params: { goodsId: goodsId } });
    },
    //分页加载数据
    loadData() {
      if (this.finishLoad) {
        return this.$message.error("没有更多数据了");
      }
      this.queryInfo.pageNo++;
      apiGoods
        .SearchGoods(
          this.queryInfo.keywords,
          this.queryInfo.pageNo,
          this.queryInfo.pageSize
        )
        .then((res) => {
          if (res.code == 200 && res.returnStatus == 1) {
            const { items } = res.result;
            this.queryInfo.isLoad = true;
            this.queryInfo.totalCount = res.result.totalCount;
            this.goodsList = [...this.goodsList, ...items];
          } else {
            this.$message.error(JSON.stringify(res.msg));
          }
        });
    },
    //商品搜索
    searchGoods() {
      //初始化搜索
      this.queryInfo.pageNo = 0;
      this.queryInfo.pageSize = 20;
      this.queryInfo.totalCount = 0;
      this.queryInfo.isLoad = false;
      this.goodsList = [];
      this.loadData();
    },
    //删除记录(连同附表)
    deleteGoodsInfo(goodsId, index) {
      this.$confirm("确定要删除吗？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
      }).then((r) => {
        apiGoods.DeleteGoodsInfo(goodsId).then((res) => {
          if (res.code == 200 && res.returnStatus == 1) {
            this.goodsList.splice(index,1);
          } else {
            this.$message.error(JSON.stringify(res.msg));
          }
        });
      });
    },
  },
  computed: {
    //分页是否加载完成
    finishLoad() {
      return (
        this.queryInfo.isLoad &&
        this.queryInfo.pageNo * this.queryInfo.pageSize >=
          this.queryInfo.totalCount
      );
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