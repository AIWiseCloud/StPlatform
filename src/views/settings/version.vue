<template>
  <div class="container">
    <el-collapse v-model="activename">
      <el-collapse-item name="0">
        <template slot="title">
          <span>查询条件</span
          ><i class="el-icon-search" style="color: red; margin-left: 6px"></i>
        </template>
        <el-form :model="searchModel" label-width="92px" size="small">
          <el-row :gutter="10">
            <el-col :sm="18" :md="24" :lg="12" :xl="12">
              <el-form-item label-width="关键字">
                <el-input
                  v-model="searchModel.keywords"
                  clear
                  placeholder="请输入要查询的关键字"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :sm="6" :md="12" :lg="12" :xl="12">
              <el-button
                type="primary"
                icon="el-icon-search"
                size="small"
                @click="searchData"
                >查询</el-button
              >
            </el-col>
          </el-row>
        </el-form>
      </el-collapse-item>
    </el-collapse>
    <el-card>
      <el-table
        :data="versionList"
        border
        empty-text="暂无数据"
        size="small"
        :header-cell-style="{
          'text-align': 'center',
          'background-color': '#F3F4F7',
        }"
      >
        <el-table-column label="#" type="index"></el-table-column>
        <el-table-column
          label="版本号"
          prop="versionId"
          width="160"
        ></el-table-column>
        <el-table-column
          label="App包文件"
          prop="packageUrl"
          width="360"
        ></el-table-column>
        <el-table-column label="版本说明" prop="fNote"></el-table-column>
        <el-table-column
          label="发布人"
          prop="creator"
          width="100"
        ></el-table-column>
        <el-table-column
          label="发布日期"
          prop="createDate"
          width="160"
        ></el-table-column>
        <el-table-column width="160">
          <template slot="header">
            <el-button
              type="primary"
              plain
              icon="el-icon-plus"
              size="mini"
              @click="openDialog"
              >添加版本</el-button
            >
          </template>
          <template slot-scope="scope">
            <el-button
              plain
              icon="el-icon-delete"
              size="mini"
              @click="deleteVersion(scope.$index, scope.row)"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页组件 -->
      <el-pagination
        @current-change="loadData"
        :current-page.sync="searchModel.pageModel.pageNo"
        :page-size="searchModel.pageModel.pageSize"
        layout="total,prev,pager,next"
        :total="totalCount"
      ></el-pagination>
    </el-card>
    <!-- 新增对话框 -->
    <el-dialog
      title="添加版本记录"
      v-model="versionItem"
      :visible.sync="visibleDialog"
      @close="closeDialogSource"
    >
      <el-form
        :model="versionItem"
        :rules="rules"
        ref="versionform"
        size="mini"
        label-width="92px"
        label-position="right"
      >
        <el-row>
          <el-col :sm="24" :md="12" :lg="12" :xl="12">
            <el-form-item label="版本号" prop="versionId">
              <el-input
                v-model="versionItem.versionId"
                placeholder="输入版本号"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :sm="24" :md="12" :lg="12" :xl="12">
            <el-form-item label="发布人" prop="creator">
              <el-input
                v-model="versionItem.creator"
                placeholder="发布人"
                disabled
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :sm="24" :md="12" :lg="12" :xl="12">
            <el-form-item label="包文件" prop="packageUrl">
              <el-upload
                class="avatar-uploader"
                :show-file-list="false"
                action
                :before-upload="handleUploadBefore"
                :http-request="(params) => requestFileUpload(params)"
              >
                <div v-if="versionItem.packageUrl" class="avatar">
                  {{ versionItem.packageUrl }}
                </div>
                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
              </el-upload>
            </el-form-item>
          </el-col>
          <el-col :sm="24" :md="12" :lg="12" :xl="12">
            <el-form-item label="版本说明" prop="fNote">
              <el-input
                type="textarea"
                :rows="9"
                v-model="versionItem.fNote"
                placeholder="输入版本说明"
                maxlength="200"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" size="mini" @click="submitVersion"
          >确定</el-button
        >
        <el-button type="danger" size="mini" @click="visibleDialog = false"
          >取消</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>

<script>
import apiVersion from "@/api/version";
import { mapGetters } from "vuex";
export default {
  name: "version",
  data() {
    return {
      visibleDialog: false,
      fileName: "",
      activename: "0",
      totalCount: 0,
      searchModel: {
        keywords: "",
        pageModel: {
          pageNo: 1,
          pageSize: 20,
          orderField: "",
          orderWay: "",
        },
      },
      versionList: [],
      versionItem: {
        varsionId: "",
        packageUrl: "",
        fNote: "",
        creator: this.userName,
      },
      rules: {
        versionId: {
          required: true,
          message: "版本号不能为空",
          trigger: "blur",
        },
        packageUrl: {
          required: true,
          message: "请上传包文件",
          trigger: "blur",
        },
        fNote: { required: true, message: "请填写版本说明", trigger: "blur" },
      },
    };
  },
  methods: {
    //删除版本记录
    deleteVersion(index, row) {
      this.$confirm("确定要删除吗？", "询问", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
      }).then((r) => {
        apiVersion.DeleteVersonManagement(row.versionId).then((res) => {
          if (res.code == 200 && res.returnStatus == 1) {
            this.versionList.splice(index, 1);
            this.$message.success("删除成功");
          } else {
            return this.$message.error(res.msg);
          }
        });
      });
    },
    //分页加载数据
    loadData() {
      apiVersion.QueryVersionManagement(this.searchModel).then((res) => {
        if (res.code == 200 && res.returnStatus == 1) {
          const { totalCount, items } = res.result;
          this.totalCount = totalCount;
          this.versionList = items;
        } else {
          return this.$message.error(res.msg);
        }
      });
    },
    //查询
    searchData() {
      this.searchModel.pageModel.pageNo = 1;
      this.totalCount = 0;
      this.loadData();
    },
    //打开添加对话框
    openDialog() {
      this.visibleDialog = true;
      this.versionItem.creator = this.userName;
    },
    //保存版本管理
    submitVersion() {
      this.$refs.versionform.validate((valid) => {
        if (valid) {
          apiVersion.SaveVersion(this.versionItem).then((res) => {
            if (res.code == 200 && res.returnStatus == 1) {
              this.visibleDialog = false;
              this.loadData();
            } else {
              this.$message.error(res.msg);
            }
          });
        } else {
          return false;
        }
      });
    },
    //对话框关闭时
    closeDialogSource() {
      this.versionItem.versionId = "";
      this.versionItem.packageUrl = "";
      this.versionItem.fNote = "";
      this.versionItem.creator = "";
    },
    handleUploadBefore(file) {
      this.fileName = file.name; //记录文件名称
      //如果需要控制格式及文件尺寸在此进行
    },
    //请求上传
    requestFileUpload(params) {
      const file = params.file;
      // 根据后台需求数据格式
      const form = new FormData();
      // 文件对象
      form.append("file", file);
      apiVersion
        .UploadAppPackage(form)
        .then((res) => {
          if (res.code == 200 && res.returnStatus == 1) {
            const { result } = res;
            this.versionItem.packageUrl = result.diclist[this.fileName];
          } else {
            this.$message.error(res.msg);
          }
        })
        .catch((error) => {
          console.log("文件上传error:", error);
        });
    },
  },
  created() {
    this.searchData();
  },
  computed: {
    ...mapGetters(["userName"]),
  },
};
</script>

<style lang="less" scoped>
.container {
  margin: 10px;
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
  border: 1px solid silver;
}
.avatar {
  width: 178px;
  height: 178px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid silver;
}
</style>