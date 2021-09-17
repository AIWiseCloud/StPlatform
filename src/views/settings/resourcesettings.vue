<template>
  <div class="container">
    <el-collapse v-model="activename">
      <el-collapse-item name="0">
        <template slot="title">
          <span>查询条件<i class="el-icon-search" style="color: red"></i></span>
        </template>
        <el-form :model="searchModel" label-width="92px" size="small">
          <el-row :gutter="10">
            <el-col :sm="24" :md="12" :lg="12" :xl="12">
              <el-form-item label="关键字">
                <template>
                  <el-input
                    v-model="searchModel.keywords"
                    placeholder="请输入要查询的关键字"
                    clear
                    suffix-icon="el-icon-search"
                  ></el-input>
                </template>
              </el-form-item>
            </el-col>
            <el-col :sm="24" :md="12" :lg="12" :xl="12">
              <el-button
                type="primary"
                plain
                icon="el-icon-search"
                size="mini"
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
        :data="resourceData"
        border
        empty-text="暂无数据"
        size="mini"
        :header-cell-style="{ 'text-align': 'center', background: '#F3F4F7' }"
      >
        <el-table-column
          label="资源ID"
          prop="sourceId"
          width="140"
        ></el-table-column>
        <el-table-column label="图片" prop="imgUrl" width="60">
          <template slot-scope="scope">
            <el-popover
              v-if="scope.row.imgUrl"
              ref="popover"
              placement="top"
              trigger="hover"
            >
              <el-image
                style="width: 300px; height: 300px"
                :src="$common.getBaseURL() + scope.row.imgUrl"
                fit="scale-down"
              />
              <el-image
                slot="reference"
                :src="$common.getBaseURL() + scope.row.imgUrl"
                style="width: 40px; height: 40px"
              />
            </el-popover>
          </template>
        </el-table-column>
        <el-table-column label="主旨" prop="subject"></el-table-column>
        <el-table-column
          label="分组码"
          prop="groupNo"
          width="100"
        ></el-table-column>

        <el-table-column
          label="路由"
          prop="navigator"
          width="200"
        ></el-table-column>
        <el-table-column label="作废" prop="isCancalelation" width="60">
          <template slot-scope="scope">
            <el-switch
              active-color="silver"
              v-model="scope.row.isCancellation"
              active-value="1"
              inactive-value="0"
              disabled
            ></el-switch>
          </template>
        </el-table-column>
        <el-table-column
          label="排序"
          prop="fIndex"
          width="60"
        ></el-table-column>
        <el-table-column width="120">
          <template slot="header">
            <el-button
              type="primary"
              plain
              size="mini"
              icon="el-icon-plus"
              @click="openDialog(1)"
              >添加资源</el-button
            >
          </template>
          <template slot-scope="scope">
            <el-button
              type="primary"
              round
              icon="el-icon-edit"
              size="mini"
              @click="openDialog(0, scope.row.sourceId)"
            ></el-button>
            <el-button
              type="danger"
              round
              icon="el-icon-delete"
              @click="deleteResource(scope.$index, scope.row)"
              size="mini"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页组件 -->
      <div class="block">
        <el-pagination
          @current-change="loadData"
          :current-page.sync="searchModel.pageModel.pageNo"
          :page-size="searchModel.pageModel.pageSize"
          layout="total, prev, pager, next"
          :total="totalCount"
        >
        </el-pagination>
      </div>
      <!-- 对话框 -->
      <el-dialog
        title="编辑资源"
        :visible.sync="visibleDialog"
        @close="closeDialogSource"
      >
        <el-form
          :model="resourceItem"
          ref="sourceform"
          size="mini"
          label-width="92px"
          label-position="right"
          :rules="rules"
        >
          <el-form-item prop="sourceId"></el-form-item>
          <el-row>
            <el-col :sm="12" :md="8" :lg="8" :xl="8">
              <el-form-item label="资源ID" prop="sourceId">
                <el-input v-model="resourceItem.sourceId" disabled></el-input>
              </el-form-item>
            </el-col>
            <el-col :sm="12" :md="8" :lg="8" :xl="8">
              <el-form-item label="分组码" prop="groupNo">
                <!-- <el-input v-model="resourceItem.groupNo"></el-input> -->
                <el-select v-model="resourceItem.groupNo" filterable allow-create placeholder="输入或选择">
                  <el-option
                    v-for="(item, i) in groups"
                    :key="i"
                    :label="item"
                    :value="item"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :sm="12" :md="8" :lg="8" :xl="8">
              <el-form-item label="排序索引" prop="fIndex">
                <el-input v-model="resourceItem.fIndex"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-form-item label="资源主旨" prop="subject">
            <el-input
              v-model="resourceItem.subject"
              placeholder="输入资源主题"
            ></el-input>
          </el-form-item>
          <el-row>
            <el-col :sm="12" :md="8" :lg="8" :xl="8">
              <el-form-item label="图片">
                <el-upload
                  class="avatar-uploader"
                  :show-file-list="false"
                  action
                  :before-upload="handleImageBefore"
                  :http-request="(params) => requestImgUpload(params)"
                >
                  <el-image
                    v-if="resourceItem.imgUrl"
                    class="avatar"
                    :src="$common.getBaseURL() + resourceItem.imgUrl"
                    :onerror="ErrorImg"
                  ></el-image>
                  <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                </el-upload>
              </el-form-item>
            </el-col>

            <el-col :sm="24" :md="16" :lg="16" :xl="16">
              <el-row>
                <el-col :sm="24" :md="24" :lg="24" :xl="24">
                  <el-form-item label="路由" prop="navigator">
                    <el-input
                      v-model="resourceItem.navigator"
                      placeholder="输入跳转的路由"
                    ></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :sm="12" :md="8" :lg="8" :xl="8">
                  <el-form-item label="作废" prop="isCancellation">
                    <el-switch
                      v-model="resourceItem.isCancellation"
                      active-value="1"
                      inactive-value="0"
                    ></el-switch>
                  </el-form-item>
                </el-col>
              </el-row>
            </el-col>
          </el-row>
          <el-form-item label="备注" prop="remark">
            <el-input
              type="textarea"
              :rows="4"
              v-model="resourceItem.remark"
              placeholder="请输入备注"
              maxlength="4000"
            ></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button type="primary" size="mini" @click="submitResource"
            >确定</el-button
          >
          <el-button type="danger" size="mini" @click="visibleDialog = false"
            >取消</el-button
          >
        </div>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
