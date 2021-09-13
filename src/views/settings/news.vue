<template>
  <div class="container">
    <el-collapse v-model="activename">
      <el-collapse-item name="0">
        <template slot="title">
          <span
            >查询条件<i
              class="el-icon-search"
              style="margin-left: 6px; color: red"
            ></i
          ></span>
        </template>
        <el-form :model="searchModel" label-width="92px" size="small">
          <el-row :gutter="10">
            <el-col :sm="12" :md="12" :lg="12" :xl="12">
              <el-form-item label="关键字">
                <el-input
                  v-model="searchModel.keywords"
                  placeholder="输入要查询的关键字"
                  clear
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :sm="12" :md="12" :lg="12" :xl="12">
              <el-button
                type="primary"
                icon="el-icon-search"
                size="small"
                @click="searchData"
                >查询
              </el-button>
            </el-col>
          </el-row>
        </el-form>
      </el-collapse-item>
    </el-collapse>
    <el-card>
      <el-table
        :data="newsList"
        border
        empty-text="暂无数据"
        :header-cell-style="{
          'text-align': 'center',
          'background-color': '#F3F4F7',
        }"
        size="small"
      >
        <el-table-column label="#" type="index" width="30"></el-table-column>
        <el-table-column label="标题" prop="title"></el-table-column>
        <el-table-column label="封面" width="80">
          <template scope="scope">
            <el-image
              :src="$common.getBaseURL() + scope.row.imgUrl"
              style="width: 60px; height: 60px; display: block"
            ></el-image>
          </template>
        </el-table-column>
        <el-table-column
          label="作者"
          prop="author"
          width="100"
        ></el-table-column>
        <el-table-column
          label="状态"
          prop="statusId"
          width="60"
        ></el-table-column>
        <el-table-column
          label="阅读量"
          prop="amountReading"
          width="60"
        ></el-table-column>
        <el-table-column
          label="点赞数"
          prop="numberLike"
          width="60"
        ></el-table-column>
        <el-table-column
          label="发布日期"
          prop="createDate"
          width="160"
        ></el-table-column>
        <el-table-column width="180">
          <template slot="header">
            <el-button
              type="primary"
              plain
              icon="el-icon-plus"
              size="mini"
              @click="toDetailsPage(1, '')"
              >添加</el-button
            >
          </template>
          <template slot-scope="scope">
            <el-button
              size="mini"
              icon="el-icon-edit"
              @click="toDetailsPage(0, scope.row.newsId)"
              >详情</el-button
            >
            <el-button
              size="mini"
              icon="el-icon-delete"
              @click="deleteNews(scope.row.newsId, scope.$index)"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        v-if="totalCount > 0"
        :current-page.sync="searchModel.pageModel.pageNo"
        @current-change="loadData"
        :page-size="searchModel.pageModel.pageSize"
        layout="total,prev,pager,next"
        :total="totalCount"
      >
      </el-pagination>
    </el-card>
  </div>
</template>

<script>
import apiNews from "@/api/news";
export default {
  name: "news",
  data() {
    return {
      activename: "0",
      totalCount: 0,
      searchModel: {
        keywords: "",
        pageModel: {
          pageNo: 1,
          pageSize: 10,
          orderField: "",
          orderWay: "",
        },
      },
      newsList: [],
    };
  },
  methods: {
    loadData() {
      apiNews.QueryCompanyNews(this.searchModel).then((res) => {
        if (res.code == 200 && res.returnStatus == 1) {
          const { totalCount, items } = res.result;
          this.totalCount = totalCount;
          this.newsList = items;
        } else {
          this.$message.error(res.msg);
        }
      });
    },
    searchData() {
      this.searchModel.pageModel.pageNo = 1;
      this.loadData();
    },
    savenews() {
      console.log(this.msg);
    },
    //前往新增或查看详情
    toDetailsPage(isnew, newsId) {
      if (isnew==1) {
        newsId = this.$common.guid();
      }
      this.$router.push({
        name: "newsDetails",
        params: { isnew: isnew, newsid: newsId },
      });
    },
    //删除
    deleteNews(newsId, index) {
      this.$confirm("确定要删除吗？", "询问", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
      }).then((r) => {
        apiNews.DeleteCompanyNews(newsId).then((res) => {
          if (res.code == 200 && res.returnStatus == 1) {
            this.$message.info("删除成功");
            this.newsList.splice(index, 1);
          } else {
            return this.$message.error(res.msg);
          }
        });
      });
    },
  },
  created() {
    this.searchData();
  },
};
</script>

<style lang="less" scoped>
.container {
  margin: 10px;
}
</style>