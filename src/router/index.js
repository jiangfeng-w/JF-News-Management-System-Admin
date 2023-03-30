import { createRouter, createWebHashHistory } from 'vue-router'
import RouteConfig from './RouteConfig'
import store from '@/store/index'
import axios from 'axios'
import { ElMessage } from 'element-plus'

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
    {
        path: '/:pathMatch(.*)*',
        component: () => import('@/views/notfound/NotFound'),
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
        if (!localStorage.getItem('token')) {
            // 没有token，跳转到登录
            next('/login')
        } else {
            // 有token，但第一次加载
            if (!store.state.isGetterRouter) {
                config()
                next(to.fullPath)
            } else {
                // 检测token是否过期
                const token = localStorage.getItem('token')
                axios
                    .get('/admin/user/checkToken')
                    .then(res => {
                        if (res.status === 200) {
                            next()
                        }
                    })
                    .catch(err => {
                        next('/login')
                    })
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
