// 权限拦截在路由跳转 导航首位
import router from '@/router'
import store from '@/store'
import nprogress from 'nprogress' // 引入进度条
import 'nprogress/nprogress.css'

const whiteList = ['/login', '/404'] // 定义白名单

router.beforeEach(async (to, from, next) => {
  nprogress.start() // 开启进度条
  if (store.getters.token) {
    // 如果有token
    if (to.path === '/login') {
      next('/')
    } else {
      if (!store.getters.userId) {
        const { roles } = await store.dispatch('user/getUserInfo')

        const routes = await store.dispatch('permission/filterRoutes', roles.menus)

        router.addRoutes([...routes, { path: '*', redirect: '/404', hidden: true }])
        next(to.path)
      } else {
        next()
      }
    }
  } else {
    // 如果没有token
    if (whiteList.indexOf(to.path) > -1) {
      // 表示要去的地址在白名单
      next()
    } else {
      next('/login')
    }
  }
  nprogress.done()// 解决手动切换地址时进度条不关闭的问题
})
router.afterEach(() => {
  nprogress.done() // 关闭进度条
})
