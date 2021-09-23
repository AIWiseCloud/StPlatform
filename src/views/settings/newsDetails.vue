<template>
  <div class="container">
    <el-card class="box-card">
      <div>
        <el-row :gutter="0">
          <el-col :span="24" :xs="24">
            <el-button
              icon="el-icon-postcard"
              size="mini"
              :disabled="!buttonStatus.savebutton"
              @click="saveNews"
              >保存</el-button
            >
            <el-button
              type="success"
              plain
              icon="el-icon-top"
              size="mini"
              :disabled="!buttonStatus.submitbutton"
              @click="submitNews"
              >提交</el-button
            >
            <el-button
              type="danger"
              plain
              icon="el-icon-bottom"
              size="mini"
              :disabled="!buttonStatus.cancelbutton"
              @click="cancelSubmit"
              >取消提交</el-button
            >
            <el-button
              type="danger"
              plain
              icon="el-icon-back"
              size="mini"
              @click="$router.go(-1)"
              >返回</el-button
            >
          </el-col>
        </el-row>
      </div>
    </el-card>
    <el-form
      ref="newsform"
      :model="newsData"
      label-width="92px"
      size="small"
      :rules="rules"
    >
      <el-row>
        <el-col :sm="24" :md="24" :lg="18" :xl="18">
          <el-row class="row1">
            <el-col :sm="24" :md="8" :lg="8" :xl="8">
              <el-form-item label="编号" prop="newsId">
                <el-input v-model="newsData.newsId" disabled />
              </el-form-item>
            </el-col>
            <el-col :sm="24" :md="8" :lg="8" :xl="8">
              <el-form-item label="来源" prop="source">
                <el-input
                  v-model="newsData.source"
                  placeholder="请输入分类或来源"
                />
              </el-form-item>
            </el-col>
            <el-col :sm="24" :md="8" :lg="8" :xl="8">
              <el-form-item label="作者" prop="author">
                <el-input
                  v-model="newsData.author"
                  placeholder="请输入新闻作者"
                />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row class="row2">
            <el-col :sm="16" :md="16" :lg="16" :xl="16">
              <el-form-item label="标题" prop="title">
                <el-input
                  v-model="newsData.title"
                  clear
                  placeholder="请输入新闻动态标题"
                />
              </el-form-item>
            </el-col>
            <el-col :sm="8" :md="8" :lg="8" :xl="8">
              <el-form-item label="排序">
                <el-input v-model="newsData.fIndex" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row class="row3">
            <el-col :sm="24" :md="8" :lg="8" :xl="8">
              <el-form-item label="状态">
                <el-input v-model="statusName" disabled />
              </el-form-item>
            </el-col>
            <el-col :sm="24" :md="8" :lg="8" :xl="8">
              <el-form-item label="阅读量">
                <el-input v-model="newsData.amountReading" disabled />
              </el-form-item>
            </el-col>
            <el-col :sm="24" :md="8" :lg="8" :xl="8">
              <el-form-item label="点赞数">
                <el-input v-model="newsData.numberLike" disabled />
              </el-form-item>
            </el-col>
          </el-row>
        </el-col>
        <el-col :sm="24" :md="24" :lg="6" :xl="6">
          <el-form-item label="封面图片">
            <el-upload
              class="avatar-uploader"
              :show-file-list="false"
              action
              :before-upload="handleImageBefore"
              :http-request="(params) => requestImgUpload(params)"
            >
              <el-image
                v-if="newsData.imgUrl"
                class="avatar"
                :src="$common.getBaseURL() + newsData.imgUrl"
                :onerror="ErrorImg"
              />
              <i v-else class="el-icon-plus avatar-uploader-icon" />
            </el-upload>
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item label="摘要" prop="summary">
        <el-input
          v-model="newsData.summary"
          placeholder="输入摘要"
          maxlength="200"
        ></el-input>
      </el-form-item>
      <el-form-item label="正文">
        <vue-ueditor-wrap v-model="newsData.body" :config="config" />
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import VueUeditorWrap from "vue-ueditor-wrap"; // ES6 Module
import apiNews from "@/api/news.js";
import upload from "@/api/base.js";
export default {
  name: "NewsDetails",
  components: {
    VueUeditorWrap,
  },
  data() {
    return {
      config: {
        UEDITOR_HOME_URL: "/ueditor/", // 需要令此处的URL等于对应 ueditor.config.js 中的配置。
        // 多图上传功能配置
        serverUrl: "/api/UEditor", // 上传接口路径   (开始一直出现跨域的问题，原来是我这里搞错了，不能http://127.0.0.1:8031/api/UEditor这样)
      },
      newsData: {
        newsId: "",
        title: "",
        summary: "",
        imgUrl: "",
        body: "",
        source: "",
        author: "",
        creator: "",
        // createDate: "",
        fIndex: 0,
        statusId: 0,
        amountReading: 0,
        numberLike: 0,
      },
      ErrorImg: 'this.src="' + require("@/assets/images/blankimg.png") + '"', // 图片错误地址
      fileName: "",
      rules: {
        newsId: { required: true, message: "id不能为空", trigger: "blur" },
        title: { required: true, message: "标题不能为空", trigger: "blur" },
        summary: { required: true, message: "摘要不能为空", trigger: "blur" },
        imgUrl: { required: true, message: "请设置封面图片", trigger: "blur" },
        source: { required: true, message: "请编辑正文", trigger: "blur" },
        author: { required: true, message: "请注明作者", trigger: "blur" },
      },
    };
  },
  computed: {
    buttonStatus() {
      return {
        savebutton: this.newsData.statusId == 0,
        submitbutton: this.newsData.statusId == 0,
        cancelbutton: this.newsData.statusId == 1,
      };
    },
    statusName() {
      let name = "";
      switch (this.newsData.statusId) {
        case 0:
          name = "草稿";
          break;
        case 1:
          name = "提交";
          break;
        case 2:
          name = "审核";
          break;
      }
      return name;
    },
  },
  beforeMount() {
    const params = this.$route.params;
    if (params.isnew == 0) {
      apiNews.GetCompanyNews(params.newsid).then((res) => {
        if (res.code == 200 && res.returnStatus == 1) {
          this.newsData = res.result;
        }
      });
    } else {
      this.newsData.newsId = params.newsid;
    }
  },
  methods: {
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
      upload
        .UploadFiles(form)
        .then((res) => {
          const { result } = res;
          this.newsData.imgUrl = result.diclist[this.fileName];
        })
        .catch((error) => {
          this.$message.error(JSON.stringify(error));
        });
    },
    // 保存
    saveNews() {
      // console.log(JSON.stringify(this.newsData));
      this.$refs.newsform.validate((valid) => {
        if (valid) {
          apiNews.SaveCompanyNews(this.newsData).then((res) => {
            if (res.code == 200 && res.returnStatus == 1) {
              this.$message.success("保存成功");
            } else {
              return this.$message.error(res.msg);
            }
          });
        }
      });
    },
    doSubmit(isSubmit) {
      apiNews.SubmitAudit(this.newsData.newsId, isSubmit).then((res) => {
        if (res.code == 200 && res.returnStatus == 1) {
          this.newsData.statusId = isSubmit == true ? 1 : 0;
          this.$message.success("操作成功！");
        } else {
          this.$message.error(this.res.msg);
        }
      });
    },
    // 提交
    submitNews() {
      this.doSubmit(true);
    },
    // 取消提交
    cancelSubmit() {
      this.doSubmit(false);
    },
  },
};
</script>

<style lang="less" scoped>
@imgheight: 138px;
.container {
  margin: 10px;
  .box-card {
    width: 100%;
    max-width: 100%;
    margin: 0px auto;
    margin-top: 10px;
    margin-bottom: 18px;
  }
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
  width: @imgheight;
  height: @imgheight;
  line-height: @imgheight;
  text-align: center;
}
.avatar {
  width: @imgheight;
  height: @imgheight;
  display: block;
}
</style>
