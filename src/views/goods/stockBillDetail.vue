<template>
  <div class="container">
    <el-card>
      <!-- 警告提示区域 -->
      <el-alert
        :title="(isAddBill ? '添加' : '编辑') + '库存单据'"
        type="info"
        center
        show-icon
        :closable="false"
      />
      <!-- 操作按钮 -->
      <el-button-group class="btngroup">
        <el-button
          class="btn"
          plain
          icon="el-icon-plus"
          size="mini"
          :disabled="!buttonStatus.new"
          @click="newBill"
          >新增</el-button
        >
        <el-button
          class="btn"
          plain
          icon="el-icon-edit"
          size="mini"
          :disabled="!buttonStatus.edit"
          @click="editBill"
          >修改</el-button
        >
        <el-button
          class="btn"
          plain
          icon="el-icon-folder"
          size="mini"
          @click="saveBill"
          :disabled="!buttonStatus.save"
          >保存</el-button
        >
        <el-button
          class="btn"
          plain
          icon="el-icon-top-left"
          size="mini"
          @click="cancelEdit"
          :disabled="!buttonStatus.cancelEdit"
          >取消</el-button
        >
        <el-button
          class="btn"
          plain
          icon="el-icon-check"
          size="mini"
          @click="auditBill"
          :disabled="!buttonStatus.audit"
          >审核</el-button
        >
        <el-button
          class="btn"
          plain
          icon="el-icon-minus"
          size="mini"
          @click="cancelAuditBill"
          :disabled="!buttonStatus.cancel"
          >反审</el-button
        >
        <el-button
          class="btn"
          type="danger"
          plain
          icon="el-icon-delete"
          size="mini"
          @click="deleteBill"
          :disabled="!buttonStatus.delete"
          >删除</el-button
        >
        <el-button
          class="btn"
          type="default"
          plain
          icon="el-icon-back"
          size="mini"
          @click="$router.go(-1)"
          :disabled="isEditStatus"
          >返回</el-button
        >
      </el-button-group>
      <!-- 单据区 -->
      <!-- 单据头 -->
      <el-form
        :model="stockBillData"
        ref="billform"
        :rules="billrules"
        label-position="right"
        label-width="92px"
      >
        <el-row :gutter="10">
          <el-col :sm="12" :md="8" :lg="8" :xl="8">
            <el-form-item label="交易单号">
              <el-tag type="sucess">{{ stockBillData.billId }}</el-tag>
            </el-form-item>
          </el-col>
          <el-col :sm="12" :md="8" :lg="8" :xl="8">
            <el-form-item label="业务类型" prop="transTypeId">
              <el-select
                v-model="stockBillData.transTypeId"
                size="mini"
                placeholder="选择交易类型"
                :disabled="!isEditStatus"
              >
                <el-option
                  v-for="item in transTypes"
                  :key="item.fNumber"
                  :value="item.fNumber"
                  :label="item.fName"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :sm="12" :md="8" :lg="8" :xl="8">
            <el-form-item label="备注">
              <el-input
                v-model="stockBillData.remark"
                placeholder="请输入备注"
                :disabled="!isEditStatus"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <!-- 出入库明细列表 -->
        <el-table
          :data="stockBillData.stockBillDetail"
          size="mini"
          border
          :header-cell-style="{ background: '#F3F4F7', 'text-align': 'center' }"
          empty-text="无数据"
        >
          <el-table-column label="序号" :width="isEditStatus ? 120 : 60">
            <template scope="scope">
              <el-input
                v-if="isEditStatus"
                v-model="scope.row.fIndex"
                type="number"
              ></el-input>
              <span v-else>{{ scope.row.fIndex }}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="商品名称"
            prop="goodsInfo.goodsName"
          ></el-table-column>
          <el-table-column
            label="颜色"
            prop="colorInfo.colorName"
          ></el-table-column>
          <el-table-column label="规格" prop="spec.specName"></el-table-column>
          <el-table-column label="仓库" width="140">
            <template scope="scope">
              <el-select v-if="isEditStatus" v-model="scope.row.stockNumber">
                <el-option
                  v-for="(item, i) in stocks"
                  :key="i"
                  :label="item.fName"
                  :value="item.fNumber"
                ></el-option>
              </el-select>
              <span v-else>{{ scope.row.stock.stockName }}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="单位"
            prop="goodsInfo.unitName"
            width="80"
          ></el-table-column>
          <el-table-column label="数量" prop="quantity" width="120">
            <template scope="scope">
              <el-input
                type="number"
                v-if="isEditStatus"
                v-model="scope.row.quantity"
              ></el-input>
              <span v-else>{{ scope.row.quantity }}</span>
            </template>
          </el-table-column>
          <el-table-column width="120">
            <template slot="header">
              <el-button
                type="primary"
                size="mini"
                plain
                @click="visibleSelectDialog = true"
                :disabled="!isEditStatus"
                >选择商品</el-button
              >
            </template>
            <template slot-scope="scope">
              <el-button
                type="danger"
                size="mini"
                icon="el-icon-delete"
                v-if="isEditStatus && stockBillData.billState == 0"
                @click="deleteRow(scope.$index, scope.row.id)"
                >删除行</el-button
              >
            </template>
          </el-table-column>
        </el-table>
      </el-form>

      <!-- 商品选择对话框 -->
      <el-dialog title="选择具体商品" :visible.sync="visibleSelectDialog">
        <el-container>
          <el-aside width="240px">
            <el-cascader
              ref="goodscate"
              :options="goodsCategories"
              :show-all-levels="false"
              multipe="false"
              size="mini"
              placeholder="选择商品类别"
              :props="{
                label: 'categoryName',
                value: 'categoryId',
                checkStrictly: 'false',
              }"
              @change="categoryChange"
            ></el-cascader>
            <div
              v-for="(item, i) in goodsList"
              :key="i"
              class="goodscate"
              @click="goodshandle(i)"
            >
              <img :src="$common.getBaseURL() + item.imgUrl" />
              <div class="desc">{{ item.goodsName }}</div>
            </div>
          </el-aside>
          <el-main>
            <el-table
              :data="selectList"
              border
              size="mini"
              :header-cell-style="{
                background: '#F3F4F7',
                'text-align': 'center',
              }"
            >
              <el-table-column width="40">
                <template slot="header">
                  <el-checkbox
                    v-model="checkAll"
                    @change="changecheckall"
                  ></el-checkbox>
                </template>
                <template slot-scope="scope">
                  <el-checkbox v-model="scope.row.check"></el-checkbox>
                </template>
              </el-table-column>
              <el-table-column label="规格" prop="specName"></el-table-column>
              <el-table-column label="颜色" prop="colorName"></el-table-column>
              <el-table-column label="售价" prop="price"></el-table-column>
            </el-table>
          </el-main>
        </el-container>
        <div slot="footer" class="dialog-footer">
          <el-button size="mini" @click="visibleSelectDialog = false"
            >取消</el-button
          >
          <el-button
            type="primary"
            size="mini"
            :disabled="!selectList.length"
            @click="confirmSelect"
            >确定</el-button
          >
        </div>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
