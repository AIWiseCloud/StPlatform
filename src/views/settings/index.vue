<template>
  <div style="margin-top: 15px" class="app-container">
    <el-collapse v-model="activenames">
      <el-collapse-item name="1">
        <template slot="title">
          <span>商城配置 <i class="el-icon-setting" style="color: red" /></span>
        </template>
        <el-form label-position="left" label-width="74px" class="demo-ruleForm">
          <el-form-item>
            <el-button
              title="保存"
              type="success"
              plain
              @click.native="SaveSettings()"
            >保存</el-button>
          </el-form-item>
        </el-form>
      </el-collapse-item>
    </el-collapse>

    <el-form
      label="商城配置"
      class="demo-ruleForm"
      :model="settingsData"
      label-width="110px"
    >
      <el-row :gutter="10">
        <el-col :md="8" :lg="8">
          <el-form-item label="编号" title="编号">
            <el-input
              v-model="settingsData.id"
              placeholder="编号"
              clearable
              disabled
              size="small"
            />
          </el-form-item>
        </el-col>
        <el-col :md="8" :lg="8">
          <el-form-item label="维护中" title="维护中">
            <el-switch v-model="settingsData.IsMaintain" />
          </el-form-item>
        </el-col>
        <el-col :md="8" :lg="8">
          <el-form-item label="显示最新消息" title="显示最新消息">
            <el-switch v-model="settingsData.showNotice" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="10">
        <el-col>
          <el-form-item label="最新消息" title="最新消息">
            <el-input
              v-model="settingsData.notication"
              placeholder="最新消息"
              clearable
              size="small"
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="10">
        <el-col :sm="12" :md="8" :lg="8" :xl="8">
          <el-form-item label="轮播图1" title="轮播图1">
            <el-upload
              class="avatar-uploader"
              action
              accept="image/jpg, image/png, image/jpeg"
              :show-file-list="false"
              :before-upload="beforeAvatarUpload"
              :http-request="(params) => uploadSectionFile(params, 'imgUrl1')"
            >
              <el-image
                v-if="settingsData.imgUrl1"
                :src="baseUrl + settingsData.imgUrl1"
                :onerror="ErrorImg"
                class="avatar"
              />
              <i v-else class="el-icon-plus avatar-uploader-icon" />
            </el-upload>
          </el-form-item>
        </el-col>
        <el-col :sm="12" :md="8" :lg="8" :xl="8">
          <el-form-item label="轮播图2" title="轮播图2">
            <el-upload
              class="avatar-uploader"
              action
              accept="image/jpg, image/png, image/jpeg"
              :show-file-list="false"
              :before-upload="beforeAvatarUpload"
              :http-request="(params) => uploadSectionFile(params, 'imgUrl2')"
            >
              <el-image
                v-if="settingsData.imgUrl2"
                :src="baseUrl + settingsData.imgUrl2"
                :onerror="ErrorImg"
                class="avatar"
              />
              <i v-else class="el-icon-plus avatar-uploader-icon" />
            </el-upload>
          </el-form-item>
        </el-col>
        <el-col :sm="12" :md="8" :lg="8" :xl="8">
          <el-form-item label="轮播图3" title="轮播图3">
            <el-upload
              class="avatar-uploader"
              action
              accept="image/jpg, image/png, image/jpeg"
              :show-file-list="false"
              :before-upload="beforeAvatarUpload"
              :http-request="(params) => uploadSectionFile(params, 'imgUrl3')"
            >
              <el-image
                v-if="settingsData.imgUrl3"
                :src="baseUrl + settingsData.imgUrl3"
                :onerror="ErrorImg"
                class="avatar"
              />
              <i v-else class="el-icon-plus avatar-uploader-icon" />
            </el-upload>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="10">
        <el-col :sm="12" :md="8" :lg="8" :xl="8">
          <el-form-item label="图1跳转" title="图1跳转">
            <el-input
              v-model="settingsData.nav1"
              placeholder="图1跳转"
              clearable
              size="small"
            />
          </el-form-item>
        </el-col>
        <el-col :sm="12" :md="8" :lg="8" :xl="8">
          <el-form-item label="图2跳转" title="图2跳转">
            <el-input
              v-model="settingsData.nav2"
              placeholder="图2跳转"
              clearable
              size="small"
            />
          </el-form-item>
        </el-col>
        <el-col :sm="12" :md="8" :lg="8" :xl="8">
          <el-form-item label="图3跳转" title="图3跳转">
            <el-input
              v-model="settingsData.nav3"
              placeholder="图3跳转"
              clearable
              size="small"
            />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>

<script>
/* eslint-disable */
import upload from "@/api/base.js";
import common from "@/utils/common";
import apiSettings from "@/api/settings";
export default {
  // name: "basicsetting",
  data() {
    return {
      activenames: ["1"],
      baseUrl: "", //图片根目录
      ErrorImg: 'this.src="' + require("@/assets/images/blankimg.png") + '"', //图片错误地址
      settingsData: {
        id: "A002",
        isMaintain: 0,
        notication: "最新的消息，大家来围观",
        showNotice: 0,
        imgUrl1: "",
        nav1: "",
        imgUrl2: "",
        nav2: "",
        imgUrl3: "",
        nav3: "",
      },
    };
  },
  methods: {
    // 图片上传 start
    beforeAvatarUpload(file) {
      this.fileName = file.name; //记录文件名称
      const isJPG =
        file.type === "image/jpeg" ||
        file.type == "image/png" ||
        file.type == "image/JPG";
      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isJPG) {
        this.$message.error("上传头像图片只能是 JPG/PNG/JPEG 格式!");
      }
      if (!isLt2M) {
        this.$message.error("上传头像图片大小不能超过 2MB!");
      }
      return isJPG && isLt2M;
    },
    uploadSectionFile(params, imgField) {
      const file = params.file;
      // 根据后台需求数据格式
      const form = new FormData();
      // 文件对象
      form.append("file", file);
      upload
        .UploadFiles(form)
        .then((res) => {  
          // console.log("上传返回：", JSON.stringify(res));
          const { result } = res;
          this.settingsData[imgField] = result.diclist[this.fileName];
          // console.log(this.settingsData[imgField]);
        })
        .catch((error) => {
          console.log("图片上传error:", error);
        });
    },
    //保存
    SaveSettings() {
      apiSettings
        .saveSettings(this.settingsData)
        .then((res) => {
          console.log(JSON.stringify(res));
          if (res.code == 200) {
            this.$message({message:"保存成功",type:'success'});
          } else {
            this.$message.error("保存出错");
          }
        })
        .catch((err) => {
           this.$message.error(JSON.stringify(err));
        });
    },
  },
  created() {
    this.baseUrl = common.getBaseURL();
  },
  mounted() {
    apiSettings.getSettings().then((res) => {
      // console.log(JSON.stringify(res));
      if (res.code == 200) {
        const { result } = res;
        if (result) {
          this.settingsData = result;
        }
      }
    });
  },
  computed: {},
  components: {},
};
</script>

<style scoped lang="less">
/deep/.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
/deep/.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
/deep/.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 160px;
  height: 160px;
  line-height: 160px;
  text-align: center;
}
/deep/.avatar {
  width: 160px;
  height: 160px;
  display: block;
}
</style>
