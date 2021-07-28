<template>
  <div class="app-container">
    <el-row :gutter="20">
      <el-col>
        <el-button-group class="btngroup">
          <el-button
            class="btnadd"
            type="primary"
            size="small"
            icon="el-icon-plus"
            plain
            @click="openSubMesTypeDialog(true)"
          >添加分类</el-button>
          <el-button
            type="primary"
            size="small"
            icon="el-icon-refresh"
            plain
            @click="loadData()"
          >
            刷新
          </el-button>
        </el-button-group>
      </el-col>
    </el-row>
    <el-container>
      <el-aside width="400px" class="aside">
        <el-tree
          :data="subMesTypes"
          node-key="id"
          :props="defaultProps"
          default-expand-all
          :highlight-current="true"
          :expand-on-click-node="false"
          @current-change="currentChange"
        >
          <span slot-scope="{ node, data }" class="custom-tree-node">
            <span><i class="el-icon-folder" style="margin-right: 10px" />{{
              node.label
            }}</span>
            <span>
              <el-button
                type="text"
                size="mini"
                @click="() => openSubMesTypeDialog(false, node, data)"
              >修改分类</el-button>
              <el-button
                type="text"
                size="mini"
                @click="() => deleteSubMesType(node, data)"
              >删除分类</el-button>
              <el-button
                type="text"
                size="mini"
                @click="() => openSubMessageDialog(true, node, data)"
              >添加子项</el-button>
            </span>
          </span>
        </el-tree>
      </el-aside>
      <el-main>
        <el-table
          v-if="subitems.length"
          :data="subitems"
          style="width: 100%"
          :header-cell-style="{
            'text-align': 'center',
            background: '#F3F4F7',
            color: '#555',
          }"
        >
          <el-table-column prop="fNumber" label="子项编号" width="160">
            <template slot-scope="scope">
              <i class="el-icon-document" />
              <span style="margin-left: 10px">{{ scope.row.fNumber }}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="fName"
            label="子项名称"
            width="160"
            :show-overflow-tooltip="true"
          />
          <el-table-column prop="iscancellation" label="作废" width="100">
            <template slot-scope="scope">
              <el-switch v-model="scope.row.iscancellation" />
            </template>
          </el-table-column>
          <el-table-column prop="fIndex" label="排序索引" width="100" />
          <el-table-column
            prop="fNote"
            label="备注"
            :show-overflow-tooltip="true"
          />
          <el-table-column label="操作" align="center">
            <template slot-scope="scope">
              <el-button
                size="mini"
                @click="openSubMessageDialog(false, scope.$index, scope.row)"
              >修改</el-button>
              <el-button
                type="danger"
                size="mini"
                @click="deleteSubMessage(scope.$index, scope.row)"
              >删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-main>
    </el-container>
    <!-- 辅助资料分类对话框 -->
    <el-dialog title="辅助资料分类" :visible.sync="visibleTypeForm">
      <el-form
        ref="ruleForm"
        :model="subMesType"
        :rules="rules"
        size="mini"
        label-width="150px"
      >
        <el-form-item label="辅助资料分类编号" prop="id">
          <el-input
            v-model="subMesType.id"
            auto-complete="off"
            :disabled="!isAddDialog"
          />
        </el-form-item>
        <el-form-item label="辅助资料分类名称" prop="fName">
          <el-input v-model="subMesType.fName" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="visibleTypeForm = false">取 消</el-button>
        <el-button
          type="primary"
          @click="confirmSubMesType('ruleForm')"
        >确 定</el-button>
      </div>
    </el-dialog>
    <!-- 子项编辑对话框 -->
    <el-dialog title="辅助资料子项" :visible.sync="visibleItemForm">
      <el-form
        ref="ruleItemForm"
        :model="subMessage"
        :rules="rulesItem"
        size="mini"
        label-width="110px"
      >
        <el-form-item label="ID" prop="id">
          <el-input v-model="subMessage.id" disabled />
        </el-form-item>
        <el-form-item label="所属分类" prop="parentId">
          <el-input v-model="subMessage.parentId" />
        </el-form-item>
        <el-form-item label="子项编号" prop="fNumber">
          <el-input v-model="subMessage.fNumber" :disabled="!isAddItemDialog" />
        </el-form-item>
        <el-form-item label="子项名称" prop="fName">
          <el-input v-model="subMessage.fName" />
        </el-form-item>
        <el-form-item label="作废" prop="iscancellation">
          <el-switch v-model="subMessage.iscancellation" />
        </el-form-item>
        <el-form-item label="排序索引" prop="fIndex">
          <el-input v-model="subMessage.fIndex" />
        </el-form-item>
        <el-form-item label="备注" prop="fNote">
          <el-input v-model="subMessage.fNote" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="visibleItemForm = false">取 消</el-button>
        <el-button
          type="primary"
          @click="confirmSubMessage('ruleItemForm')"
        >确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import apiSettings from '@/api/settings'
