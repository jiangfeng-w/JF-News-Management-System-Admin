import { createRouter, createWebHashHistory } from 'vue-router'
import RouteConfig from './RouteConfig'
import axios from 'axios'
import store from '../store/index'
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
                // 移除根路由
                router.removeRoute('homepage')
                // 加载路由
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

const checkPermission = i => {
    if (i.needAuth) {
        return store.state.userInfo.role === 1
    }
    return true
}

const config = () => {
    //
    if (!router.hasRoute('homepage')) {
        router.addRoute({
            path: '/homepage',
            name: 'homepage',
            component: () => import('@/views/HomePage.vue'),
        })
    }
    RouteConfig.forEach(i => {
        // 根据权限加载路由
        checkPermission(i) && router.addRoute('homepage', i)
    })
    store.commit('changeGetterRouter', true)
}
// config()
export default router
