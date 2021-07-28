<template>
  <div class="container">
    <el-card>
      <!-- 警告提示区域 -->
      <el-alert
        title="添加商品信息"
        type="info"
        center
        show-icon
        :closable="false"
      />
      <!-- 步骤条 -->
      <el-steps :space="200" :active="activeIndex - 0" finish-status="success">
        <el-step title="基本信息" />
        <el-step title="颜色及图片" />
        <el-step title="规格及价格" />
        <el-step title="商品介绍图" />
      </el-steps>

      <!-- tab区域 -->
      <el-tabs
        v-model="activeIndex"
        tab-position="left"
        :before-leave="beforeTabLeave"
      >
        <el-tab-pane label="基本信息" name="0">
          <el-form
            ref="goodsform"
            :model="goodsInfo"
            :rules="rules"
            class="demo-ruleForm"
            size="mini"
            label-width="100px"
            label-position="right"
          >
            <el-row>
              <el-col :span="12">
                <el-form-item label="商品ID" prop="goodsId">
                  <el-input
                    v-model="goodsInfo.goodsId"
                    disabled
                  /> </el-form-item
              ></el-col>
              <el-col :span="12">
                <el-form-item label="销售单位" prop="unitName">
                  <el-input v-model="goodsInfo.unitName" /> </el-form-item
              ></el-col>
            </el-row>
            <el-row>
              <el-col :span="8">
                <el-form-item label="商品类别" prop="categoryId">
                  <el-cascader
                    v-model="goodsInfo.categoryId"
                    :options="allCategories"
                    :show-all-levels="false"
                    multipe="false"
                    placeholder="选择所属分类"
                    :props="{
                      label: 'categoryName',
                      value: 'categoryId',
                      checkStrictly: 'false',
                    }"
                    change=""
                  />
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="产品编号" prop="prodNumber">
                  <el-input v-model="goodsInfo.prodNumber" />
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="销量" prop="salesTimes"
                  ><el-input v-model="goodsInfo.salesTimes" disabled
                /></el-form-item>
              </el-col>
            </el-row>
            <el-form-item label="商品名称" prop="goodsName">
              <el-input v-model="goodsInfo.goodsName" />
            </el-form-item>
            <el-form-item label="商品描述" prop="goodsDesc">
              <el-input v-model="goodsInfo.goodsDesc" />
            </el-form-item>
            <el-row>
              <el-col :sm="8" :md="8" :lg="8" :xl="8">
                <el-form-item label="推荐商品" prop="isRecommend"
                  ><el-switch
                    v-model="goodsInfo.isRecommend"
                    :active-value="1"
                    :inactive-value="0"
                /></el-form-item>
              </el-col>
              <el-col :sm="8" :md="8" :lg="8" :xl="8">
                <el-form-item label="最新商品" prop="isNew"
                  ><el-switch
                    v-model="goodsInfo.isNew"
                    :active-value="1"
                    :inactive-value="0"
                /></el-form-item>
              </el-col>
              <el-col :sm="8" :md="8" :lg="8" :xl="8">
                <el-form-item label="下架商品" prop="isUnder"
                  ><el-switch
                    v-model="goodsInfo.isUnder"
                    :active-value="1"
                    :inactive-value="0"
                /></el-form-item>
              </el-col>
            </el-row>
            <el-form-item>
              <el-button
                type="primary"
                icon="el-icon-check"
                plain
                @click="saveGoodsInfo('goodsform')"
                >保存</el-button
              >
            </el-form-item>
          </el-form>
        </el-tab-pane>
        <el-tab-pane label="颜色及图片" name="1">
          <el-table
            :data="goodsInfo.goodsColors"
            border
            :header-cell-style="{
              'text-align': 'center',
              background: '#F3F4F7',
            }"
            empty-text="暂无数据"
          >
            <el-table-column label="颜色" prop="colorId" width="60" />
            <!-- 动态创建四个色的模板，避免重复性工作 -->
            <el-table-column
              v-for="(item, i) in imgrow"
              :key="i"
              :label="item.label"
              :prop="item.imgfield"
            >
              <template slot-scope="scope">
                <el-image
                  :src="
                    scope.row[item.imgfield]
                      ? baseUrl + scope.row[item.imgfield]
                      : ''
                  "
                  :onerror="ErrorImg"
                  style="width: 80px; height: 80px"
                />
              </template>
            </el-table-column>
            <el-table-column label="排序" prop="findex" width="60" />
            <el-table-column label="日期" prop="createDate" />
            <el-table-column label="操作" width="160">
              <template slot="header">
                <el-button
                  type="success"
                  size="mini"
                  plain
                  icon="el-icon-plus"
                  @click="showColorDialog(true)"
                  >添加记录</el-button
                >
              </template>
              <template slot-scope="scope">
                <el-button
                  type="primary"
                  icon="el-icon-edit"
                  @click="showColorDialog(false, scope.$index, scope.row)"
                />
                <el-button
                  type="danger"
                  icon="el-icon-delete"
                  @click="deleteGoodsColor(scope.row.id)"
                />
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <!-- 规格及价格 -->
        <el-tab-pane label="规格及价格" name="2">
          <el-table
            :data="goodsInfo.goodsSpecs"
            border
            :header-cell-style="{
              'text-align': 'center',
              background: '#F3F4F7',
            }"
            empty-text="暂无数据"
          >
            <el-table-column type="index" label="#" />
            <el-table-column label="商品规格">
              <template scope="scope">
                <span v-if="scope.row.isSet">
                  <el-select
                    v-model="scope.row.specId"
                    size="mini"
                    placeholder="选择商品规格"
                  >
                    <el-option
                      v-for="item in specoptions"
                      :key="item.fNumber"
                      :label="item.fName"
                      :value="item.fNumber"
                    />
                  </el-select>
                </span>
                <span v-else>{{ scope.row.specId }}</span>
              </template>
            </el-table-column>
            <el-table-column label="单价">
              <template scope="scope">
                <span v-if="scope.row.isSet">
                  <el-input
                    v-model="scope.row.price"
                    type="number"
                    size="mini"
                  />
                </span>
                <span v-else>{{ scope.row.price }}</span>
              </template>
            </el-table-column>
            <el-table-column label="折扣价">
              <template scope="scope">
                <span v-if="scope.row.isSet">
                  <el-input
                    v-model="scope.row.discountPrice"
                    type="number"
                    size="mini"
                  />
                </span>
                <span v-else>{{ scope.row.discountPrice }}</span>
              </template>
            </el-table-column>
            <el-table-column label="排序">
              <template scope="scope">
                <span v-if="scope.row.isSet">
                  <el-input
                    v-model="scope.row.findex"
                    type="number"
                    size="mini"
                  />
                </span>
                <span v-else>{{ scope.row.findex }}</span>
              </template>
            </el-table-column>
            <el-table-column width="200">
              <template slot="header">
                <el-button
                  type="success"
                  plain
                  icon="el-icon-plus"
                  size="mini"
                  @click="addGoodsSpecRow"
                  >新增</el-button
                >
              </template>
              <template slot-scope="scope">
                <el-button
                  v-if="!scope.row.isSet"
                  type="primary"
                  plain
                  size="mini"
                  @click="editGoodsSpecRow(scope.row)"
                  >编辑</el-button
                >
                <el-button
                  v-else
                  type="primary"
                  plain
                  size="mini"
                  @click="saveGoodsSpecRow(scope.row)"
                  >保存</el-button
                >
                <el-button
                  v-if="!scope.row.isSet"
                  type="danger"
                  plain
                  size="mini"
                  @click="deleteGoodsSpecRow(scope.row)"
                  >删除</el-button
                >
                <el-button
                  v-else
                  type="danger"
                  plain
                  size="mini"
                  @click="cancelGoodsSpecRow(scope.row)"
                  >取消</el-button
                >
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <!-- 商品介绍图 -->
        <el-tab-pane label="商品介绍图" name="3">
          <el-table
            :data="goodsInfo.spuImgs"
            border
            :header-cell-style="{
              'text-align': 'center',
              background: '#F3F4F7',
            }"
            empty-text="暂无数据"
          >
            <el-table-column type="index" label="#" />
            <el-table-column label="排序">
              <template scope="scope">
                <span v-if="scope.row.isSet">
                  <el-input
                    v-model="scope.row.fIndex"
                    type="number"
                    size="mini"
                  />
                </span>
                <span v-else>{{ scope.row.fIndex }}</span>
              </template>
            </el-table-column>
            <el-table-column label="图片">
              <template scope="scope">
                <el-upload
                  class="avatar-uploader"
                  :show-file-list="false"
                  action
                  :before-upload="handleImgBefore"
                  :http-request="(params) => requestImgUpload(params, 'imgUrl')"
                >
                  <el-image
                    v-if="scope.row.imgUrl"
                    :src="scope.row.imgUrl ? baseUrl + scope.row.imgUrl : ''"
                    class="avatar"
                  />
                  <i v-else class="el-icon-plus avatar-uploader-icon" />
                </el-upload>
              </template>
            </el-table-column>
            <el-table-column width="190">
              <template slot="header">
                <el-button
                  type="success"
                  size="mini"
                  icon="el-icon-plus"
                  @click="addSpuImgRow"
                  >添加</el-button
                >
              </template>
              <template scope="scope">
                <el-button
                  v-if="!scope.row.isSet"
                  type="primary"
                  size="mini"
                  plain
                  @click="editSpuImgRow(scope.row)"
                  >编辑</el-button
                >
                <el-button
                  v-else
                  type="primary"
                  size="mini"
                  plain
                  @click="saveSpuImgRow(scope.row)"
                  >保存</el-button
                >
                <el-button
                  v-if="!scope.row.isSet"
                  type="danger"
                  size="mini"
                  plain
                  @click="deleteSpuImgRow(scope.row)"
                  >删除</el-button
                >
                <el-button
                  v-else
                  type="danger"
                  size="mini"
                  plain
                  @click="cancelSpuImgRow(scope.row)"
                  >取消</el-button
                >
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>
    <!-- 颜色及图片对话框 -->
    <el-dialog
      :title="(isAddDialog ? '新增' : '编辑') + '颜色及图片'"
      :visible.sync="visibleColorDialog"
    >
      <el-form
        ref="colorform"
        :model="goodsColor"
        size="mini"
        :rules="rulescolor"
        class="demo-ruleForm"
        label-width="80px"
        label-position="right"
      >
        <el-row>
          <el-col :span="8">
            <el-form-item label="ID" prop="id"
              ><el-input v-model="goodsColor.id" disabled /></el-form-item
          ></el-col>
          <el-col :span="8">
            <el-form-item label="颜色" prop="colorId">
              <el-select v-model="goodsColor.colorId" placeholder="请选择颜色">
                <el-option
                  v-for="item in coloroptions"
                  :key="item.fNumber"
                  :label="item.fName"
                  :value="item.fNumber"
                />
              </el-select> </el-form-item
          ></el-col>
          <el-col :span="8">
            <el-form-item label="排序索引" prop="findex"
              ><el-input
                v-model="goodsColor.findex"
                type="number" /></el-form-item
          ></el-col>
        </el-row>
        <el-row>
          <el-col v-for="(item, i) in imgrow" :key="i" :span="6">
            <!-- 动态创建四个色的栏目，避免重复工作 -->
            <el-form-item :label="item.label" :prop="item.imgfield">
              <el-upload
                class="avatar-uploader"
                :show-file-list="false"
                action
                :before-upload="handleImgBefore"
                :http-request="
                  (params) => requestImgUpload(params, item.imgfield)
                "
              >
                <el-image
                  v-if="goodsColor[item.imgfield]"
                  :src="
                    goodsColor[item.imgfield]
                      ? baseUrl + goodsColor[item.imgfield]
                      : ''
                  "
                  class="avatar"
                />
                <i v-else class="el-icon-plus avatar-uploader-icon" />
              </el-upload>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="mini" @click="visibleColorDialog = false"
          >取消</el-button
        >
        <el-button
          type="danger"
          size="mini"
          @click="submitGoodsColor('colorform')"
          >确定</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>

