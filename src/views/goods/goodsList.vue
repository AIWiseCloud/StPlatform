<template>
  <div class="container">
    <el-card>
      <el-row :gutter="10">
        <el-col :span="8">
          <el-input
            v-model="queryInfo.queryValue"
            placeholder="请输入内容"
            clearable
            @keyup.enter.native="searchGoods"
            ><el-button
              slot="append"
              icon="el-icon-search"
              style="
                background: rgb(24, 144, 255);
                color: white;
                border: 1px solid rgb(24, 144, 255);
              "
              @click="searchGoods"
          /></el-input>
        </el-col>
        <el-col :span="4">
          <el-cascader
            ref="goodscate"
            v-model="queryInfo.queryValue"
            :options="allCategories"
            :show-all-levels="false"
            multipe="false"
            placeholder="选择商品分类"
            :props="{
              label: 'categoryName',
              value: 'categoryId',
              checkStrictly: 'false',
            }"
            @change="searchGoods2"
          />
        </el-col>
        <el-col :span="12">
          <el-button
            plain
            icon="el-icon-download"
            size="mini"
            @click="exportExcel"
            >下载报价</el-button
          >
          <el-button
            plain
            icon="el-icon-upload2"
            size="mini"
            @click="openUploadDialog"
            >上传报价</el-button
          >
          <el-button
            plain
            icon="el-icon-setting"
            size="mini"
            @click="openExplain"
            >更新说明</el-button
          >
          <el-button
            plain
            icon="el-icon-printer"
            size="mini"
            @click="printQuotes(1)"
            >预览报价</el-button
          >
          <el-button
            plain
            icon="el-icon-document"
            size="mini"
            @click="printQuotes(0)"
            >调整格式</el-button
          >
        </el-col>
      </el-row>
      <!-- 商品列表 -->
      <el-table
        v-infinite-scroll="loadData"
        class="goodslist"
        :data="goodsList"
        style="width: 100%; overflow: auto"
        border
        stripe
        empty-text="暂无数据"
        size="mini"
        :header-cell-style="{ 'text-align': 'center', background: '#F3F4F7' }"
      >
        <!-- <el-table-column type="index" label="#" /> -->
        <el-table-column label="商品ID" width="140" prop="goodsId" />
        <el-table-column label="商品名称" width="120" prop="goodsName" />
        <el-table-column label="品牌" width="60" prop="brand" />
        <el-table-column label="基本单位" width="70" prop="unitName" />
        <el-table-column label="单价" width="70" prop="baseUnitPrice" />
        <el-table-column
          label="销售单位"
          width="70"
          prop="goodsSpecs[0].saleUnit"
        />
        <el-table-column label="配比" width="70" prop="mixture" />
        <el-table-column label="商品描述" prop="goodsDesc" />
        <el-table-column label="销量" prop="salesTimes" width="60" />
        <el-table-column label="分类" prop="categoryId" width="60" />
        <el-table-column
          label="分组排序"
          prop="groupDisplayOrder"
          width="70"
        ></el-table-column>
        <!-- <el-table-column
          label="推荐商品"
          width="70"
        ><template
          slot-scope="scope"
        ><el-switch
          v-model="scope.row.isRecommend"
          active-color="rgb(55,55,55)"
          :active-value="1"
          :inactive-value="0"
          disabled
        /></template></el-table-column> -->
        <el-table-column label="最新商品" width="70"
          ><template slot-scope="scope">
            <el-switch
              v-model="scope.row.isNew"
              active-color="rgb(55,55,55)"
              :active-value="1"
              :inactive-value="0"
              disabled
          /></template>
        </el-table-column>
        <el-table-column label="是否发布" prop="isUnder" width="70"
          ><template slot-scope="scope"
            ><el-switch
              v-model="scope.row.isUnder"
              active-color="rgb(55,55,55)"
              :active-value="0"
              :inactive-value="1"
              disabled /></template
        ></el-table-column>
        <el-table-column label="操作" width="120">
          <template slot="header">
            <el-button
              type="primary"
              size="mini"
              icon="el-icon-plus"
              @click="goGoodsInfo($common.getDigitSerial(), 1)"
              >添加</el-button
            >
          </template>
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="primary"
              icon="el-icon-edit"
              round
              @click="goGoodsInfo(scope.row.goodsId, 0)"
            />
            <el-button
              size="mini"
              type="danger"
              icon="el-icon-delete"
              round
              @click="deleteGoodsInfo(scope.row.goodsId, scope.$index)"
            />
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        background
        layout="total, prev, pager, next"
        :total="queryInfo.totalCount"
        :current-page.sync="queryInfo.pageModel.pageNo"
        :page-size="queryInfo.pageModel.pageSize"
        @current-change="loadData"
      />
    </el-card>
    <!-- 更新报价说明对话框 -->
    <el-dialog title="更新报价说明" :visible.sync="dialogexplain">
      <el-form :model="quoteExplain" label-width="92px" size="mini">
        <el-form-item label="生效日期">
          <el-date-picker
            v-model="quoteExplain.effectiveDate"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="选择生效日期"
          />
        </el-form-item>
        <el-form-item label="报价说明">
          <el-input
            v-model="quoteExplain.quoteDesc"
            type="textarea"
            :rows="4"
          />
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="quoteExplain.remark" type="textarea" :rows="4" />
        </el-form-item>
        <el-form-item label="报价员">
          <el-input v-model="quoteExplain.creator" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="danger" size="mini" @click="updateExplain"
          >更新</el-button
        >
        <el-button size="mini" @click="dialogexplain = false"> 取消 </el-button>
      </div>
    </el-dialog>
    <!-- 文件上传对话框 -->
    <el-dialog title="上传商品价格列表" :visible.sync="visibleupload">
      <div class="main">
        <el-upload
          ref="uploadExcel"
          action=""
          :auto-upload="false"
          accept=".xlsx"
          :on-change="handleChange"
          :file-list="fileList"
        >
          <el-button size="small" plain>选择文件</el-button>
          <div slot="tip" class="el-upload__tip">
            只能上传xlsx文件，且不超过10M
          </div>
        </el-upload>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button
          type="danger"
          size="mini"
          @click="updatePrice"
          :disabled="excelData.length == 0"
        >
          完成更新
        </el-button>
        <el-button size="mini" @click="visibleupload = false"> 取消 </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import apiGoods from "@/api/goods";
