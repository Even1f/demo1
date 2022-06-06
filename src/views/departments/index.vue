<template>
  <div class="dashboard-container">
    <div class="app-container">
      <!-- 组织架构的内容-头部 -->
      <el-card class="tree-card">
        <!-- 放置结构内容 -->
        <tree-tools :tree-node="company" :is-root="true" @addDepts="addDepts"></tree-tools>
        <!-- 放置一个el-tree -->
        <el-tree :data="departs" :props="defaultProps" :default-expand-all="true">
          <!-- 传入内容 插槽内容 会循环多次 有多少节点就循环多少次 -->
          <!-- 作用域插槽 slot-scope="obj" 接受传递给插槽的数据 -->
          <tree-tools slot-scope="{ data }" :tree-node="data" @editDepts="editDepts" @delDepts="getDepartments" @addDepts="addDepts"></tree-tools>
        </el-tree>
      </el-card>
    </div>
    <add-dept ref="addDept" :show-dialog.sync="showDialog" :tree-node="node" @addDepts="getDepartments"></add-dept>
  </div>
</template>

<script>
import TreeTools from './components/tree-tools.vue'
import { getDepartments } from '@/api/departments'
import { tranListToTreeData } from '@/utils/index'
import AddDept from './components/add-dept.vue'
export default {
  components: {
    TreeTools,
    AddDept
  },

  data() {
    return {
      company: { name: '', manager: '' }, // 头部的数据
      departs: [],
      defaultProps: {
        label: 'name'
      },
      showDialog: false, // 默认不显示
      node: null
    }
  },

  created() {
    this.getDepartments()
  },

  methods: {
    async getDepartments() {
      const result = await getDepartments()
      this.company = { name: result.companyName, manager: '负责人', id: '' }
      this.departs = tranListToTreeData(result.depts, '') // 需要将其转化成树形结构
      console.log(result)
    },
    addDepts(node) {
      this.showDialog = true
      this.node = node
    },
    editDepts(node) {
      this.showDialog = true
      this.node = node
      this.$refs.addDept.getDepartDetail(node.id)
    }
  }
}
</script>

<style lang="scss">
.tree-card {
  padding: 30px 140px;
  font-size: 16px;
  .el-dropdown {
    font-size: 16px;
  }
}
</style>
