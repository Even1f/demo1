<template>
  <div ref="myDiv" class="radar-echart"></div>
</template>

<script>
var echarts = require('echarts/lib/echarts') // 引入echarts主模块
require('echarts/lib/chart/radar') // 引入雷达图
// 引入提示框和标题组件
require('echarts/lib/component/tooltip')
require('echarts/lib/component/title')

export default {
  created() {
    //
  },
  mounted() {
    const myChart = echarts.init(this.$refs.myDiv) // 得到图表实例
    myChart.setOption({
      title: {
        text: 'Basic Radar Chart'
      },
      legend: {
        data: ['Allocated Budget', 'Actual Spending']
      },
      radar: {
        // shape: 'circle',
        indicator: [
          { name: '工作效率', max: 100 },
          { name: '考勤', max: 100 },
          { name: '积极性', max: 100 },
          { name: '帮助同事', max: 100 },
          { name: '自主学习', max: 100 },
          { name: '正确率', max: 100 }
        ]
      },
      series: [
        {
          name: 'Budget vs spending',
          type: 'radar',
          data: [
            {
              value: [42, 30, 20, 35, 50, 18],
              name: 'Allocated Budget'
            },
            {
              value: [50, 14, 20, 26, 42, 21],
              name: 'Actual Spending'
            }
          ]
        }
      ]
    })
  }
}
</script>

<style>
.radar-echart {
  width: 600px;
  height: 400px;
}
</style>