<script>
import common from "@/utils/common";
import apiGoods from "@/api/goods";
import apiBase from "@/api/base";
import apiSettings from "@/api/settings";
export default {
  data() {
    return {
      activeIndex: "0", // 当前激活的索引
      allCategories: [], // 商品分类
      existGoods: false, // 商品信息是否已提交
      isAddDialog: true, // 对话框是否为新增
      visibleColorDialog: false, // 颜色对话框是否显示
      visibleImgDialog: false, // spu对话框是否显示
      fileName: "", // 是传图片名
      baseUrl: "", // 图片根目录
      ErrorImg: 'this.src="' + require("@/assets/images/blankimg.png") + '"', // 图片错误地址
      goodsInfo: {
        goodsId: "",
        categoryId: [],
        prodNumber: "",
        goodsName: "",
        goodsDesc: "",
        unitName: "",
        salesTimes: 0,
        isRecommend: 0,
        isNew: 0,
        isUnder: 0,
        Creator: "admin",
        goodsColors: [],
        goodsSpecs: [],
        spuImgs: [],
      },
      rules: {
        goodsId: { required: true, message: "请输入商品Id", trigger: "blur" },
        goodsName: {
          required: true,
          message: "请输入商品名称",
          trigger: "blur",
        },
        goodsDesc: {
          required: true,
          message: "请输入商品描述",
          trigger: "blur",
        },
        categoryId: {
          required: true,
          message: "请选择商品分类",
          trigger: "blur",
        },
        unitName: {
          required: true,
          message: "销售单位不能为空",
          trigger: "blur",
        },
      },
      rulescolor: {
        colorId: { required: true, message: "请选择颜色", trigger: "blur" },
        imgFront: { required: true, message: "请选择上传正面图" },
      },
      goodsColor: {
        id: "",
        goodsId: "",
        colorId: "", // 注：颜色用el-select,必须在这里先定义一下colorId才能将值选上
        imgFront: "", // 这些字段必须这样定义一下，否则图片也选不上
        imgBack: "",
        imgLeft: "",
        imgRight: "",
        findex: 100,
        Creator: "admin",
      },
      coloroptions: [], // 颜色选项
      specoptions: [], // 规格选项
      spuImgs: {},
      imgrow: [
        { imgfield: "imgFront", label: "正面" },
        { imgfield: "imgBack", label: "背面" },
        { imgfield: "imgLeft", label: "左侧" },
        { imgfield: "imgRight", label: "右侧" },
      ],
    };
  },
  beforeMount() {
    // 获取数据时，要将categoryId转为数组
    if (this.$route.params.goodsId) {
      this.loadData(this.$route.params.goodsId);
    } else {
      this.goodsInfo.goodsId = common.getDigitSerial();
      this.$router.replace({
        name: "goodsInfo",
        params: { goodsId: this.goodsInfo.goodsId },
      });
    }
  },
  created() {
    // 载入商品分类
    apiGoods.GetGoodsCategories("*").then((res) => {
      if (res.code == 200 && res.returnStatus == 1) {
        this.allCategories = res.result;
      }
    });
    // 图片服务器
    this.baseUrl = common.getBaseURL();
    // 常用颜色选项
    apiSettings.GetSubMessageList("pdcolor").then((res) => {
      if (res.code == 200 && res.returnStatus == 1) {
        this.coloroptions = res.result;
      }
    });
    // 常用规格选项
    apiSettings.GetSubMessageList("pdspec").then((res) => {
      this.specoptions = res.result;
    });
  },
  methods: {
    // 保存商品信息
    saveGoodsInfo(infoform) {
      this.$refs[infoform].validate((valid) => {
        if (valid) {
          // 因为选择后返回的商品类别为数组类型，需要转为字符串，但又不能破坏现有实体类型，所以要复制为新对象
          const newinfo = JSON.parse(JSON.stringify(this.goodsInfo));
          if (Array.isArray(this.goodsInfo.categoryId)) {
            newinfo.categoryId = this.goodsInfo.categoryId[this.goodsInfo.categoryId.length-1];
          }
          apiGoods.SaveGoodsInfo(newinfo).then((res) => {
            if (res.code == 200 && res.returnStatus == 1) {
              this.existGoods = true;
              this.$message({ message: "保存成功", type: "success" });
              this.activeIndex = "1";
            } else {
              this.$message.error(JSON.stringify(res.result));
            }
          });
        } else {
          return false;
        }
      });
    },
    // 标签是否可切换
    beforeTabLeave(activeName, oldActiveName) {
      if (oldActiveName == "0" && !this.existGoods) {
        this.$message.error("请先保存商品信息");
        return false;
      }
    },
    // 上传前
    handleImgBefore(file) {
      this.fileName = file.name; // 记录文件名称
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
    // 选择图片并调用api上传
    requestImgUpload(params, imgfield) {
      const file = params.file;
      // 根据后台需求数据格式
      const form = new FormData();
      // 文件对象
      form.append("file", file);
      apiBase
        .UploadFiles(form)
        .then((res) => {
          const { result } = res;
          if (imgfield == "imgUrl") {
            // spu图片
            const index = this.goodsInfo.spuImgs.findIndex(
              (x) => x.isSet == true
            );
            if (index != -1) {
              // this.$set(this.goodsInfo.spuImgs,index)
              this.goodsInfo.spuImgs[index].imgUrl =
                result.diclist[this.fileName];
            }
          } else {
            // 颜色及图片设置
            this.goodsColor[imgfield] = result.diclist[this.fileName];
          }
        })
        .catch((err) => {
          this.$message.error(JSON.stringify(err));
        });
    },
    // 显示编辑颜色记录对话框
    showColorDialog(isAdd, index, row) {
      this.visibleColorDialog = true;
      this.isAddDialog = isAdd;
      if (isAdd) {
        this.goodsColor.id = common.getDigitSerial();
        this.goodsColor.goodsId = this.goodsInfo.goodsId;
        this.goodsColor.colorId = "";
        this.goodsColor.imgFront = "";
        this.goodsColor.imgBack = "";
        this.goodsColor.imgLeft = "";
        this.goodsColor.imgRight = "";
        this.goodsColor.findex = 100;
        this.goodsColor.Creator = "admin";
      } else {
        this.goodsColor.id = row.id;
        this.goodsColor.goodsId = row.goodsId;
        this.goodsColor.colorId = row.colorId;
        this.goodsColor.imgFront = row.imgFront;
        this.goodsColor.imgBack = row.imgBack;
        this.goodsColor.imgLeft = row.imgLeft;
        this.goodsColor.imgRight = row.imgRight;
        this.goodsColor.findex = row.findex;
        this.goodsColor.Creator = "admin";
      }
    },
    // 提交颜色及图片设置
    submitGoodsColor(ruleform) {
      this.$refs[ruleform].validate((valid) => {
        if (valid) {
          const goodsId = this.goodsInfo.goodsId;
          this.goodsColor.goodsId = goodsId;
          apiGoods
            .SaveGoodsColor(this.goodsColor)
            .then((res) => {
              if (res.code == 200 && res.returnStatus == 1) {
                return apiGoods.GetGoodsColors(goodsId);
              } else {
                return Promise.reject(res.msg);
              }
            })
            .then((res) => {
              if (res.code == 200 && res.returnStatus == 1) {
                this.goodsInfo.goodsColors = res.result;
                this.visibleColorDialog = false;
                this.existGoods = true;
                this.$message({ message: "保存成功", type: "success" });
              } else {
                return Promise.reject(res.msg);
              }
            })
            .catch((err) => {
              this.$message.error(JSON.stringify(err));
            });
        } else {
          return false;
        }
      });
    },
    // 删除一条颜色及图片设置记录
    deleteGoodsColor(id) {
      this.$confirm("您确定要删除该颜色记录吗？", "询问", {
        cancelButtonText: "取消",
        confirmButtonText: "确定",
      })
        .then((r) => {
          return apiGoods.DeleteGoodsColor(id);
        })
        .then((res) => {
          apiGoods.GetGoodsColors(this.goodsInfo.goodsId);
        })
        .catch((err) => {
          this.$message.error(JSON.stringify(err));
        });
    },
    // 新增规格定价行
    addGoodsSpecRow() {
      for (const i of this.goodsInfo.goodsSpecs) {
        if (i.isSet) {
          return this.$message({
            message: "请先保存编辑中的行",
            type: "warning",
          });
        }
      }
      const row = {
        id: common.getDigitSerial(),
        goodsId: this.goodsInfo.goodsId,
        specId: "",
        price: 0,
        discountPrice: 0,
        findex: 100,
        Creator: "admin",
        isSet: true,
      };
      this.goodsInfo.goodsSpecs.push(row);
    },
    // 编辑规格定价行
    editGoodsSpecRow(row) {
      row.isSet = true;
    },
    // 保存规格定价行
    saveGoodsSpecRow(row) {
      if (!row.specId) {
        return this.$message({ message: "请选择商品规格", type: "error" });
      }
      if (row.price == 0 || row.discountPrice == 0) {
        return this.$message({ message: "请完整录入价格信息", type: "error" });
      }
      apiGoods.SaveGoodsSpec(row).then((res) => {
        if (res.code == 200 && res.returnStatus == 1) {
          row.isSet = false;
        } else {
          this.$message.error(JSON.stringify(res.msg));
        }
      });
    },
    // 取消规格定价行的编辑状态
    cancelGoodsSpecRow(row) {
      this.getGoodsSpecs(row.goodsId);
    },
    // 获取规格与价格列表（刷新)
    getGoodsSpecs(goodsId) {
      apiGoods.GetGoodsSpecs(goodsId).then((res) => {
        res.result.map((x) => (x.isSet = false));
        this.goodsInfo.goodsSpecs = res.result;
      });
    },
    // 删除规定定价行
    deleteGoodsSpecRow(row) {
      this.$confirm("确定要删除吗?", "询问", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
      }).then((r) => {
        apiGoods.DeleteGoodsSpec(row.id).then((res) => {
          if (res.code == 200 && res.returnStatus == 1) {
            this.getGoodsSpecs(row.goodsId);
          } else {
            this.$message.error(JSON.stringify(res.msg));
          }
        });
      });
    },
    // 添加商品图片行
    addSpuImgRow() {
      for (const i of this.goodsInfo.spuImgs) {
        if (i.isSet) {
          return this.$message.error("存在未保存的行！");
        }
      }
      const spuImg = {
        id: common.getDigitSerial(),
        goodsId: this.goodsInfo.goodsId,
        fIndex: 100,
        imgUrl: "",
        isSet: true,
      };
      this.goodsInfo.spuImgs.push(spuImg);
    },
    // 编辑商品图片行
    editSpuImgRow(row) {
      row.isSet = true;
    },
    // 保存商品图片行
    saveSpuImgRow(row) {
      if (!row.imgUrl) {
        return this.$message.error("未设定图片！");
      }
      apiGoods.SaveSpuImg(row).then((res) => {
        if (res.code == 200 && res.returnStatus == 1) {
          this.$message({ message: "保存成功!", type: "success" });
          row.isSet = false;
        } else {
          this.$message.error(JSON.stringify(res.msg));
        }
      });
    },
    // 刷新商品图片列表
    getSpuImgs(goodsId) {
      apiGoods.GetSpuImgs(goodsId).then((res) => {
        if (res.code == 200 && res.returnStatus == 1) {
          res.result.map((x) => (x.isSet = false));
          this.goodsInfo.spuImgs = res.result;
        }
      });
    },
    // 取消商品图片行的编辑状态
    cancelSpuImgRow(row) {
      this.getSpuImgs(row.goodsId);
    },
    // 删除商品图片行
    deleteSpuImgRow(row) {
      this.$confirm("确定要删除吗?", "询问", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
      }).then((r) => {
        apiGoods.DeleteSpuImg(row.id).then((res) => {
          if (res.code == 200 && res.returnStatus == 1) {
            this.getSpuImgs(row.goodsId);
          }
        });
      });
    },
    // 载入商品信息（含附表数据)
    loadData(goodsId) {
      apiGoods.GetGoodsInfo(goodsId).then((res) => {
        if (res.code == 200 && res.returnStatus == 1) {
          this.goodsInfo = res.result;
          this.goodsInfo.goodsSpecs.map((x) => (x.isSet = false));
          this.goodsInfo.spuImgs.map((x) => (x.isSet = false));
          this.existGoods = true;
        } else {
          this.$message.error(JSON.stringify(res.msg));
        }
      });
    },
  },
};
</script>

<style lang="less" scoped>
@import "~@/styles/common.less";
@imgwid: 100px;
.container {
  margin: 20px;
}
/deep/.el-steps {
  margin: 15px 0;
}
/deep/.el-step__title {
  font-size: 13px;
}
.uploaderbox(100px,18px);
</style>
