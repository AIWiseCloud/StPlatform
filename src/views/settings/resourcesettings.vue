<template>
  <div class="container">
    <el-collapse v-model="activename">
      <template slot="title">
        <span>查询条件<i class="el-icon-search" style="color: red"></i></span>
      </template>

      <el-collapse-item name="0"></el-collapse-item>
    </el-collapse>
  </div>
</template>

<script>
export default {
  name: "resourcesettings",
  data() {
    return {
      activename: "0",
      searchModel: {
        keywords: "",
        pageModel: {
          pageNo: 1,
          pageSize: 20,
          orderField: "",
          orderWay: "",
        },
      },
    };
  },
  methods: {},
};
</script>

<style lang="less" scoped>
.container {
  margin: 20px;
}
</style>