export default {
  data() {
    return {
      defaultProps: {
        label: 'fName',
        children: 'children'
      },
      isAddDialog: true, // 分类对话框是否为新增状态
      isAddItemDialog: true, // 子项对话框是否为新增状态
      itemIndex: -1, // 当前子项索引（用于修改时更新对应元素)
      subMesTypes: [
        { id: 'pdcolor', fName: '产品颜色', age: 30 },
        { id: 'pdspec', fName: '产品规格', age: 59 }
      ],
      subMesType: {
        id: '',
        fName: ''
      },
      subitems: [], // 选中分类的子项列表
      subMessage: {
        id: '',
        parentId: '',
        fNumber: '',
        fName: '',
        isCancalelation: 0,
        fIndex: 100,
        fNote: ''
      },
      visibleTypeForm: false, // 显示分类编辑对话框
      visibleItemForm: false, // 显示子项编辑对话框
      rules: {
        id: [
          { required: true, message: '请输入编号', trigger: 'blur' },
          {
            min: 3,
            max: 30,
            message: '长度在 3 到 30 个字符',
            trigger: 'blur'
          }
        ],
        fName: {
          required: true,
          message: '请输入名称',
          trigger: 'blur'
        }
      },
      rulesItem: {
        parentId: {
          required: true,
          message: '必须提供所属分类',
          trigger: 'blur'
        },
        fNumber: {
          required: true,
          message: '请提供子项编号',
          trigger: 'blur'
        },
        fName: {
          required: true,
          message: '请提供子项名称',
          trigger: 'blur'
        },
        fIndex: {
          required: true,
          message: '请提供排序索引值',
          trigger: 'blur'
        }
      }
    }
  },
  mounted() {
    this.loadData()
  },
  methods: {
    // 载入数据
    loadData() {
      this.subMesTypes = []
      apiSettings
        .GetSubMesTypes()
        .then((res) => {
          if (res.code == 200 && res.returnStatus == 1) {
            this.subMesTypes = res.result
            // 默认加载第一个分类下的子项
          } else {
            this.$message.error(JSON.stringify(res.msg))
          }
        })
        .catch((err) => {
          this.$message.error(JSON.stringify(err))
        })
    },
    // 打开分类编辑对话框
    openSubMesTypeDialog(isAdd, node, data) {
      this.isAddDialog = isAdd
      if (isAdd) {
        this.subMesType = {}
      } else {
        this.subMesType.id = data.id
        this.subMesType.fName = data.fName
      }
      this.visibleTypeForm = true
    },
    // 保存类别
    confirmSubMesType(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.visibleTypeForm = false
          apiSettings
            .SaveSubMesType(this.subMesType)
            .then((res) => {
              if (res.code == 200 && res.returnStatus == 1) {
                if (this.isAddDialog) {
                  this.subMesTypes.push(this.subMesType)
                  this.subitems = []
                  this.subitems.rem
                } else {
                  const index = this.subMesTypes.findIndex(
                    (x) => x.id == this.subMesType.id
                  )
                  if (index != -1) {
                    this.$set(this.subMesTypes, index, this.subMesType)
                  }
                }
                this.subMesType = {}
                this.$message({ message: '保存成功', type: 'success' })
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
    // 删除分类
    deleteSubMesType(node, data) {
      apiSettings.GetSubMessageList(data.id).then((res) => {
        if (res.code == 200 && res.returnStatus == 1) {
          if (res.result.length) {
            this.$message.error('不能删除，因为当前分类存在子项')
          } else {
            this.$confirm('确定要删除吗？', '询问', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            })
              .then((r) => {
                return apiSettings.DeleteSubMesType(data.id)
              })
              .then((ires) => {
                if (ires.code == 200 && ires.returnStatus == 1) {
                  this.loadData()
                }
              })
              .catch((err) => {
                this.$message.error(JSON.stringify(err))
              })
          }
        }
      })
    },
    // 打开添加/编辑子项的对话框 (编辑时第2个参数代表index, 第3个参数代表row)
    openSubMessageDialog(isAdd, node, data) {
      this.isAddItemDialog = isAdd
      this.itemIndex = node // 修改时node参数为索引(用于更新对应元素)
      if (isAdd) {
        this.subMessage.id = '' // 后端提供uuid值
        this.subMessage.parentId = data.id
        this.subMessage.fNumber = ''
        this.subMessage.fName = ''
        this.subMessage.isCancalelation = 0
        this.subMessage.fIndex = 100
        this.subMessage.fNote = ''
      } else {
        this.subMessage = data // 行数据
      }
      this.visibleItemForm = true
    },
    // 确认(保存）新增/修改子项
    confirmSubMessage(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          apiSettings.SaveSubMessage(this.subMessage).then((res) => {
            if (res.code == 200 && res.returnStatus == 1) {
              this.visibleItemForm = false
              // 若是添加
              if (this.isAddItemDialog) {
                this.subMessage.id = res.result.identityKey
                this.subitems.push(this.subMessage)
              } else {
                this.$set(this.subitems, this.itemIndex, this.subMessage)
              }
              this.$message({ message: '操作成功', type: 'success' })
            }
          })
        } else {
          return false
        }
      })
    },
    // 当前选中节点变化时触发的事件
    currentChange(data, node) {
      this.subMesType = data
      // 显示当前节点下的子项
      apiSettings.GetSubMessageList(this.subMesType.id).then((res) => {
        if (res.code == 200 && res.returnStatus == 1) {
          this.subitems = res.result
        }
      })
    },
    // 删除子项
    deleteSubMessage(index, row) {
      this.$confirm('确定要删除吗？', '询问', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      })
        .then((s) => {
          return apiSettings.DeleteSubMessage(row.id)
        })
        .then((res) => {
          if (res.code == 200 && res.returnStatus == 1) {
            this.subitems.splice(index, 1)
            this.$message({ message: '删除成功', type: 'success' })
          } else {
            this.$message.error(JSON.stringify(res.result))
          }
        })
        .catch((err) => {
          this.$message.error(JSON.stringify(err))
        })
    }
  }
}
</script>

<style lang='less' scoped>
.app-container {
  margin: 12px;
}
.custom-tree-node {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  padding-right: 8px;
}
.el-button--text {
  border-color: transparent;
  color: #409eff;
  background: transparent;
  padding-left: 0;
  padding-right: 0;
}
.btngroup {
  padding: 10px;
  .btnadd{
    margin-right: 2px;
  }
}
.aside {
  background-color: #fff;
  margin-top: 10px;
}
</style>
