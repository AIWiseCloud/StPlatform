<template>
  <div class="container">
    <el-collapse v-model="activename">
      <el-collapse-item name="0">
        <template slot="title"
          ><span>查询条件<i class="el-icon-search" style="color: red"></i></span
        ></template>
        <el-form :model="searchModel" size="mini" label-width="92px">
          <el-row>
            <el-col :sm="24" :md="8" :lg="6" :xl="6">
              <el-form-item label="关键字" prop="keywords">
                <el-input
                  v-model="searchModel.keywords"
                  clearable
                  placeholder="请输入要查询的关键字"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :sm="24" :md="8" :lg="6" :xl="6">
              <el-form-item label="开始日期" prop="startDate">
                <el-date-picker
                  v-model="searchModel.startDate"
                  format="yyyy-MM-dd HH:mm:ss"
                  placeholder="开始日期"
                ></el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :sm="24" :md="8" :lg="6" :xl="6">
              <el-form-item label="截止日期" prop="endDate">
                <el-date-picker
                  v-model="searchModel.endDate"
                  format="yyyy-MM-dd HH:mm:ss"
                  placeholder="截止日期"
                ></el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :sm="24" :md="8" :lg="6" :xl="6">
              <el-form-item>
                <el-button type="primary" icon="el-icon-search" @click="searchData"
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
        :data="certifications"
        border
        empty-text="无数据"
        size="mini"
        :header-cell-style="{
          'text-align': 'center',
          'background-color': '#F3F4F7',
        }"
      >
        <el-table-column
          label="名称"
          prop="name"
          width="120"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column
          label="手机号"
          prop="phoneNumber"
          width="100"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column label="审核状态" prop="authState" width="70">
          <template scope="scope">
            <el-switch
              v-model="scope.row.authState"
              active-color="rgb(55,55,55)"
              :active-value="1"
              :inactive-value="0"
              disabled
            ></el-switch>
          </template>
        </el-table-column>
        <el-table-column
          label="证件号码"
          prop="certificateId"
          width="100"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column label="正面" prop="certificateFront" width="60">
          <template slot-scope="scope">
            <el-popover
              v-if="scope.row.certificateFront"
              placement="right"
              ref="popover"
              trigger="hover"
            >
              <el-image
                :src="$common.getBaseURL() + scope.row.certificateFront"
                style="width: 500px; height: 500px"
                fit="scale-down"
              ></el-image>
              <el-image
                :src="$common.getBaseURL() + scope.row.certificateFront"
                style="width: 40px; height: 40px"
                slot="reference"
              ></el-image>
            </el-popover> </template
        ></el-table-column>
        <el-table-column label="背面" prop="certificateBack" width="60">
          <template slot-scope="scope">
            <el-popover
              v-if="scope.row.certificateBack"
              placement="right"
              ref="popover"
              trigger="hover"
            >
              <el-image
                :src="$common.getBaseURL() + scope.row.certificateBack"
                style="width: 500px; height: 500px"
                fit="scale-down"
              ></el-image>
              <el-image
                :src="$common.getBaseURL() + scope.row.certificateBack"
                style="width: 40px; height: 40px"
                slot="reference"
              ></el-image>
            </el-popover> </template
        ></el-table-column>
        <el-table-column label="公司名称" prop="corpName"></el-table-column>
        <el-table-column
          label="公司地址"
          prop="corpAddress"
          width="120"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column
          label="销客ID"
          prop="openUserId"
          width="60"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column
          label="业务员"
          prop="salesMan"
          width="80"
        ></el-table-column>
        <el-table-column label="认证日期" prop="createDate" width="90">
          <template scope="scope">
            <span>{{ scope.row.createDate.substr(0, 10) }}</span>
          </template></el-table-column
        >
        <el-table-column label="操作" width="80">
          <template scope="scope">
            <el-button
              v-if="scope.row.authState == 0"
              type="primary"
              plain
              size="mini"
              @click="auditCertification(scope.$index, scope.row, 1)"
              >审核</el-button
            >
            <el-button
              v-if="scope.row.authState == 1"
              type="danger"
              plain
              size="mini"
              @click="auditCertification(scope.$index, scope.row, 0)"
              >反审</el-button
            >
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
  namd: "certification",
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
        startDate: "",
        endDate: "",
        certificateType: -1,
      },
      certifications: [],
    };
  },
  methods: {
    loadData() {
      apiUser.QueryCertification(this.searchModel).then((res) => {
        if (res.code == 200 && res.returnStatus == 1) {
          const { totalCount, items } = res.result;
          this.totalCount = totalCount;
          this.certifications = items;
        }
      });
    },
    searchData() {
      this.searchModel.pageModel.pageNo = 1;
      this.totalCount = 0;
      this.certifications = [];
      this.loadData();
    },
    //审核
    auditCertification(index, row, authState) {
      apiUser
        .AuditCertificationInfo(row.unionId, row.certificateType, authState, "")
        .then((res) => {
          if (res.code == 200 && res.returnStatus == 1) {
            row.authState = authState;
            this.$set(this.certifications, index, row);
            this.$message.success("操作成功");
          } else {
            this.$message.error(res.msg);
          }
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
