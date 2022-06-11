<template>
  <div class="dashboard-container">
    <div class="app-container">
      <!-- 放置一个elcard -->
      <el-card>
        <el-tabs>
          <el-tab-pane label="登录账户设置">
            <!-- 放置内容 -->
            <el-form ref="userFrom" :rules="rules" :model="userInfo" label-width="120px" style="margin-left: 120px; margin-top: 30px">
              <el-form-item label="用户名" prop="username">
                <el-input v-model="userInfo.username" style="width: 300px"></el-input>
              </el-form-item>
              <el-form-item label="密码" prop="password2">
                <el-input v-model="userInfo.password2" style="width: 300px" type="password"></el-input>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="saveUser">保存</el-button>
              </el-form-item>
            </el-form>
          </el-tab-pane>
          <el-tab-pane label="个人详情">
            <el-row type="flex" justify="end">
              <el-tooltip content="打印个人基本信息">
                <router-link :to="`/employees/print/${userId}?type=personal`">
                  <i class="el-icon-printer" />
                </router-link>
              </el-tooltip>
            </el-row>
            <!-- 放置内容 -->
            <!-- <user-info></user-info> -->
            <!-- vue.js 内置了一个组件 component  -->
            <component :is="componentId1"></component>
          </el-tab-pane>
          <el-tab-pane label="岗位信息">
            <!-- 放置内容 -->
            <component :is="componentId2"></component>
          </el-tab-pane>
        </el-tabs>
      </el-card>
    </div>
    <el-row type="flex" justify="end">
      <el-tooltip content="打印岗位信息">
        <router-link :to="`/employees/print/${userId}?type=job`">
          <i class="el-icon-printer" />
        </router-link>
      </el-tooltip>
    </el-row>
  </div>
</template>

<script>
import { getUserDetailById } from '@/api/user'
import { saveUserDetailById } from '@/api/employees'
import UserInfo from './components/user-info.vue'
import JobInfo from './components/job-info.vue'
export default {
  components: {
    UserInfo,
    JobInfo
  },
  data() {
    return {
      componentId1: 'UserInfo',
      componentId2: 'JobInfo',
      userId: this.$route.params.id,
      userInfo: {
        username: '',
        password2: ''
      },
      rules: {
        username: [{ required: true, message: '姓名不能为空', trigger: 'blur' }],
        password2: [
          { required: true, message: '密码不能为空', trigger: 'blur' },
          { min: 6, max: 9, message: '密码长度6-9位', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    this.getUserDetailById()
  },
  methods: {
    async getUserDetailById() {
      this.userInfo = await getUserDetailById(this.userId)
    },
    saveUser() {
      this.$refs.userFrom.validate().then(async () => {
        await saveUserDetailById({ ...this.userInfo, password: this.userInfo.password2 })
        this.$message.success('修改用户信息成功')
      })
    }
  }
}
</script>

<style>
</style>