import upload from "@/api/base.js";
import apiSettings from "@/api/settings";
import index from "@/components/BackToTop/index.vue";
export default {
  components: { index },
  name: "resourcesettings",
  data() {
    return {
      activename: "0",
      totalCount: 0,
      resourceData: [], //资源列表
      resourceItem: {
        sourceId: "",
        subject: "",
        groupNo: "",
        imgUrl: "",
        navigator: "",
        remark: "",
        isCancellation: 0,
        fIndex: 100,
      }, //资源项目
      visibleDialog: false,
      searchModel: {
        keywords: "",
        pageModel: {
          pageNo: 1,
          pageSize: 20,
          orderField: "",
          orderWay: "",
        },
      },
      groups: [],
      rules: {
        sourceId: {
          required: true,
          message: "资源ID不能为空",
          trigger: "blur",
        },
        subject: {
          required: true,
          message: "资源主旨不能为空",
          trigger: "blur",
        },
        groupNo: { required: true, message: "分组码不能为空", trigger: "blur" },
      },
      ErrorImg: 'this.src="' + require("@/assets/images/blankimg.png") + '"', //图片错误地址
      fileName: "",
    };
  },
  methods: {
    loadData() {
      apiSettings.QueryResourceSettings(this.searchModel).then((res) => {
        if (res.code == 200 && res.returnStatus == 1) {
          const { totalCount, items } = res.result;
          this.totalCount = totalCount;
          this.resourceData = items;
        } else {
          this.$message.error(JSON.stringify(res.msg));
        }
      });
    },
    searchData() {
      this.searchModel.pageModel.pageNo = 1;
      this.loadData();
    },
    openDialog(isnew, sourceId) {
      this.visibleDialog = true;
      apiSettings.GetGroups().then((res) => {
        if (res.code == 200 && res.returnStatus == 1) {
          this.groups = res.result;
          this.groups = [];
          for (let i of res.result) {
            this.groups.push(i.GroupNo);
          }
        }
      });
      if (isnew) {
        this.resourceItem.sourceId = "S" + this.$common.getDigitSerial();
      } else {
        apiSettings.GetResourceSettings(sourceId).then((res) => {
          if (res.code == 200 && res.returnStatus == 1) {
            this.resourceItem = res.result;
          }
        });
      }
    },
    //提交资源
    submitResource() {
      console.log("提交：", JSON.stringify(this.resourceItem));
      this.$refs["sourceform"].validate((valid) => {
        if (valid) {
          apiSettings.SaveResourceSettings(this.resourceItem).then((res) => {
            if (res.code == 200 && res.returnStatus == 1) {
              this.visibleDialog = false;
              this.loadData();
            } else {
              this.$message.error(JSON.stringify(res.msg));
            }
          });
        } else {
          return false;
        }
      });
    },
    //开始上传
    handleImageBefore(file) {
      this.fileName = file.name; //记录文件名称
      //如果需要控制格式及文件尺寸在此进行
    },
    //请求上传
    requestImgUpload(params) {
      const file = params.file;
      // 根据后台需求数据格式
      const form = new FormData();
      // 文件对象
      form.append("file", file);
      upload
        .UploadFiles(form)
        .then((res) => {
          const { result } = res;
          this.resourceItem.imgUrl = result.diclist[this.fileName];
        })
        .catch((error) => {
          console.log("文件上传error:", error);
        });
    },
    //关闭对话时执行
    closeDialogSource() {
      this.resourceItem.sourceId = "";
      this.resourceItem.subject = "";
      this.resourceItem.groupNo = "";
      this.resourceItem.navigator = "";
      this.resourceItem.imgUrl = "";
      this.resourceItem.remark = "";
      this.resourceItem.isCancellation = 0;
      this.resourceItem.fIndex = 100;
    },
    //删除某个资源
    deleteResource(index, row) {
      this.$confirm("确定要删除吗？", "询问", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
      }).then((r) => {
        apiSettings.DeleteResourceSettings(row.sourceId).then((res) => {
          if (res.code == 200 && res.returnStatus == 1) {
            this.resourceData.splice(index, 1);
          } else {
            this.$message.error(res.msg);
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
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>
