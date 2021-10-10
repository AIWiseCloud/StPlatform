<template>
  <div class="container">
    <el-collapse v-model="activename">
      <template slot="title">
        <span>查询<i class="el-icon-search" style="color: red"></i></span>
      </template>
      <el-collapse-item name="0">
        <el-form :model="searchModel" label-width="92px" size="mini">
          <el-row>
            <el-col :sm="12" :md="8" :lg="5" :xl="5">
              <el-form-item label="关键字"
                ><el-input v-model="searchModel.keywords" clearable></el-input>
              </el-form-item>
            </el-col>
            <el-col :sm="12" :md="8" :lg="5" :xl="5">
              <el-form-item label="场地类型"
                ><el-input
                  v-model="searchModel.siteCategory"
                  clearable
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :sm="12" :md="16" :lg="10" :xl="10">
              <el-form-item label="所在区域">
                <!-- 查询选择区域 -->
                <el-cascader
                  ref="areaselect"
                  v-if="arealist.length"
                  v-model="addrArrSearch"
                  :props="props2"
                  :options="arealist"
                  placeholder="请选择所在省市"
                  style="width: 100%"
                  @change="areachangeSearch"
                ></el-cascader>
              </el-form-item>
            </el-col>
            <el-col :sm="12" :md="8" :lg="4" :xl="4">
              <el-button
                type="primary"
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
        :data="projectList"
        empty-text="暂无数据"
        border
        size="small"
        :header-cell-style="{
          'text-align': 'center',
          'background-color': '#F3F4F7',
        }"
      >
        <el-table-column
          label="单位名称"
          prop="organizationName"
          show-overflow-tooltip
          width="200"
        ></el-table-column>
        <el-table-column
          label="工程名称"
          prop="projectName"
          width="160"
        ></el-table-column>
        <el-table-column
          label="场地类型"
          prop="siteCategory"
          width="100"
        ></el-table-column>
        <el-table-column
          label="所在区域"
          prop="location"
          width="100"
        ></el-table-column>
        <el-table-column
          label="场地面积(平方)"
          prop="area"
          width="120"
          align="center"
        ></el-table-column>
        <el-table-column label="验收日期" align="center" width="100">
          <template slot-scope="scope">
            <span>{{ scope.row.inspectionDate.substr(0, 10) }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="简介"
          prop="summary"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column width="100">
          <template slot="header">
            <el-button
              plain
              size="mini"
              icon="el-icon-plus"
              @click="
                dialogvisible = true;
                isnew = true;
              "
              >添加</el-button
            >
          </template>
          <template slot-scope="scope">
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              circle
              @click="editItem(scope.$index, scope.row)"
            ></el-button>
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              circle
              @click="deleteItem(scope.$index, scope.row.id)"
            ></el-button>
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
      />
    </el-card>
    <!-- 对话框 -->
    <el-dialog
      title="编辑工程案例"
      :visible.sync="dialogvisible"
      @close="initialData"
    >
      <el-form
        ref="dialogform"
        :model="projectData"
        size="mini"
        :rules="rules"
        label-width="92px"
      >
        <el-form-item label="单位名称" prop="organizationName">
          <el-input v-model="projectData.organizationName"></el-input>
        </el-form-item>
        <el-form-item label="工程名称" prop="projectName">
          <el-input v-model="projectData.projectName"></el-input>
        </el-form-item>
        <el-row>
          <el-col :sm="12" :md="8" :lg="8" :xl="8"
            ><el-form-item label="场地类型" prop="siteCategory">
              <el-input
                v-model="projectData.siteCategory"
              ></el-input> </el-form-item
          ></el-col>
          <el-col :sm="12" :md="8" :lg="8" :xl="8"
            ><el-form-item label="场地面积" prop="area">
              <el-input v-model="projectData.area"></el-input> </el-form-item
          ></el-col>
          <el-col :sm="12" :md="8" :lg="8" :xl="8"
            ><el-form-item label="验收日期" prop="inspectionDate">
              <el-date-picker
                type="date"
                v-model="projectData.inspectionDate"
                size="mini"
                value-format="yyyy-MM-dd"
                style="width: 100%"
                placeholder="请选择" /></el-form-item
          ></el-col>
        </el-row>
        <el-row>
          <el-col :sm="12" :md="16" :lg="16" :xl="16"
            ><el-form-item label="所在区域" prop="location">
              <!-- 编辑选择区域 -->
              <el-cascader
                v-model="areaArr"
                :props="props"
                :options="arealist"
                placeholder="请选择所在省市"
                style="width: 100%"
                @change="areachange"
              ></el-cascader> </el-form-item
          ></el-col>
          <el-col :sm="12" :md="8" :lg="8" :xl="8"
            ><el-form-item label="操作" prop="creator">
              <el-input
                v-model="projectData.creator"
                disabled
              ></el-input> </el-form-item
          ></el-col>
        </el-row>
        <el-row>
          <el-col :sm="12" :md="12" :lg="12" :xl="12"
            ><el-form-item label="工程图片" prop="imgUrl">
              <el-upload
                class="avatar-uploader"
                :show-file-list="false"
                action
                :before-upload="handleImageBefore"
                :http-request="(params) => requestImgUpload(params)"
              >
                <el-image
                  v-if="projectData.imgUrl"
                  class="avatar"
                  :src="$common.getBaseURL() + projectData.imgUrl"
                  :onerror="ErrorImg"
                />
                <i v-else class="el-icon-plus avatar-uploader-icon" />
              </el-upload> </el-form-item
          ></el-col>
          <el-col :sm="12" :md="12" :lg="12" :xl="12"
            ><el-form-item label="工程简介" prop="summary">
              <el-input
                type="textarea"
                :rows="6"
                v-model="projectData.summary"
                maxlength="200"
                placeholder="请输入工程简介"
              ></el-input> </el-form-item
          ></el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" size="mini" @click="saveProjectCase"
          >确定</el-button
        >
        <el-button type="danger" size="mini" @click="dialogvisible = false"
          >取消</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>

<script>
import apiProjectcase from "@/api/projectcase";
import { mapGetters } from "vuex";
import apiBase from "@/api/base.js";
export default {
  data() {
    return {
      activename: "0",
      dialogvisible: false,
      isnew: false,
      totalCount: 0,

      searchModel: {
        keywords: "",
        siteCategory: "",
        province: "",
        city: "",
        pageModel: {
          pageNo: 1,
          pageSize: 20,
          orderField: "",
          orderWay: "",
        },
      },
      projectData: {
        id: "",
        organizationName: "",
        projectName: "",
        siteCategory: "",
        area: "",
        location: "",
        inspectionDate: "",
        imgUrl: "",
        summary: "",
        creator: "",
      },
      projectList: [],
      rules: {
        organizationName: {
          required: true,
          message: "请输入单位名称",
          trigger: "blur",
        },
        projectName: {
          required: true,
          message: "请输入工程名称",
          trigger: "blur",
        },
        siteCategory: {
          required: true,
          message: "请输入场地类型",
          trigger: "blur",
        },
        location: {
          required: true,
          message: "请选择所在区域",
          trigger: "blur",
        },
        imgUrl: {
          required: true,
          message: "请上传工程图片",
          trigger: "blur",
        },
        inspectionDate:{
          required:true,
          message:'验收日期不能为空',
          trigger:'blur'
        }
      },
      ErrorImg: 'this.src="' + require("@/assets/images/blankimg.png") + '"', // 图片错误地址
      fileName: "",
      addrArrSearch: [], //查询选择的省市区域
      arealist: [], //区域列表
      areaArr: [], //选择的省市区域(级联选择返回的是数组，保存或查询用拼接的)
      props: {
        value: "name",
        label: "name",
        children: "children",
        lazy: true,
        checkStrictly: false,
        lazyLoad(node, resolve) {
          const { level, data } = node;
          if (level <= 1) {
            apiBase.GetAdminAreas(level + 1, data.id).then((res) => {
              if (res.code == 200 && res.returnStatus == 1) {
                let nodes = [];
                for (let item of res.result) {
                  nodes.push(Object.assign({}, item, { leaf: level >= 1 }));
                }
                resolve(nodes);
              } else {
                this.$message.error(res.msg);
              }
            });
          }
        },
      },
      props2: {
        value: "name",
        label: "name",
        children: "children",
        lazy: true,
        checkStrictly: true, //可以选择任一级  (与props就是这个属性不同，导致加这个props2, 用focus事件切换也没有效果)
        lazyLoad(node, resolve) {
          const { level, data } = node;
          if (level <= 1) {
            apiBase.GetAdminAreas(level + 1, data.id).then((res) => {
              if (res.code == 200 && res.returnStatus == 1) {
                let nodes = [];
                for (let item of res.result) {
                  nodes.push(Object.assign({}, item, { leaf: level >= 1 }));
                }
                resolve(nodes);
              } else {
                this.$message.error(res.msg);
              }
            });
          }
        },
      },
    };
  },
  methods: {
    searchData() {
      this.searchModel.pageModel.pageNo = 1;
      this.projectList = [];
      this.loadData();
    },
    loadData() {
      apiProjectcase.QueryProjectCases(this.searchModel).then((res) => {
        if (res.code == 200 && res.returnStatus == 1) {
          const { totalCount, items } = res.result;
          this.totalCount = totalCount;
          this.projectList = items;
        } else {
          this.$message.error(res.msg);
        }
      });
    },
    initialData() {
      this.projectData.id = "";
      this.projectData.organizationName = "";
      this.projectData.projectName = "";
      this.projectData.siteCategory = "";
      this.projectData.location = "";
      this.projectData.area = 0;
      this.projectData.imgUrl = "";
      this.projectData.inspectionDate = "";
      this.projectData.summary = "";
      this.projectData.creator = this.userName;
      this.projectData.rindex = 0;
    },
    editItem(i, row) {
      let data = JSON.stringify(row);
      this.projectData = JSON.parse(data);
      this.projectData.rindex = i;
      this.isnew = false;
      if (this.projectData.location) {
        this.areaArr = this.projectData.location.split(",");
      }
      this.dialogvisible = true;
    },
    deleteItem(i, id) {
      this.$confirm("确定要删除吗？", "询问", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
      })
        .then((r) => {
          apiProjectcase.DeleteProjectCase(id).then((res) => {
            if (res.code == 200 && res.returnStatus == 1) {
              this.projectList.splice(i, 1);
              this.$message.success("删除成功!");
            } else {
              this.$message.error(res.msg);
            }
          });
        })
        .catch((e) => {});
    },
    saveProjectCase() {
      this.$refs["dialogform"].validate((valid) => {
        if (valid) {
          this.projectData.creator = this.userName;
          apiProjectcase.SaveProjectCase(this.projectData).then((res) => {
            if (res.code == 200 && res.returnStatus == 1) {
              if (this.isnew) {
                this.searchData();
              } else {
                this.projectData.id = res.result.identityKey;
                let datastr = JSON.stringify(this.projectData);
                this.$set(
                  this.projectList,
                  this.projectData.rindex,
                  JSON.parse(datastr)
                );
              }
              this.dialogvisible = false;
            } else {
              this.$message.error(res.msg);
            }
          });
        }
      });
    },
    // 开始上传
    handleImageBefore(file) {
      this.fileName = file.name; // 记录文件名称
      // 如果需要控制格式及文件尺寸在此进行
    },
    // 请求上传
    requestImgUpload(params) {
      const file = params.file;
      // 根据后台需求数据格式
      const form = new FormData();
      // 文件对象
      form.append("file", file);
      apiBase
        .UploadFiles(form)
        .then((res) => {
          const { result } = res;
          this.projectData.imgUrl = result.diclist[this.fileName];
        })
        .catch((error) => {
          console.log("文件上传error:", error);
        });
    },
    areachange(value) {
      this.projectData.location = value.join(",");
    },
    areachangeSearch(value) {
      this.searchModel.location = value.join(",");
      this.$refs.areaselect.dropDownVisible = false; // 关闭选择框
    },
  },
  created() {
    this.initialData();
    //载入省份列表
    apiBase.GetAdminAreas(1).then((res) => {
      if (res.code == 200 && res.returnStatus == 1) {
        this.arealist = res.result;
      }
    });
  },
  mounted() {
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
  height: 148px;
  line-height: 148px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 148px;
  display: block;
}
</style>