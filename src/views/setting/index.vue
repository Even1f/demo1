<template>
  <div class="dashboard-container">
    <div class="app-container">
      <el-card>
        <el-tabs>
          <el-tab-pane label="角色管理">
            <!-- 左侧内容 -->
            <el-row style="height: 60px">
              <el-button type="primary" icon="el-icon-plus" size="small" @click="showDialog = true">新增角色</el-button>
            </el-row>
            <!-- 给表格绑定数据 -->
            <el-table :data="list" border="">
              <el-table-column align="center" type="index" label="序号" width="120"></el-table-column>
              <el-table-column align="center" prop="name" label="名称" width="240"></el-table-column>
              <el-table-column header-align="center" prop="description" label="描述"></el-table-column>
              <el-table-column align="center" label="操作">
                <!-- 作用域插槽 -->
                <template slot-scope="{ row }">
                  <el-button size="small" type="success" @click="assignPerm(row.id)">分配权限</el-button>
                  <el-button size="small" type="primary" @click="editRole(row.id)">编辑</el-button>
                  <el-button size="small" type="danger" @click="deleteRole(row.id)">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
            <!-- 放置分页组件 -->
            <el-row type="flex" justify="center" align="middle" style="height: 60px">
              <el-pagination :page-size="page.pagesize" :current-page="page.page" :total="page.total" layout="prev, pager, next" @current-change="changePage"></el-pagination>
            </el-row>
          </el-tab-pane>
          <el-tab-pane label="公司信息">
            <el-alert type="info" show-icon :closable="false" title="对公司名称、公司地址、营业执照、公司地区的更新，将使得公司资料被重新审核，请谨慎修改"></el-alert>
            <!-- 右侧内容 -->
            <el-form label-width="220px" style="margin-top: 50px">
              <el-form-item label="企业名称">
                <el-input v-model="formDate.name" style="width: 400px" disabled></el-input>
              </el-form-item>
              <el-form-item label="公司地址">
                <el-input v-model="formDate.companyAddress" style="width: 400px" disabled></el-input>
              </el-form-item>
              <el-form-item label="电话">
                <el-input v-model="formDate.companyPhone" style="width: 400px" disabled></el-input>
              </el-form-item>
              <el-form-item label="邮箱">
                <el-input v-model="formDate.mailbox" style="width: 400px" disabled></el-input>
              </el-form-item>
              <el-form-item label="备注">
                <el-input v-model="formDate.remarks" style="width: 400px" disabled type="textarea" :rows="3"></el-input>
              </el-form-item>
            </el-form>
          </el-tab-pane>
        </el-tabs>
      </el-card>
    </div>
    <!-- 放置弹层 -->
    <el-dialog title="编辑部门" :visible="showDialog" @close="btnCancel">
      <el-form ref="roleForm" :model="roleForm" :rules="rules" label-width="120px">
        <el-form-item prop="name" label="角色名称">
          <el-input v-model="roleForm.name"></el-input>
        </el-form-item>
        <el-form-item label="角色描述">
          <el-input v-model="roleForm.description"></el-input>
        </el-form-item>
      </el-form>
      <el-row type="flex" justify="center">
        <el-col :span="6">
          <el-button size="small" @click="btnCancel">取消</el-button>
          <el-button size="small" type="primary" @click="btnOk">确定</el-button>
        </el-col>
      </el-row>
    </el-dialog>
    <!-- 放置权限弹层 -->
    <el-dialog title="分配权限" :visible="showpermDialog" @close="btnPermCancel">
      <!-- 权限是一棵树 -->
      <el-tree ref="permTree" :default-checked-keys="selectCheck" node-key="id" :check-strictly="true" :show-checkbox="true" :data="premData" :props="defaultProps" :default-expand-all="true"></el-tree>
      <!-- 放置footer插槽 -->
      <el-row slot="footer" type="flex" justify="center">
        <el-col :span="6">
          <el-button size="small" @click="btnPermCancel">取消</el-button>
          <el-button size="small" type="primary" @click="btnPermOk">确定</el-button>
        </el-col>
      </el-row>
    </el-dialog>
  </div>
</template>

<script>
import { getRoleList, getCompanyInfo, deleteRole, getRoleDetail, updateRole, addRole, assignPerm } from '@/api/setting'
import { getPermissionList } from '@/api/permisson'
import { mapGetters } from 'vuex'
import { tranListToTreeData } from '@/utils'
export default {
  data() {
    return {
      premData: [],
      defaultProps: {
        label: 'name'
      },
      list: [],
      page: {
        page: 1,
        pagesize: 10,
        total: 0
      },
      formDate: {
        // 公司信息
      },
      showDialog: false,
      showpermDialog: false,
      roleForm: {
        name: '',
        description: ''
      },
      rules: {
        name: [{ required: true, message: '角色名称不能为空', trigger: 'blur' }]
      },
      roleId: null,
      selectCheck: []
    }
  },
  computed: {
    ...mapGetters(['companyId'])
  },
  created() {
    this.getRoleList()
    this.getCompanyInfo()
  },

  methods: {
    async getRoleList() {
      const { total, rows } = await getRoleList(this.page)
      this.page.total = total
      this.list = rows
    },
    async getCompanyInfo() {
      this.formDate = await getCompanyInfo(this.companyId)
      console.log(this.formDate)
    },
    changePage(newPage) {
      this.page.page = newPage
      this.getRoleList()
    },
    async deleteRole(id) {
      try {
        await this.$confirm('确认删除该角色吗')
        await deleteRole(id)
        this.getRoleList()
        this.$message.success('删除角色成功')
      } catch (error) {
        console.log(error)
      }
    },
    async editRole(id) {
      this.roleForm = await getRoleDetail(id)
      this.showDialog = true
    },
    btnCancel() {
      this.roleForm = {
        name: '',
        description: ''
      }
      this.showDialog = false
      this.$refs.roleForm.resetFields()
    },
    async btnOk() {
      try {
        await this.$refs.roleForm.validate()
        if (this.roleForm.id) {
          await updateRole(this.roleForm)
        } else {
          await addRole(this.roleForm)
          console.log(this.roleForm)
        }

        this.getRoleList()
        this.$message.success('操作成功')
        this.showDialog = false
      } catch (error) {
        console.log(error)
      }
    },
    async assignPerm(id) {
      this.premData = tranListToTreeData(await getPermissionList(), '0')
      this.roleId = id
      const { permIds } = await getRoleDetail(id)
      this.selectCheck = permIds
      this.showpermDialog = true
    },
    btnPermOk() {
      // this.$refs.permTree.getCheckedKeys()
      assignPerm({ permIds: this.$refs.permTree.getCheckedKeys(), id: this.roleId })
      this.$message.success('分配权限成功')
      this.showpermDialog = false
    },
    btnPermCancel() {
      this.selectCheck = []
      this.showpermDialog = false
    }
  }
}
</script>

<style>
</style>
