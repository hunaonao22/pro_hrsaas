import router from '@/router'
import store from '@/store'
import Nprogress from 'nprogress'
import 'nprogress/nprogress.css'

const loginPath = '/login'
const notFoundPath = '/404'
const whiteList = [loginPath, notFoundPath]

router.beforeEach(async(to, from, next) => {
  const token = store.getters.token
  Nprogress.start()
  if (token) {
    if (!store.getters.userId) {
      // 获取用户信息
      const res = await store.dispatch('user/getUserInfo')
      console.log(res.roles.menus)
      // 添加用户拥有的权限，之后再跳转
      const routes = await store.dispatch('permission/filterRoutes', res.roles.menus)
      console.log(routes)
      router.addRoutes(
        [...routes,
          // 404 page must be placed at the end !!!
          { path: '*', redirect: '/404', hidden: true }
        ])
      next(to.path)
    }
    if (to.path === loginPath) {
      next('/')
    } else {
      next()
    }
  } else {
    if (whiteList.includes(to.path)) {
      next()
    } else {
      next(loginPath)
    }
  }
})

router.afterEach((to, from, next) => {
  setTimeout(() => {
    Nprogress.done()
  }, 2000)
})