import apiReport from "@/api/report";
import openwindow from "@/utils/open-window.js";
import ExportJsonExcel from "js-export-excel";
export default {
  name: "Goodslist",
  data() {
    return {
      queryInfo: {
        queryScheme: 0, // 0表示按关键字搜索
        hideUnderGoods: 0, // 不隐藏下架商品
        queryValue: "", // 查询值
        pageModel: {
          pageNo: 1,
          pageSize: 20,
          orderField: "categoryId,groupDisplayOrder,GoodsName",
          orderWay: "",
        },
        totalCount: 0,
      },
      goodsList: [],
      allCategories: [], // 商品所有分类
      dialogexplain: false,
      quoteExplain: {
        id: "",
        updateDate: "",
        effectiveDate: "",
        quoteDesc: "",
        remark: "",
        creator: "",
      },
      visibleupload: false,
      fileList: [],
      file: "",
      excelData: [],
    };
  },
  created() {
    // 载入商品分类
    apiGoods.GetGoodsCategories("*").then((res) => {
      if (res.code == 200 && res.returnStatus == 1) {
        this.allCategories = res.result;
      }
    });
  },
  methods: {
    goGoodsInfo(id, isnew) {
      this.$router.push({
        name: "goodsInfo",
        params: { goodsId: id, isNew: isnew },
      });
    },
    // 分页加载数据
    loadData() {
      apiGoods.QueryGoods(this.queryInfo).then((res) => {
        if (res.code == 200 && res.returnStatus == 1) {
          // console.log(JSON.stringify(res.result))
          const { totalCount, items } = res.result;
          this.queryInfo.totalCount = totalCount;
          this.goodsList = items;
        } else {
          this.$message.error(res.msg);
        }
      });
    },
    // 商品搜索
    searchGoods() {
      // 初始化搜索
      this.queryInfo.queryScheme = 0;
      this.queryInfo.pageModel.pageNo = 1;
      this.queryInfo.pageModel.pageSize = 20;
      this.queryInfo.totalCount = 0;
      this.goodsList = [];
      this.loadData();
    },
    // 商品分类搜索
    searchGoods2() {
      this.$refs.goodscate.dropDownVisible = false; // 关闭选择框
      if (Array.isArray(this.queryInfo.queryValue)) {
        this.queryInfo.queryValue = this.queryInfo.queryValue[0];
      }
      // 初始化搜索
      this.queryInfo.queryScheme = 1;
      this.queryInfo.pageModel.pageNo = 1;
      this.queryInfo.pageModel.pageSize = 20;
      this.queryInfo.totalCount = 0;
      this.goodsList = [];
      this.loadData();
    },
    // 删除记录(连同附表)
    deleteGoodsInfo(goodsId, index) {
      this.$confirm("确定要删除吗？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
      }).then((r) => {
        apiGoods.DeleteGoodsInfo(goodsId).then((res) => {
          if (res.code == 200 && res.returnStatus == 1) {
            if (res.result.status) {
              this.$message.success("删除成功");
              this.goodsList.splice(index, 1);
            } else {
              this.$message.error(res.result.errorMsg);
            }
          } else {
            this.$message.error(res.msg);
          }
        });
      });
    },
    // 打印预览
    printQuotes(isPreview) {
      apiGoods.GetGoodsQuotes().then((res) => {
        if (res.code == 200 && res.returnStatus == 1) {
          // console.log(JSON.stringify(res.result))
          const data = {
            reportId: "002",
            billId: "QE01",
            source: res.result,
          };
          apiReport
            .StringSaveAsJsonFile(data)
            .then((res2) => {
              if (
                res2.code == 200 &&
                res2.returnStatus == 1 &&
                res2.result.status
              ) {
                // 返回的id作为调用报表的参数
                openwindow(
                  this.$common.REPORT_URL +
                    `${isPreview == 1 ? "preview" : "design"}?id=${
                      res2.result.id
                    }`
                );
              } else {
                this.$message.error(res2.msg);
              }
            })
            .catch((err) => {
              console.log(err);
            });
        }
      });
    },
    // 更新报价说明
    updateExplain() {
      apiGoods.UpdateQuoteExplain(this.quoteExplain).then((res) => {
        if (res.code == 200 && res.returnStatus == 1) {
          this.$message.success("更新成功!");
          this.dialogexplain = false;
        } else {
          this.$message.error(res.msg);
        }
      });
    },
    // 打开更新对话框
    openExplain() {
      apiGoods.GetGoodsQuotes().then((res) => {
        if (res.code == 200 && res.returnStatus == 1) {
          this.quoteExplain = res.result.quoteTitle;
          this.dialogexplain = true;
        } else {
          this.$message.error(res.msg);
        }
      });
    },
    //下载模板
    async exportExcel() {
      let arr = [];
      let dataTable = [];
      let option = {}; //Excel文件
      option.fileName = "材料价格表上传模板";
      await apiGoods.GetAllGoodsInfo().then((res) => {
        if (res.code == 200 && res.returnStatus == 1) {
          arr = res.result;
        }
      });
      if (arr.length == 0) {
        return this.$message.error("没有获取到材料数据");
      }

      for (let i of arr) {
        dataTable.push({
          商品ID: i.goodsId,
          商品类别: i.categoryId,
          商品名称: i.goodsName,
          配比: i.mixture,
          品牌: i.brand,
          基本单位: i.unitName,
          基本单价: i.baseUnitPrice,
          折扣单价: i.discountUnitPrice,
        });
      }
      let columns = Object.keys(dataTable[0]);
      option.datas = [
        {
          sheetData: dataTable,
          sheetName: "sheet",
          sheetHeader: columns,
          sheetFilter: columns,
        },
      ];
      let toExcel = new ExportJsonExcel(option);
      toExcel.saveExcel();
    },
    //打开上传对话框
    openUploadDialog() {
      this.visibleupload = true;
    },
    //选择excel文件上传
    handleChange(file, fileList) {
      let that = this;
      this.fileList = [fileList[fileList.length - 1]]; // 只能上传一个Excel，重复上传会覆盖之前的
      this.file = file.raw;
      let reader = new FileReader();
      let _this = this;
      reader.readAsArrayBuffer(this.file);
      reader.onload = function () {
        let buffer = reader.result;
        let bytes = new Uint8Array(buffer);
        let length = bytes.byteLength;
        let binary = "";
        for (let i = 0; i < length; i++) {
          binary += String.fromCharCode(bytes[i]);
        }
        let XLSX = require("xlsx");
        let wb = XLSX.read(binary, {
          type: "binary",
        });
        that.excelData = XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]]); //一定要用that呀
        // console.log(that.excelData); //打印解析到的数据
      };
    },
    //批量更新（完成上传)
    updatePrice() {
      if (!this.excelData.length) {
        return this.$message.error("没有Excel上传的解析数据");
      }
      let arr = [];
      //要符合后端模型验证要求，非空字段即使更新不需要也得有
      for (let k of this.excelData) {
        arr.push({
          goodsId: k.商品ID,
          categoryId: k.商品类别,
          goodsName: k.商品名称,
          mixture: k.配比,
          brand: k.品牌,
          unitName: k.基本单位,
          baseUnitPrice: k.基本单价,
          discountUnitPrice: k.折扣单价,
        });
      }
      // console.log(JSON.stringify(arr)); //打印参数
      apiGoods.BatchUpdatePrice(arr).then((res) => {
        if (res.code == 200 && res.returnStatus == 1) {
          this.$message.success("成功完成批量更新");
          this.visibleupload = false;
        } else {
          this.$message.error(res.msg);
        }
      });
    },
  },
};
</script>

<style lang="less" scoped>
.container {
  margin: 10px;
}
.goodslist {
  margin-top: 10px;
}
</style>
