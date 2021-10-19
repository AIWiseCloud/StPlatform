<template>
  <div class="container">
    <el-collapse v-model="activeindex">
      <el-collapse-item name="0">
        <template slot="title">
          <span>查询条件<i class="el-icon-search" style="color: red" /></span>
        </template>
        <el-form :model="searchModel" label-width="92px" size="mini">
          <el-row>
            <el-col :sm="24" :md="8" :lg="6" :xl="6">
              <el-form-item label="关键字">
                <el-input
                  v-model="searchModel.keywords"
                  placeholder="请输入关键字后点查询"
                />
              </el-form-item>
            </el-col>
            <el-col :sm="24" :md="8" :lg="6" :xl="6">
              <el-form-item label="开始时间">
                <el-date-picker
                  v-model="searchModel.startDate"
                  type="datetime"
                  value-format="yyyy-MM-dd HH:mm:ss"
                  placeholder="选择开始日期时间"
                />
              </el-form-item>
            </el-col>
            <el-col :sm="24" :md="8" :lg="6" :xl="6">
              <el-form-item label="结束时间">
                <el-date-picker
                  v-model="searchModel.endDate"
                  type="datetime"
                  value-format="yyyy-MM-dd HH:mm:ss"
                  placeholder="选择截止日期时间"
                />
              </el-form-item>
            </el-col>
            <el-col :sm="24" :md="8" :lg="6" :xl="6">
              <el-form-item>
                <el-button
                  type="primary"
                  icon="el-icon-search"
                  size="small"
                  @click="searchData"
                  >查询</el-button
                >
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </el-collapse-item>
    </el-collapse>
    <el-card>
      <el-table
        :data="amList"
        border
        empty-text="无数据"
        :header-cell-style="{
          'background-color': '#F3F4F7',
          'text-align': 'center',
        }"
        size="small"
      >
        <el-table-column
          label="定金单号"
          prop="id"
          align="center"
          width="110"
        />
        <el-table-column
          label="支付凭证"
          prop="payVoucherUrl"
          width="60"
          align="center"
        >
          <template slot-scope="scope">
            <el-popover
              v-if="scope.row.payVoucherUrl"
              ref="popover"
              placement="top"
              trigger="hover"
            >
              <el-image
                :src="$common.getBaseURL() + scope.row.payVoucherUrl"
                style="width: 600px; height: 600px"
                fit="scale-down"
              />
              <el-image
                slot="reference"
                :src="$common.getBaseURL() + scope.row.payVoucherUrl"
                style="width: 40px; height: 40px"
              />
            </el-popover>
          </template>
        </el-table-column>
        <el-table-column label="订单号" prop="orderId" width="110" />
        <el-table-column label="订单金额" prop="orderMain.realPay" width="70" />
        <el-table-column
          label="定金"
          prop="downPayment"
          align="center"
          width="60"
        />
        <el-table-column
          label="摘要"
          prop="summary"
          width="160"
          align="center"
          show-overflow-tooltip
        />
        <el-table-column
          label="支付方式"
          prop="paymentWay"
          width="70"
          align="center"
        />
        <el-table-column
          label="交易单号"
          prop="tradeNo"
          align="center"
          show-overflow-tooltip
        />
        <el-table-column
          label="收货人"
          prop="orderMain.receiver"
          width="60"
          align="center"
        />
        <el-table-column
          label="手机号"
          prop="orderMain.phoneNumber"
          width="60"
          align="center"
          show-overflow-tooltip
        />
        <el-table-column
          label="支付时间"
          prop="payTime"
          width="60"
          align="center"
          show-overflow-tooltip
        />
        <el-table-column
          label="日期"
          prop="createDate"
          width="110"
          align="center"
        >
          <template scope="scope">
            <span>{{ scope.row.createDate.substr(0, 10) }}</span>
          </template>
        </el-table-column>

        <el-table-column
          label="确认状态"
          prop="confirmStatus"
          width="60"
          align="center"
        >
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.confirmStatus"
              active-color="rgb(55,55,55)"
              :inactive-value="0"
              :active-value="1"
              disabled
            ></el-switch>
          </template>
        </el-table-column>
        <el-table-column
          label="确认人"
          prop="confirmer"
          width="60"
          align="center"
        />
        <el-table-column label="操作" align="center" width="60">
          <template scope="scope">
            <el-button
              type="primary"
              icon="el-icon-check"
              circle
              size="mini"
              @click="confirmReceipt(scope.$index, scope.row)"
            />
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <el-pagination
      v-if="totalCount > 0"
      :current-page.sync="searchModel.pageModel.pageNo"
      :page-size="searchModel.pageModel.pageSize"
      layout="total,prev,pager,next"
      :total="totalCount"
      @current-change="loadData"
    />
  </div>
</template>

<script>
import apiOrder from "@/api/order";
import { mapGetters } from "vuex";
export default {
  data() {
    return {
      activeindex: "0",
      totalCount: 0,
      searchModel: {
        keywords: "",
        startDate: "",
        endDate: "",
        pageModel: {
          pageNo: 1,
          pageSize: 10,
          orderField: "",
          orderWay: "",
        },
      },
      amList: [],
    };
  },
  created() {
    this.searchData();
  },
  methods: {
    loadData() {
      apiOrder.QueryAdvanceMoney(this.searchModel).then((res) => {
        if (res.code == 200 && res.returnStatus == 1) {
          const { totalCount, items } = res.result;
          this.totalCount = totalCount;
          this.amList = items;
          // console.log(JSON.stringify(items));
        }
      });
    },
    searchData() {
      this.amList = [];
      this.searchModel.pageModel.pageNo = 1;
      this.loadData();
    },
    //到账确认
    confirmReceipt(index, row) {
      var isconfirm = row.confirmStatus == 1 ? 0 : 1;
      var paytime = this.$common.formatDate(new Date(), "yyyy-MM-dd");
      if (!row.payVoucherUrl) {
        return this.$message.error("客户尚未上传定金支付凭证");
      }
      if (row.tradeNo) {
        return this.$message.error("在线支付的定金已由系统自动确认");
      }
      this.$confirm(
        `确定要执行${isconfirm == 1 ? "" : "取消"}确认定金到账的操作吗？`,
        "询问",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
        }
      )
        .then((r) => {
          return apiOrder.ConfirmReceipt(
            row.id,
            this.userName,
            isconfirm,
            paytime
          );
        })
        .then((res) => {
          if (res.code == 200 && res.returnStatus == 1) {
            row.confirmStatus = isconfirm;
            row.confirmer = this.userName;
            if (isconfirm) {
              row.payTime = paytime;
            } else {
              row.payTime = "";
            }
            this.$set(this.amList, index, row);
            this.$message.success("操作成功");
          } else {
            return Promise.reject(res.msg);
          }
        })
        .catch((err) => {
          this.$message.error(JSON.stringify(err));
        });
    },
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
</style>