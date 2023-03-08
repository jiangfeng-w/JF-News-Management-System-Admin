import { createRouter, createWebHashHistory } from 'vue-router'
import RouteConfig from './RouteConfig'
import store from '@/store/index'

const routes = [
    {
        path: '/login',
        name: 'login',
        component: () => import('@/views/Login.vue'),
    },
    {
        path: '/homepage',
        name: 'homepage',
        component: () => import('@/views/HomePage.vue'),
    },
]

const router = createRouter({
    history: createWebHashHistory(),
    routes,
})

// 路由守卫
router.beforeEach((to, from, next) => {
    // 跳转到登录
    if (to.path === '/login') {
        next()
    } else {
        // 如果已登录，token错误，定位到 登录
        if (!localStorage.getItem('token')) {
            next('/login')
        } else {
            // token正确,但第一次加载
            if (!store.state.isGetterRouter) {
                config()
                next(to.fullPath)
            } else {
                next()
            }
        }
    }
})
const config = () => {
    RouteConfig.forEach(i => {
        router.addRoute('homepage', i)
    })
    store.commit('changeGetterRouter', true)
}
// config()
export default router
