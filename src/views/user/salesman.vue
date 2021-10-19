<template>
  <div class="container">
    <el-collapse v-model="activeindex">
      <el-collapse-item name="0">
        <template slot="title">
          <span
            >用户操作<i
              class="el-icon-search"
              style="color: red; margin-left: 6px"
            ></i
          ></span>
        </template>
        <el-form :model="searchModel" size="mini" label-width="92px">
          <el-row :gutter="10">
            <el-col :sm="12" :md="6" :lg="6" :xl="4">
              <el-form-item label="关键字">
                <el-input
                  v-model="searchModel.keywords"
                  placeholder="请输入关键字"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :sm="12" :md="6" :lg="6" :xl="4">
              <el-form-item label="忽略离职人员" label-width="110px">
                <el-switch v-model="searchModel.ignoreStop"></el-switch>
              </el-form-item>
            </el-col>
            <el-col :sm="12" :md="6" :lg="6" :xl="4">
              <el-button
                type="primary"
                icon="el-icoh-search"
                size="mini"
                @click="searchData"
                >查询</el-button
              >
              <el-button
                type="primary"
                icon="el-icoh-search"
                @click="syncData"
                plain
                size="mini"
                >同步销客业务员</el-button
              >
            </el-col>
          </el-row>
        </el-form>
      </el-collapse-item>
    </el-collapse>
    <!-- 数据列表 -->
    <el-card>
      <el-table
        :data="dataArr"
        size="small"
        border
        empty-text="暂无数据"
        :header-cell-style="{
          'text-align': 'center',
          'background-color': '#F3F4F7',
        }"
        ><el-table-column type="index" label="#" width="70"></el-table-column>
        <el-table-column label="ID" prop="openUserId"></el-table-column>
        <el-table-column
          label="姓名"
          prop="name"
          width="120"
          align="center"
        ></el-table-column>
        <el-table-column
          label="手机号"
          prop="mobile"
          width="160"
          align="center"
        ></el-table-column>
        <el-table-column label="停用" prop="isStop" width="80">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.isStop"
              active-color="rgb(55,55,55)"
              :active-value="1"
              :inactive-value="0"
              disabled
            >
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column label="有头像" width="70">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.hasAvatar"
              active-color="rgb(55,55,55)"
              :active-value="1"
              :inactive-value="0"
              disabled
            ></el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="100">
          <template slot-scope="scope">
            <el-popover
              placement="left"
              title="显示头像"
              trigger="click"
              width="400"
            >
              <el-image
                v-if="scope.row.profileImageUrl"
                :src="scope.row.profileImageUrl"
              ></el-image>
              <span v-else>业务员未上传头像</span>
              <el-button icon="el-icon-edit" size="mini" slot="reference"
                >查看头像</el-button
              >
            </el-popover>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
import apiUser from "@/api/user";
export default {
  name: "salesman",
  data() {
    return {
      activeindex: "0",
      searchModel: {
        keywords: "",
        ignoreStop: true,
      },
      salesmanArr: [],
    };
  },
  methods: {
    //从销客同步
    syncData() {
      let userList = [];
      this.$confirm("确定要从销客同步业务员数据到APP吗？", "询问", {
        cancelButtonText: "取消",
        confirmButtonText: "确定",
      })
        .then((r) => {
          return apiUser.GetEmps();
        })
        .then((res) => {
          if (res.code == 200 && res.returnStatus == 1) {
            for (let i of res.result.userList) {
              if (i.name) {
                userList.push({
                  openUserId: i.openUserId,
                  name: i.name,
                  mobile: i.mobile,
                  profileImageUrl: i.profileImageUrl,
                  isStop: i.isStop ? 1 : 0,
                });
              }
            }
            return apiUser.ImportSalesmen(userList);
          } else {
            // this.$message.error(res.msg);
            Promise.reject(res.msg);
          }
        })
        .then((res) => {
          if (res.code == 200 && res.returnStatus == 1) {
            this.$message.success("成功从销客汇入数据到APP");
            this.salesmanArr = userList;
          } else {
            Promise.reject(res.msg);
          }
        })
        .catch((err) => {
          this.$message.error(err);
        });
    },
    //查询
    searchData() {
      apiUser
        .GetSalesmen(this.searchModel.keywords, this.searchModel.ignoreStop)
        .then((res) => {
          if (res.code == 200 && res.returnStatus == 1) {
            // console.log(JSON.stringify(res));
            this.salesmanArr = res.result;
          } else {
            this.$message.error(res.msg);
          }
        });
    },
  },
  computed: {
    dataArr() {
      return this.salesmanArr.map((x) => {
        return {
          ...x,
          ...{ hasAvatar: x.profileImageUrl ? 1 : 0 },
        };
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
  margin: 12px;
}
</style>