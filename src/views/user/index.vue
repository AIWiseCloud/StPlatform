<template>
  <div class="container">
    <el-collapse v-model="activeindex">
      <el-collapse-item name="0">
        <template slot="title">
          <span>查询条件<i class="el-icon-search" style="color: red"></i></span>
        </template>
        <el-form :model="searchModel" label-width="92px" size="mini">
          <el-row>
            <el-col :sm="24" :md="8" :lg="6" :xl="6">
              <el-form-item label="关键字">
                <el-input
                  v-model="searchModel.keywords"
                  placeholder="请输入关键字后点查询"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :sm="24" :md="8" :lg="6" :xl="6">
              <el-form-item label="开始时间">
                <el-date-picker
                  v-model="searchModel.startDate"
                  type="datetime"
                  value-format="yyyy-MM-dd HH:mm:ss"
                  placeholder="选择开始日期时间"
                />
              </el-form-item>
            </el-col>
            <el-col :sm="24" :md="8" :lg="6" :xl="6">
              <el-form-item label="结束时间">
                <el-date-picker
                  v-model="searchModel.endDate"
                  type="datetime"
                  value-format="yyyy-MM-dd HH:mm:ss"
                  placeholder="选择截止日期时间"
                />
              </el-form-item>
            </el-col>
            <el-col :sm="24" :md="8" :lg="6" :xl="6">
              <el-form-item>
                <el-button
                  type="primary"
                  icon="el-icon-search"
                  size="small"
                  @click="searchData"
                  >查询</el-button
                >
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </el-collapse-item>
    </el-collapse>
    <el-card>
      <el-table
        :data="userList"
        border
        empty-text="无数据"
        :header-cell-style="{
          'background-color': '#F3F4F7',
          'text-align': 'center',
        }"
        size="small"
      >
        <el-table-column label="头像" prop="avatar" width="60" align="center">
          <template slot-scope="scope">
            <el-popover
              v-if="scope.row.avatar"
              placement="top"
              ref="popover"
              trigger="hover"
            >
              <el-image
                :src="scope.row.avatar"
                style="width: 150px; height: 150px"
                fit="scale-down"
              ></el-image>
              <el-image
                :src="scope.row.avatar"
                style="width: 40px; height: 40px"
                slot="reference"
              ></el-image>
            </el-popover>
          </template>
        </el-table-column>
        <el-table-column
          label="用户标识"
          prop="unionId"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column label="用户名" prop="userName" align="center"></el-table-column>
        <el-table-column label="昵称" prop="nickName"></el-table-column>
        <el-table-column label="手机号" prop="phoneNumber"></el-table-column>
        <el-table-column
          label="省"
          prop="province"
          align="center"
          width="60"
        ></el-table-column>
        <el-table-column
          label="市"
          prop="city"
          width="60"
          align="center"
        ></el-table-column>
        <el-table-column
          label="区/县"
          prop="county"
          align="center"
          width="60"
        ></el-table-column>
        <el-table-column label="性别" prop="gender" width="60" align="center">
          <template scope="scope">
            <span>{{ scope.row.gender == 1 ? "男" : "女" }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="状态"
          prop="userState"
          width="60"
          align="center"
        >
        </el-table-column>
        <el-table-column label="角色" prop="roles"></el-table-column>
        <el-table-column
          label="日期"
          prop="createDate"
          width="110"
          align="center"
        >
          <template scope="scope">
            <span>{{ scope.row.createDate.substr(0, 10) }}</span>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <el-pagination
      v-if="totalCount > 0"
      :current-page.sync="searchModel.pageModel.pageNo"
      :page-size="searchModel.pageModel.pageSize"
      layout="total,prev,pager,next"
      :total="totalCount"
      @current-change="loadData"
    />
  </div>
</template>

<script>
import apiUser from "@/api/user";
export default {
  data() {
    return {
      activeindex: "0",
      totalCount: 0,
      searchModel: {
        keywords: "",
        startDate: "",
        endDate: "",
        pageModel: {
          pageNo: 1,
          pageSize: 10,
          orderField: "",
          orderWay: "",
        },
      },
      userList: [],
    };
  },
  methods: {
    loadData() {
      apiUser.QueryUsers(this.searchModel).then((res) => {
        if (res.code == 200 && res.returnStatus == 1) {
          const { totalCount, items } = res.result;
          this.totalCount = totalCount;
          this.userList = items;
        }
      });
    },
    searchData() {
      this.userList = [];
      this.searchModel.pageModel.pageNo = 1;
      this.loadData();
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