import apiGoods from "@/api/goods";
import apiSettings from "@/api/settings";
import apiInventory from "@/api/inventory";
export default {
  name: "stockBillDetail",
  data() {
    return {
      isAddBill: false,
      visibleSelectDialog: false,
      transTypes: [], //交易类型
      stocks: [], //仓库列表
      isEditStatus: true, //单据是否处于编辑状态
      //单据实体
      stockBillData: {
        billId: "",
        Creator: "",
        transTypeId: "",
        billState: 0,
        Remark: "",
        stockBillDetail: [],
      },
      //验证实体
      billrules: {
        billId: {
          required: true,
          message: "交易单号不能为空",
          trigger: "blur",
        },
        transTypeId: {
          required: true,
          message: "交易类型不能为空",
          trigger: "blur",
        },
      },
      //某最小类别下的goods列表
      goodsList: [],
      //选择列表
      selectList: [],
      //所有商品分类(用于商品选择)
      goodsCategories: [],
      checkAll: false,
    };
  },
  methods: {
    //保存单据
    submitBill(ruleform) {
      this.$refs[ruleform].validate((valid) => {
        if (valid) {
          console.log("通过了");
        } else {
          return false;
        }
      });
    },

    //选择商品类别
    categoryChange(selarr) {
      if (selarr) {
        apiGoods
          .GetGoodsInfoOverviews(selarr[selarr.length - 1])
          .then((res) => {
            if (res.code == 200 && res.returnStatus == 1) {
              this.goodsList = res.result;
              this.$refs.goodscate.dropDownVisible = false; //关闭选择框
            }
          });
      }
    },
    //点选对话框左侧商品
    goodshandle(index) {
      let goodsId = this.goodsList[index].goodsId;
      this.checkAll = false;
      apiGoods.GetGoodsInfo(goodsId).then((res) => {
        if (res.code == 200 && res.returnStatus == 1) {
          let arr = [];
          for (let i of res.result.goodsSpecs) {
            for (let j of res.result.goodsColors) {
              arr.push({
                check: false,
                goodsId: res.result.goodsId,
                goodsInfo: res.result,
                specId: i.specId,
                spec: i.spec,
                specName: i.spec.specName,
                colorId: j.colorId,
                colorInfo: j.colorInfo,
                colorName: j.colorInfo.colorName,
                price: i.price,
              });
            }
          }
          this.selectList = arr;
        }
      });
    },
    //全选/全清
    changecheckall(e) {
      // console.log(e);
      this.selectList.forEach((p) => (p.check = e));
    },
    //确定选取勾选的商品到单据
    confirmSelect() {
      let selects = this.selectList.filter((x) => x.check);
      if (selects.length == 0) {
        return this.$message({
          message: "请选择要加入的项目后再确定!",
          type: "info",
        });
      }
      //默认带入到单据行中的信息
      let defaultInfo = {
        billId: this.stockBillData.billId,
        fIndex: 100,
        isNew: 1,
        stockNumber: "stock_st",
        stock: {
          stockNumber: "stock_st",
          stockName: "电商仓",
        },
        quantity: 0,
      };
      for (let i of selects) {
        this.stockBillData.stockBillDetail.push({
          id: this.$common.guid(),
          ...i,
          ...defaultInfo,
        });
      }
      //添加一下序号
      for (let i in this.stockBillData.stockBillDetail) {
        this.stockBillData.stockBillDetail[i].fIndex = Number.parseInt(i) + 1;
      }
      this.visibleSelectDialog = false;
    },
    //初始化单据
    initialBill(newBillId) {
      this.stockBillData.billId = newBillId;
      this.stockBillData.Creator = "";
      this.stockBillData.transTypeId = "";
      this.stockBillData.billState = 0;
      this.stockBillData.Remark = "";
      this.stockBillData.stockBillDetail = [];
      this.isEditStatus = true;
    },
    //新增
    newBill() {
      //产生新单号并修改路由参数中的单号
      let newId = "W" + this.$common.getDigitSerial();
      this.$router.replace({
        name: "stockBillDetail",
        params: { isNew: true, billId: newId },
      });
      this.initialBill(newId);
    },
    //修改
    editBill() {
      this.isEditStatus = true;
    },
    //保存
    saveBill() {
      // console.log(JSON.stringify(this.stockBillData));
      if (this.stockBillData.stockBillDetail.length == 0) {
        return this.$message.error("请添加商品!");
      }
      for (let i of this.stockBillData.stockBillDetail) {
        if (i.quantity == 0) {
          return this.$message.warning(`出入库数量不能为0！`);
        }
      }

      //去掉不必要跟随提交的数据
      let data = JSON.parse(JSON.stringify(this.stockBillData));
      data.goodsColors = [];
      data.goodsSpecs = [];
      data.stockBillDetail.map((x) => (x.stock = null));
      //验证并提交
      this.$refs.billform.validate((valid) => {
        if (valid) {
          apiInventory.SaveStockBill(data).then((res) => {
            if (res.code == 200 && res.returnStatus == 1) {
              this.isEditStatus = false;
              this.$message({ message: "保存成功", type: "success" });
            } else {
              this.$message.error(JSON.stringify(res.msg));
            }
          });
        } else {
          return false;
        }
      });
    },
    cancelEdit() {
      this.isEditStatus = false;
    },
    //审核
    auditBill() {
      apiInventory.AuditStockBill(this.stockBillData.billId, 1).then((res) => {
        if (res.code == 200 && res.returnStatus == 1 && res.result.status) {
          this.stockBillData.billState = 1;
        } else {
          this.$message.error("审核失败" + JSON.stringify(res.msg));
        }
      });
    },
    //反审
    cancelAuditBill() {
      apiInventory.AuditStockBill(this.stockBillData.billId, 0).then((res) => {
        if (res.code == 200 && res.returnStatus == 1 && res.result.status) {
          this.stockBillData.billState = 0;
        } else {
          this.$message.error("反审核失败" + JSON.stringify(res.msg));
        }
      });
    },
    //删除行
    deleteRow(index, id) {
      apiInventory.DeleteStockBillRow(id).then((res) => {
        if (res.code == 200 && res.returnStatus == 1 && res.result) {
          this.stockBillData.stockBillDetail.splice(index, 1);
        } else {
          this.$message.error(JSON.stringify(res.msg));
        }
      });
    },
    //删除
    deleteBill() {
      this.$confirm("确定要删除吗？", "询问", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
      }).then((r) => {
        apiInventory.DeleteStockBill(this.stockBillData.billId).then((res) => {
          if (res.code == 200 && res.returnStatus == 1) {
            this.$message({ message: "删除成功!", type: "success" });
            this.$router.go(-1);
          } else {
            this.$message.error(JSON.stringify(res.msg));
          }
        });
      });
    },
  },
  beforeMount() {
    this.isAddBill = this.$route.params.isNew;
    let billId = this.$route.params.billId;
    if (this.isAddBill) {
      this.initialBill(billId);
    } else {
      apiInventory.GetStockBill(billId).then((res) => {
        if (res.code == 200 && res.returnStatus == 1) {
          this.stockBillData = res.result;
          this.isEditStatus = false;
        }
      });
    }
  },
  created() {
    //交易类型
    apiSettings.GetSubMessageList("transtype").then((res) => {
      if (res.code == 200 && res.returnStatus == 1) {
        this.transTypes = res.result;
      }
    });
    //商品分类
    apiGoods.GetGoodsCategories("*").then((res) => {
      if (res.code == 200 && res.returnStatus == 1) {
        this.goodsCategories = res.result;
      }
    });
    //仓库列表
    apiSettings.GetSubMessageList("stock").then((res) => {
      if (res.code == 200 && res.returnStatus == 1) {
        this.stocks = res.result;
      }
    });
  },
  computed: {
    //按钮状态
    buttonStatus() {
      return {
        new: !this.isEditStatus,
        edit:
          !this.isEditStatus &&
          this.stockBillData &&
          this.stockBillData.billState == 0,
        save: this.isEditStatus,
        cancelEdit: this.isEditStatus,
        audit:
          !this.isEditStatus &&
          this.stockBillData &&
          this.stockBillData.billState == 0,
        cancel: this.stockBillData && this.stockBillData.billState == 1,
        delete:
          !this.isEditStatus &&
          this.stockBillData &&
          this.stockBillData.billState == 0,
      };
    },
  },
};
</script>

<style lang="less" scoped>
@import "~@/styles/common.less";
.btngroup {
  margin: 10px auto;
  .btn {
    margin-right: 2px;
  }
}
.goodscate {
  height: 60px;
  width: 100%;
  img {
    width: 50px;
    height: 50px;
    margin-right: 10px;
  }
  .desc {
    width: 140px;
    height: 50px;
    line-height: 24px;
    .overLines(2);
  }
  display: flex;
  align-items: center;
  justify-content: flex-start;
  &:hover {
    cursor: pointer;
    background-color: rgb(2220, 220, 220);
  }
}
</style>