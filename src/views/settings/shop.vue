<template>
  <div class="container">
    <el-button-group style="margin-bottom:10px">
      <el-button
        type="primary"
        size="mini"
        icon="el-icon-plus"
        style="margin-right:2px"
        plain
        @click="openDialog(true)"
      >添加店铺</el-button>
      <el-button
        type="primary"
        size="mini"
        icon="el-icon-refresh"
        plain
        @click="loadData"
      >刷新列表</el-button>
    </el-button-group>
    <el-table :data="shopArr" size="small" style="width: 100%" border fit :header-cell-style="{ 'text-align': 'center' , background: '#F3F4F7', color: '#555'}">
      <el-table-column
        width="100"
        prop="shopId"
        label="店铺代码"
      />
      <el-table-column
        width="200"
        prop="shopName"
        label="店铺名称"
      />
      <el-table-column
        width="100"
        prop="contacter"
        label="联系人"
      />
      <el-table-column
        width="140"
        prop="phoneNumber"
        label="手机号"
      />
      <el-table-column
        width="200"
        prop="introduction"
        label="店铺简介"
        align="left"
      />
      <el-table-column
        prop="announcement"
        label="店铺公告"
        align="left"
      />
      <el-table-column
        width="180"
        prop="createDate"
        label="创建日期"
      />
      <el-table-column label="操作" align="center" width="140">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="primary"
            icon="el-icon-edit"
            circle
            @click="openDialog(false, scope.$index, scope.row)"
          />
          <el-button
            type="danger"
            size="mini"
            icon="el-icon-delete"
            circle
            @click="deleteShop(scope.$index, scope.row)"
          />
        </template>
      </el-table-column>
    </el-table>
    <el-dialog
      :visible.sync="visibleDialog"
      :title="(isAddDialog ? '新增' : '编辑') + '店铺'"
    >
      <el-form
        ref="shopform"
        :model="shopData"
        label-width="150px"
        :rules="rules"
        size="mini"
      >
        <el-form-item label="店铺代码" prop="shopId">
          <el-input
            v-model="shopData.shopId"
            :disabled="!isAddDialog"
          />
        </el-form-item>
        <el-form-item label="店铺名称" prop="shopName">
          <el-input v-model="shopData.shopName" />
        </el-form-item>
        <el-form-item label="联系人" prop="contacter">
          <el-input v-model="shopData.contacter" />
        </el-form-item>
        <el-form-item label="手机号" prop="phoneNumber">
          <el-input v-model="shopData.phoneNumber" />
        </el-form-item>
        <el-form-item label="店铺简介" prop="introduction">
          <el-input v-model="shopData.introduction" />
        </el-form-item>
        <el-form-item label="店铺公告" prop="announcement">
          <el-input v-model="shopData.announcement" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="mini" @click="visibleDialog = false">取消</el-button>
        <el-button
          type="primary"
          size="mini"
          @click="confirmShop('shopform')"
        >确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import apiSettings from '@/api/settings'
export default {
  data() {
    return {
      shopArr: [],
      shopData: {
        shopId: '',
        shopName: '',
        imgUrl: '',
        contacter: '',
        phoneNumber: '',
        listBySpuShow: 1,
        introduction: '',
        announcement: ''
      },
      visibleDialog: false,
      isAddDialog: true,
      currentIndex: -1,
      rules: {
        shopId: { required: true, message: '请输入店铺代码', trigger: 'blur' },
        shopName: {
          required: true,
          message: '请输入店铺名称',
          trigger: 'blur'
        }
      }
    }
  },
  mounted() {
    this.loadData()
  },
  methods: {
    loadData() {
      apiSettings.GetShops().then((res) => {
        if (res.code == 200 && res.returnStatus == 1) {
          this.shopArr = res.result
        }
      })
    },
    // 打开新增/编辑对话框
    openDialog(isAdd, index, row) {
      this.visibleDialog = true
      this.isAddDialog = isAdd
      if (isAdd) {
        this.shopData.shopId = ''
        this.shopData.shopName = ''
        this.shopData.imgUrl = ''
        this.shopData.contacter = ''
        this.shopData.phoneNumber = ''
        this.shopData.listBySpuShow = 1
        this.shopData.introduction = ''
        this.shopData.announcement = ''
      } else {
        const copyData = JSON.stringify(row)
        console.log('复制', copyData)
        this.shopData = JSON.parse(copyData)
        this.currentIndex = index
      }
    },
    // 保存(确定)
    confirmShop(formname) {
      this.$refs[formname].validate((valid) => {
        if (valid) {
          apiSettings
            .SaveShop(this.shopData)
            .then((res) => {
              if ((res.code = 200 && res.returnStatus == 1)) {
                if (this.isAddDialog) {
                  this.shopArr.push(this.shopData)
                } else {
                  this.$set(this.shopArr, this.currentIndex, this.shopData)
                }
                this.visibleDialog = false
              } else {
                this.$message.error(JSON.stringify(res.msg))
              }
            })
            .catch((err) => {
              this.$message.error(JSON.stringify(err))
            })
        } else {
          return false
        }
      })
    },
    // 删除
    deleteShop(index, row) {
      this.$confirm('您确定要删除该店铺吗？', '询问', {
        cancelButtonText: '取消',
        confirmButtonText: '确定'
      })
        .then((s) => {
          console.log(row.shopId)
          return apiSettings.DeleteShop(row.shopId)
        })
        .then((res) => {
          if (res.code == 200 && res.returnStatus == 1) {
            this.loadData()
          } else {
            this.$message.error(JSON.stringify(res.msg))
          }
        })
        .catch((err) => {
          this.$message.error(JSON.stringify(err))
        })
    }
  }
}
</script>

<style lang="less" scoped>
.container {
  margin: 20px;
}
</style>
