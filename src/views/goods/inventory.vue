<template>
  <div class="container">
    <el-collapse v-model="activename">
      <el-collapse-item name="0">
        <template slot="title">
          <span>查询条件<i class="el-icon-search" style="color: red"></i></span>
        </template>
        <el-form
          :model="searchModel"
          label-position="right"
          label-width="92px"
          size="mini"
        >
          <el-row :gutter="10">
            <el-col :sm="12" :md="6" :lg="6">
              <el-form-item label="商品分类">
                <el-cascader
                  ref="goodscate"
                  :options="goodsCategories"
                  :show-all-levels="false"
                  v-model="searchModel.categoryId"
                  multipe="false"
                  :props="{
                    label: 'categoryName',
                    value: 'categoryId',
                    checkStrictly: 'false',
                  }"
                  size="mini"
                  placeholder="选择商品分类"
                  @change="changeCategory"
                ></el-cascader>
              </el-form-item>
            </el-col>
            <el-col :sm="12" :md="6" :lg="6">
              <el-form-item label="商品名称">
                <el-input
                  clear
                  v-model="searchModel.goodsName"
                  placeholder="输入商品名称"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :sm="12" :md="6" :lg="6">
              <el-form-item label="销售状态">
                <el-select v-model="searchModel.goodsState">
                  <el-option
                    v-for="(item, i) in salesStates"
                    :key="i"
                    :label="item.text"
                    :value="item.goodsState"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :sm="12" :md="6" :lg="6">
              <el-button
                type="success"
                plain
                size="mini"
                icon="el-icon-search"
                @click="searchData"
                >查询</el-button
              >
            </el-col>
          </el-row>
        </el-form>
      </el-collapse-item>
    </el-collapse>
    <el-table
      :data="inventoryData"
      border
      size="mini"
      :header-cell-style="{
        'text-align': 'center',
        'background-color': '#F3F4F7',
      }"
      empty-text="暂无数据"
    >
      <el-table-column label="#" type="index"> </el-table-column>
      <el-table-column label="商品ID" prop="goodsId"></el-table-column>
      <el-table-column label="商品名称" prop="goodsName"></el-table-column>
      <el-table-column label="销售单位" prop="unitName"></el-table-column>
      <el-table-column label="颜色" prop="colorName"></el-table-column>
      <el-table-column label="规格" prop="specName"></el-table-column>
      <el-table-column label="库存数量" prop="quantity"></el-table-column>
      <el-table-column label="锁定数量" prop="lockQuantity"></el-table-column>
      <el-table-column label="可用库存" prop="activeQuantity"></el-table-column>
      <el-table-column label="推荐">
        <template slot-scope="scope"
          ><el-checkbox v-model="scope.row.isRecommend" disabled></el-checkbox
        ></template>
      </el-table-column>
      <el-table-column label="最新">
        <template slot-scope="scope"
          ><el-checkbox v-model="scope.row.isNew" disabled></el-checkbox
        ></template>
      </el-table-column>
      <el-table-column label="下架">
        <template slot-scope="scope">
          <el-checkbox v-model="scope.row.isUnder" disabled></el-checkbox>
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
import apiGoods from "@/api/goods";
export default {
  name: "inventory",
  data() {
    return {
      activename: "0",
      totalCount: 0,

      searchModel: {
        categoryId: "",
        goodsState: 0,
        goodsName: "",
        pageModel: {
          pageNo: 1,
          pageSize: 20,
          orderField: "",
          orderWay: "",
        },
      },
      salesStates: [
        { goodsState: 0, text: "全部状态" },
        { goodsState: 1, text: "售卖中" },
        { goodsState: 2, text: "已下架" },
      ],
      //所有商品分类(用于商品选择)
      goodsCategories: [],
      inventoryData: [],
    };
  },
  methods: {
    //选择商品分类
    changeCategory(selarr) {
      if (selarr.length) {
        this.searchModel.categoryId = selarr[selarr.length - 1];
        this.$refs.goodscate.dropDownVisible = false; //关闭选择框
      }
    },
    //分页载入数据
    loadData() {
      apiInventory.SearchInventories(this.searchModel).then((res) => {
        if (res.code == 200 && res.returnStatus == 1) {
          const { totalCount, items } = res.result;
          this.totalCount = totalCount;
          this.inventoryData = items.map((x) => {
            return {
              goodsId: x.goodsId,
              goodsName: x.goodsInfo.goodsName,
              unitName: x.goodsInfo.unitName,
              isUnder: x.goodsInfo.isUnder == 1,
              isRecommend: x.goodsInfo.isRecommend == 1,
              isNew: x.goodsInfo.isNew == 1,
              colorName: x.colorInfo.colorName,
              specName: x.specInfo.specName,
              quantity: x.quantity,
              lockQuantity: x.lockQuantity,
              transitQuantity: x.transitQuantity,
              activeQuantity: x.activeQuantity,
            };
          });
        }
      });
    },
    //执行查询
    searchData() {
      this.searchModel.pageModel.pageNo = 1;
      this.totalCount = 0;
      this.inventoryData = [];
      this.loadData();
    },
  },
  created() {
    //商品分类
    apiGoods.GetGoodsCategories("*").then((res) => {
      if (res.code == 200 && res.returnStatus == 1) {
        this.goodsCategories = res.result;
      }
    });
  },
};
</script>

<style lang="less" scoped>
.container {
  margin: 10px;
}
</style>
