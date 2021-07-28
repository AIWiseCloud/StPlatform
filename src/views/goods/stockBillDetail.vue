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
          :disabled="!isEditStatus"
          >返回</el-button
        >
      </el-button-group>
      <!-- 单据区 -->
      <!-- 单据头 -->
      <el-form
        v-model="stockBillData"
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
            <el-form-item label="业务类型">
              <el-select
                v-model="stockBillData.transTypeId"
                size="mini"
                placeholder="选择交易类型"
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
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <!-- 出入库明细列表 -->
        <el-table
          :data="stockBillData.stockBillDetails"
          size="mini"
          border
          :header-cell-style="{ background: '#F3F4F7', 'text-align': 'center' }"
          empty-text="无数据"
        >
          <el-table-column
            label="序号"
            prop="fIndex"
            width="60"
          ></el-table-column>
          <el-table-column
            label="商品ID"
            prop="goodsId"
            v-if="false"
          ></el-table-column>
          <el-table-column
            label="商品名称"
            prop="goodsInfo.goodsName"
          ></el-table-column>

          <el-table-column
            label="颜色"
            prop="colorInfo.fName"
          ></el-table-column>
          <el-table-column label="规格" prop="spec.fName"></el-table-column>
          <el-table-column
            label="仓库"
            prop="stock.fName"
            width="120"
          ></el-table-column>
          <el-table-column
            label="单位"
            prop="goodsInfo.unitName"
            width="80"
          ></el-table-column>
          <el-table-column
            label="数量"
            prop="quantity"
            width="80"
          ></el-table-column>
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
              <el-button type="danger" size="mini" icon="el-icon-delete"
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
import common from "@/utils/common";
export default {
  data() {
    return {
      isAddBill: false,
      visibleSelectDialog: false,
      transTypes: [],
      isEditStatus: 0, //单据是否处于编辑状态
      //单据实体
      stockBillData: {
        billId: "",
        Creator: "",
        transTypeId: "",
        billState: 0,
        Remark: "",
        stockBillDetails: [
          {
            fIndex: 100,
            isNew: 0,
            goodsId: "",
            goodsInfo: {
              goodsId: "21072410202072",
              goodsName: "底漆",
              unitName: "桶",
            },
            transTypeId: "transtype_othout",
            transType: {
              fNumber: "transtype_othout",
              fName: "其他入库",
            },
            stockNumber: "stock_st",
            stock: {
              fNumber: "stock_st",
              fName: "电商仓",
            },
            colorId: "",
            colorInfo: {
              fNumber: "red",
              fName: "红",
            },
            specId: "",
            spec: {
              fNumber: "spec",
              fName: "30公斤",
            },
            quantity: 2000,
          },
        ],
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
      selectList: [
        // { check: false, specName: "15KG/桶", colorName: "红色", price: 50.0 },
        // { check: false, specName: "15KG/桶", colorName: "黄色", price: 50.0 },
        // { check: false, specName: "15KG/桶", colorName: "蓝色", price: 50.0 },
      ],
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
          // console.log(JSON.stringify(res.result))
          let arr = [];
          for (let i of res.result.goodsSpecs) {
            for (let j of res.result.goodsColors) {
              arr.push({
                check: false,
                goodsInfo: res.result,
                spec: i.spec,
                specName: i.spec.fName,
                colorInfo: j.colorInfo,
                colorName: j.colorInfo.fName,
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
      console.log(e);
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
      if (!this.canModify) {
        return this.$message({
          message: "当前单据所在状态禁止修改!",
          type: "error",
        });
      }
      //默认带入到单据行中的信息
      let defaultInfo = {
        fIndex: 100,
        isNew: 1,
        transTypeId: "transtype_othout",
        transType: {
          fNumber: "transtype_othout",
          fName: "其他入库",
        },
        stockNumber: "stock_st",
        stock: {
          fNumber: "stock_st",
          fName: "电商仓",
        },
        quantity: 0,
      };
      for (let i of selects) {
        this.stockBillData.stockBillDetails.push({
          id: this.$common.guid(),
          ...i,
          ...defaultInfo,
        });
      }
      //添加一下序号
      for (let i in this.stockBillData.stockBillDetails) {
        this.stockBillData.stockBillDetails[i].fIndex = Number.parseInt(i) + 1;
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
      this.stockBillData.stockBillDetails = [];
      this.isEditStatus = true;
    },
    //新增
    newBill() {
      //产生新单号并修改路由参数中的单号
      let newId = "W" + common.getDigitSerial();
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
      this.isEditStatus = false;
    },
    //审核
    auditBill() {},
    //反审
    cancelAuditBill() {},
    //删除
    deleteBill() {},
  },
  beforeMount() {
    this.isAddBill = this.$route.params.isNew;
    let billId = this.$route.params.billId;
    if (this.isAddBill) {
      this.initialBill(billId);
    }
    //从api获取单据完整信息
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
  },
  computed: {
    //当前单据能否修改
    canModify() {
      return this.stockBillData.billState == 0;
    },
    //按钮状态
    buttonStatus() {
      return {
        new: !this.isEditStatus,
        edit: !this.isEditStatus && this.stockBillData.billState == 0,
        save: this.isEditStatus,
        audit: !this.isEditStatus && this.stockBillData.billState == 0,
        cancel: this.stockBillData.billState == 1,
        delete: !this.isEditStatus && this.stockBillData.billState == 0,
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