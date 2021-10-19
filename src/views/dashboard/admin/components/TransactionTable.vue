<template>
  <el-table :data="list" style="width: 100%;padding-top: 15px;">
    <el-table-column label="APP数据项" min-width="200">
      <template slot-scope="scope">
        {{ scope.row.itemName }}
      </template>
    </el-table-column>
    <el-table-column label="数据" width="195" align="center">
      <template slot-scope="scope">
        {{ scope.row.value }}
      </template>
    </el-table-column>
    <el-table-column label="备注" width="100" align="center">
      <!-- <template slot-scope="{row}">
        <el-tag :type="row.status | statusFilter">
          {{ row.groupNo }}
        </el-tag>
      </template> -->
    </el-table-column>
  </el-table>
</template>

<script>
// import { transactionList } from '@/api/remote-search'
import apiDatacenter from '@/api/datacenter'
export default {
  // filters: {
  //   statusFilter(status) {
  //     const statusMap = {
  //       success: 'success',
  //       pending: 'danger'
  //     }
  //     return statusMap[status]
  //   },
  //   orderNoFilter(str) {
  //     return str.substring(0, 30)
  //   }
  // },
  data() {
    return {
      list: null
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    fetchData() {
      // transactionList().then(response => {
      //   this.list = response.data.items.slice(0, 8)
      // })
      apiDatacenter.GetMallData().then(res=>{
        if(res.code==200 && res.returnStatus ==1){
          // console.log(JSON.stringify(res.result))
          this.list=res.result;
        }
      })
    }
  }
}
</script>
