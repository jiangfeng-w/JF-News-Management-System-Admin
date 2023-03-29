import { createStore } from 'vuex'
import createPersistedState from 'vuex-persistedstate'

export default createStore({
    state: {
        // 是否以获取路由
        isGetterRouter: false,
        // 是否折叠
        isCollapse: false,
        // 用户信息
        userInfo: {},
    },
    getters: {},
    mutations: {
        changeGetterRouter(state, value) {
            state.isGetterRouter = value
        },
        changeCollapse(state) {
            state.isCollapse = !state.isCollapse
        },
        changeUserInfo(state, value) {
            state.userInfo = {
                ...state.userInfo,
                ...value,
            }
        },
        // 退出清除用户信息
        clearUserInfo(state) {
            state.userInfo = {}
        },
    },
    actions: {},
    modules: {},
    plugins: [
        createPersistedState({
            paths: ['isCollapse', 'userInfo'], //控制是否持久化
        }),
    ],
})
