<template>
  <el-dialog title="新增员工 " :visible="showDialog" @close="btnCancel">
    <!-- 表单 -->

    <el-form ref="addEmployee" :model="formData" :rules="rules" label-width="120px">
      <el-form-item label="姓名" prop="username">
        <el-input v-model="formData.username" style="width: 80%" placeholder="请输入姓名"></el-input>
      </el-form-item>
      <el-form-item label="手机" prop="mobile">
        <el-input v-model="formData.mobile" style="width: 80%" placeholder="请输入手机号"></el-input>
      </el-form-item>
      <el-form-item label="入职时间" prop="timeOfEntry">
        <el-date-picker v-model="formData.timeOfEntry" style="width: 80%" placeholder="请选择入职时间"></el-date-picker>
      </el-form-item>
      <el-form-item label="聘用形式" prop="formOfEmployment">
        <el-select v-model="formData.formOfEmployment" style="width: 80%" placeholder="请选择">
          <el-option v-for="item in EmployeeEnum.hireType" :key="item.id" :label="item.value" :value="item.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="工号" prop="workNumber">
        <el-input v-model="formData.workNumber" style="width: 80%" placeholder="请输入工号"></el-input>
      </el-form-item>
      <el-form-item label="部门" prop="departmentName">
        <el-input v-model="formData.departmentName" style="width: 80%" placeholder="请选择部门" @focus="getDepartments"></el-input>
        <el-tree v-if="showTree" :v-loading="loading" :data="treeData" :props="{ label: 'name' }" :default-expand-all="true" @node-click="selectNode"></el-tree>
      </el-form-item>
      <el-form-item label="转正时间" prop="correctionTime">
        <el-date-picker v-model="formData.correctionTime" style="width: 80%" placeholder="请选择转正时间"></el-date-picker>
      </el-form-item>
    </el-form>
    <!-- footer插槽 -->
    <el-row slot="footer" type="flex" justify="center">
      <el-col :span="6">
        <el-button size="small" @click="btnCancel">取消</el-button>
        <el-button size="small" type="primary" @click="btnOk">确定</el-button>
      </el-col>
    </el-row>
  </el-dialog>
</template>

<script>
import { getDepartments } from '@/api/departments'
import { tranListToTreeData } from '@/utils'
import EmployeeEnum from '@/api/constant/employees'
import { addEmployee } from '@/api/employees'
export default {
  props: {
    showDialog: {
      type: Boolean,
      default: false
    }
  },

  data() {
    const checkDate = (rule, value, callback) => {
      value ? callback() : callback(new Error('请选择日期'))
    }
    return {
      formData: {
        username: '',
        mobile: '',
        formOfEmployment: '',
        workNumber: '',
        departmentName: '',
        timeOfEntry: '',
        correctionTime: ''
      },

      rules: {
        username: [
          { required: true, message: '用户姓名不能为空', trigger: 'blur' },
          { min: 1, max: 4, message: '用户姓名为1-4位' }
        ],
        mobile: [
          { required: true, message: '手机号不能为空', trigger: 'blur' },
          {
            // pattern正则表达式 如果满足 就通过校验 如果不满足就不通过
            pattern: /^1[3-9]\d{9}$/,
            message: '您的手机号格式不正确',
            trigger: 'blur'
          }
        ],

        formOfEmployment: [{ required: true, message: '聘用形式不能为空', trigger: 'change' }],
        workNumber: [{ required: true, message: '工号不能为空', trigger: 'blur' }],
        departmentName: [{ required: true, message: '部门不能为空', trigger: 'change' }],
        timeOfEntry: [{ validator: checkDate, trigger: 'change' }]
      },
      treeData: [],
      showTree: false,
      loading: false,
      EmployeeEnum
    }
  },
  methods: {
    async getDepartments() {
      this.showTree = true
      this.loading = true
      const { depts } = await getDepartments()
      this.treeData = tranListToTreeData(depts, '')
      this.loading = false
    },
    selectNode(node) {
      this.formData.departmentName = node.name
      this.showTree = false
    },
    btnCancel() {
      this.formData = {
        username: '',
        mobile: '',
        formOfEmployment: '',
        workNumber: '',
        departmentName: '',
        timeOfEntry: '',
        correctionTime: ''
      }
      this.$refs.addEmployee.resetFields()
      this.$emit('update:showDialog', false)
    },
    async btnOk() {
      try {
        await this.$refs.addEmployee.validate()
        await addEmployee(this.formData)
        // this.$parent // 父组件的实例
        this.$parent.getDepartments && this.$parent.getDepartments()
        this.$parent.showDialog = false
      } catch (error) {
        console.log(error)
      }
    }
  }
}
</script>

<style>
</style>
