<template>
  <div class="container">
    <!-- 卡片视图区域 -->
    <el-card>
      <!-- 按钮区域 -->
      <el-row>
        <el-col>
          <el-button
            type="primary"
            size="mini"
            icon="el-icon-plus"
            style="margin-right: 1px"
            plain
            @click="showDialog(true)"
          >添加分类</el-button>
          <el-button
            type="default"
            size="mini"
            icon="el-icon-refresh"
            plain
            @click="getCategories('*')"
          >刷新列表</el-button>
        </el-col>
      </el-row>
      <tree-table
        class="treeTable"
        :data="categoriesData"
        :columns="columns"
        :selection-type="false"
        :expand-type="false"
        show-index
        index-text="#"
        border
        :show-row-hover="false"
      >
        <template slot="isstop" scope="scope">
          <i v-if="!scope.row.isCancellation" class="el-icon-success" />
          <i v-else class="el-icon-error" />
        </template>
        <template slot="pic" scope="scope">
          <el-image
            :src="scope.row.imgUrl ? baseUrl + scope.row.imgUrl : ''"
            :onerror="ErrorImg"
            style="width: 80px; height: 80px"
          />
        </template>
        <template slot="operate" scope="scope">
          <el-button
            type="primary"
            size="mini"
            icon="el-icon-edit"
            @click="showDialog(false, scope.row)"
          >编辑</el-button>
          <el-button
            type="danger"
            size="mini"
            icon="el-icon-delete"
            @click="deleteCategory(scope.row)"
          >删除</el-button>
        </template>
      </tree-table>
    </el-card>
    <!-- 添加分类的对话框 -->
    <el-dialog
      :title="(isAddDialog ? '添加' : '修改') + '分类'"
      :visible.sync="visibleDialog"
      @close="dialogClosed"
    >
      <el-form
        ref="cateform"
        :model="cateData"
        label-width="95px"
        size="mini"
        :rules="rules"
      >
        <el-row>
          <el-col :sm="12" :md="12" :lg="12" :xl="12">
            <el-form-item label="分类代码" prop="categoryId">
              <el-input
                v-model="cateData.categoryId"
                :disabled="!isAddDialog"
              />
            </el-form-item>
          </el-col>
          <el-col :sm="12" :md="12" :lg="12" :xl="12">
            <el-form-item label="分类名称" prop="categoryName">
              <el-input v-model="cateData.categoryName" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :sm="12" :md="12" :lg="12" :xl="12">
            <el-form-item label="上级分类" prop="ParentId">
              <el-cascader
                v-model="cateData.parentId"
                :options="categoriesData"
                :show-all-levels="false"
                multiple="false"
                placeholder="选择上级分类"
                :props="{
                  label: 'categoryName',
                  value: 'categoryId',
                  checkStrictly: 'false',
                }"
              />
            </el-form-item>
          </el-col>
          <el-col :sm="12" :md="12" :lg="12" :xl="12">
            <el-form-item label="所属店铺" prop="shopId">
              <el-select v-model="cateData.shopId" placeholder="选择店铺">
                <el-option
                  v-for="item in shops"
                  :key="item.shopId"
                  :label="item.shopName"
                  :value="item.shopId"
                />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :sm="12" :md="12" :lg="12" :xl="12">
            <el-form-item label="排序索引" prop="findex">
              <el-input v-model="cateData.findex" type="number" />
            </el-form-item>
          </el-col>
          <el-col :sm="12" :md="12" :lg="12" :xl="12">
            <el-form-item label="作废" prop="isCancellation">
              <el-switch v-model="cateData.isCancellation" :inactive-value="0" :active-value="1" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="分类图片" prop="imgUrl">
          <el-upload
            class="avatar-uploader"
            :show-file-list="false"
            action
            :before-upload="handleImgBefore"
            :http-request="(params) => requestImgUpload(params)"
          >
            <el-image
              v-if="cateData.imgUrl"
              :src="cateData.imgUrl ? baseUrl + cateData.imgUrl : ''"
              class="avatar"
            />
            <i v-else class="el-icon-plus avatar-uploader-icon" />
          </el-upload>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="visibleDialog = false">取消</el-button>
        <el-button
          type="danger"
          @click="submitGoodsCategory('cateform')"
        >确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import apiGoods from '@/api/goods'
