<template>
    <el-header>
        <div class="top">
            <!-- 左边 -->
            <div class="left">
                <!-- 展开图标 -->
                <div class="expandIcon">
                    <el-icon
                        v-show="$store.state.isCollapse"
                        @click="handleCollapsed"
                        size="25"
                    >
                        <Expand />
                    </el-icon>
                    <el-icon
                        v-show="!$store.state.isCollapse"
                        @click="handleCollapsed"
                        size="25"
                    >
                        <Fold />
                    </el-icon>
                </div>
            </div>

            <!-- 右边 -->
            <div class="right">
                <!-- 下拉菜单 -->
                <el-dropdown>
                    <span class="el-dropdown-link">
                        欢迎您，{{ store.state.userInfo.username }}
                        <el-avatar :src="store.state.userInfo.avatar" />
                    </span>
                    <template #dropdown>
                        <el-dropdown-menu>
                            <el-dropdown-item @click="goCenter">个人中心</el-dropdown-item>
                            <el-dropdown-item
                                @click="logOut"
                                divided
                            >
                                退出登录
                            </el-dropdown-item>
                        </el-dropdown-menu>
                    </template>
                </el-dropdown>
            </div>
        </div>
    </el-header>
</template>

<script setup>
    import { Fold, Expand, ArrowDown } from '@element-plus/icons-vue'
    import { useStore } from 'vuex'
    import { useRouter } from 'vue-router'

    const store = useStore()
    // 侧栏展开/收起
    const handleCollapsed = () => {
        store.commit('changeCollapse')
    }
    const router = useRouter()
    // 个人中心
    const goCenter = () => {
        router.push('/center')
    }
    // 退出登录
    const logOut = () => {
        router.push('/login')
        localStorage.removeItem('token')
        store.commit('clearUserInfo')
    }
</script>

<style lang="scss" scope>
    .el-header {
        display: flex;
        flex-direction: column;
        padding: 0;
        height: 50px;
        .top {
            display: flex;
            justify-content: space-between;
            align-items: center;
            height: 50px;
            box-sizing: border-box;
            padding: 0 20px;
            box-shadow: 0 1px 4px rgb(0 21 41 / 8%);
            // background-color: aqua;
            .right {
                display: flex;
            }
        }
        // .bottom {
        //     // background-color: #bfa;
        //     box-shadow: 0 1px 3px 0 rgb(0 0 0 / 12%), 0 0 3px 0 rgb(0 0 0 / 4%);
        //     height: 30px;
        //     padding: 0 20px;
        // }
    }
    .el-dropdown-link {
        cursor: pointer;
        // color: var(--el-color-primary);
        display: flex;
        align-items: center;
        .el-avatar {
            margin-left: 15px;
        }
    }
    :deep(.el-dropdown) {
        z-index: 999999999;
    }
</style>
