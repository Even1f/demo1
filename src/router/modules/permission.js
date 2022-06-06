// 权限管理的路由规则
import Layout from '@/layout'
export default {
  // 路由规则
  path: '/permission', // 路由地址
  name: 'permission', // 给模块的一级路由加一个name属性 之后会在做权限的时候用到
  component: Layout,
  children: [{
    // 二级路由的path什么都不用写的时候 此时表示二级路由的默认路由
    path: '', // 这里不用写
    component: () => import('@/views/permission'),
    // 路由元信息 其实就是一个存储数据的地方 可以放任何内容
    meta: {
      title: '权限管理', // 这里为什么用title 因为左侧导航栏读取了这里的title属性
      icon: 'lock'
    }
  }]
}