import apiSettings from '@/api/settings'
import apiBase from '@/api/base'
import common from '@/utils/common'
export default {
  data() {
    return {
      categoriesData: [], // 树形分类数据源
      shops: [],
      fileName: '', // 是传图片名
      baseUrl: '', // 图片根目录
      ErrorImg: 'this.src="' + require('@/assets/images/blankimg.png') + '"', // 图片错误地址
      cateData: {
        categoryId: '',
        categoryName: '',
        parentId: '',
        shopId: '',
        imgUrl: '',
        findex: 100,
        isCancellation: 0
      },
      visibleDialog: false, // 显示对话框
      isAddDialog: true, // 当前是新增对话框
      columns: [
        { label: '类别代码', prop: 'categoryId' },
        { label: '类别名称', prop: 'categoryName' },
        { label: '作废', type: 'template', template: 'isstop' },
        {
          label: '分类图片',
          type: 'template',
          template: 'pic',
          align: 'center'
        },
        { label: '上级代码', prop: 'parentId' },
        { label: '排序索引', prop: 'findex' },
        { label: '操作', type: 'template', template: 'operate', width: '200' }
      ],
      rules: {
        categoryId: {
          required: true,
          message: '请输入分类代码',
          trigger: 'blur'
        },
        categoryName: {
          required: true,
          message: '请输入分类名称',
          trigger: 'blur'
        }
      }
    }
  },
  created() {
    this.getCategories('*')
    this.baseUrl = common.getBaseURL()
    apiSettings.GetShops().then((res) => {
      if (res.code == 200 && res.returnStatus == 1) {
        this.shops = res.result
      }
    })
  },
  methods: {
    // 获取商品分类数据(参数：parentId 为空时获取1级分类，为*时所有分类, 其余情况为获取下级分类)
    getCategories(parentId) {
      apiGoods.GetGoodsCategories(parentId).then((res) => {
        if (res.code == 200 && res.returnStatus == 1) {
          this.categoriesData = res.result
        }
      })
    },
    // 打开新增对话框
    showDialog(isAdd, row) {
      this.visibleDialog = true
      this.isAddDialog = isAdd
      if (isAdd) {
        this.cateData.categoryId = ''
        this.cateData.shopId = ''
        this.cateData.categoryName = ''
        this.cateData.parentId = ''
        this.cateData.imgUrl = ''
        this.cateData.isCancellation = 0
        this.cateData.findex = 200
      } else {
        this.cateData.categoryId = row.categoryId
        this.cateData.categoryName = row.categoryName
        this.cateData.shopId = row.shopId
        this.cateData.parentId = row.parentId ? [row.parentId] : ''
        this.cateData.imgUrl = row.imgUrl
        this.cateData.isCancellation = row.isCancellation
        this.cateData.findex = row.findex
      }
    },
    // 提交商品分类
    submitGoodsCategory(ruleForm) {
      this.$refs[ruleForm].validate((valid) => {
        if (valid) {
          const data = JSON.parse(JSON.stringify(this.cateData))
          data.parentId = data.parentId ? data.parentId[0] : ''
          apiGoods
            .SaveGoodsCategory(data)
            .then((res) => {
              if (res.code == 200 && res.returnStatus == 1) {
                this.visibleDialog = false
                this.getCategories('*')
              } else {
                this.$message.error(JSON.stringify(res.msg))
              }
            })
            .catch((err) => {
              // this.$message.error(JSON.stringify(err));
            })
        } else {
          return false
        }
      })
    },
    // 关闭对话框进行相关重置
    dialogClosed() {
      console.log('close')
      // 表单内容重置为空
      this.$refs.cateform.resetFields() // 通过ref引用调用resetFields方法
    },
    // 删除
    deleteCategory(row) {
      if (row.children.length) {
        return this.$message.error('存在子分类')
      }
      this.$confirm('确定要删除吗？', '询问', {
        cancelButtonText: '取消',
        confirmButtonText: '确定'
      })
        .then((r) => {
          return apiGoods.DeleteGoodsCategory(row.categoryId)
        })
        .then((res) => {
          if (res.code == 200 && res.returnStatus == 1) {
            this.$message({ message: '删除成功', type: 'success' })
            this.getCategories('*')
          } else {
            this.$message.error(JSON.stringify(res.msg))
          }
        })
        .catch((err) => {
          this.$message.error(JSON.stringify(err))
        })
    },
    // 上传前
    handleImgBefore(file) {
      this.fileName = file.name // 记录文件名称
      const isJPG =
        file.type === 'image/jpeg' ||
        file.type == 'image/png' ||
        file.type == 'image/JPG'
      const isLt2M = file.size / 1024 / 1024 < 2

      if (!isJPG) {
        this.$message.error('上传头像图片只能是 JPG/PNG/JPEG 格式!')
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!')
      }
      return isJPG && isLt2M
    },
    // 选择图片并调用api上传
    requestImgUpload(params) {
      const file = params.file
      // 根据后台需求数据格式
      const form = new FormData()
      // 文件对象
      form.append('file', file)
      apiBase
        .UploadFiles(form)
        .then((res) => {
          // console.log("上传返回：", JSON.stringify(res));
          const { result } = res
          this.cateData.imgUrl = result.diclist[this.fileName]
          // console.log(this.settingsData[imgField]);
        })
        .catch((error) => {
          this.$message.error(JSON.stringify(err))
        })
    }
  }
}
</script>

<style lang='less' scoped>
@import '~@/styles/common.less';
.el-icon-success {
  color: lightgreen;
}
.el-icon-error {
  color: red;
}
.treeTable {
  margin-top: 15px;
}
.uploaderbox(178px);
</style>
