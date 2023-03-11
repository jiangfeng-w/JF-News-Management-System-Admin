import { createStore } from 'vuex'
import createPersistedState from 'vuex-persistedstate'

export default createStore({
    state: {
        // 是否以获取路由
        isGetterRouter: false,
        // 是否折叠
        isCollapse: false,
    },
    getters: {},
    mutations: {
        changeGetterRouter(state, value) {
            state.isGetterRouter = value
        },
        changeCollapse(state) {
            state.isCollapse = !state.isCollapse
        },
    },
    actions: {},
    modules: {},
    plugins: [
        createPersistedState({
            paths: ['isCollapse'], //控制是否持久化
        }),
    ],
})
