<template>
  <upload-excel :on-success="success"></upload-excel>
</template>

<script>
import { importEmployee } from '@/api/employees'
export default {
  methods: {
    async success({ header, results }) {
      const userRelations = {
        入职日期: 'timeOfEntry',
        手机号: 'mobile',
        姓名: 'username',
        转正日期: 'correctionTime',
        工号: 'workNumber'
      }
      // results.forEach(item => {
      //   var userInfo = {}
      //   Object.keys(item).forEach(key => {
      //     userInfo[userRelations[key]] = item[key]
      //   })
      // })
      var newArr = results.map(item => {
        var userInfo = {}
        Object.keys(item).forEach(key => {
          userInfo[userRelations[key]] = item[key]
        })
        return userInfo
      })
      await importEmployee(newArr)
      this.$message.success('导入excel成功')
      this.$router.back()
    }
  }
}
</script>

<style>
</style>
