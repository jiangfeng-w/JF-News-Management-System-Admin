<template>
    <el-aside :width="$store.state.isCollapse ? '64px' : '200px'">
        <p
            class="siteTitle"
            @click="goHome"
        >
            <img
                src="../../assets/logo.png"
                alt=""
            />
            <span v-show="!$store.state.isCollapse">企业门户管理</span>
        </p>
        <!-- 导航菜单 -->
        <el-menu
            :collapse="$store.state.isCollapse"
            :router="true"
            :default-active="route.fullPath"
            text-color="#fff"
        >
            <!-- 首页 -->
            <el-menu-item index="/home">
                <el-icon><HomeFilled /></el-icon>
                <span>首页</span>
            </el-menu-item>

            <!-- 个人中心 -->
            <!-- <el-menu-item index="/center">
                <el-icon><Avatar /></el-icon>
                <span>个人中心</span>
            </el-menu-item> -->

            <!-- 用户管理 -->
            <el-sub-menu
                index="/user-manage"
                v-if="store.state.userInfo.role === 1"
            >
                <template #title>
                    <el-icon><UserFilled /></el-icon>
                    <span>用户管理</span>
                </template>
                <el-menu-item index="/user-manage/adduser">
                    <el-icon><Menu /></el-icon>
                    <span>添加用户</span>
                </el-menu-item>
                <el-menu-item index="/user-manage/userlist">
                    <el-icon><Menu /></el-icon>
                    <span>用户列表</span>
                </el-menu-item>
            </el-sub-menu>

            <!-- 新闻管理 -->
            <el-sub-menu index="/news-manage">
                <template #title>
                    <el-icon color="#2255b0"><TrendCharts /></el-icon>
                    <span>新闻管理</span>
                </template>
                <el-menu-item index="/news-manage/addnews">
                    <el-icon><Menu /></el-icon>
                    <span>添加新闻</span>
                </el-menu-item>
                <el-menu-item index="/news-manage/newslist">
                    <el-icon><Menu /></el-icon>
                    <span>新闻列表</span>
                </el-menu-item>
            </el-sub-menu>

            <!-- 产品管理 -->
            <el-sub-menu index="/product-manage">
                <template #title>
                    <el-icon><GoodsFilled /></el-icon>
                    <span>产品管理</span>
                </template>
                <el-menu-item index="/product-manage/addproduct">
                    <el-icon><Menu /></el-icon>
                    <span>添加产品</span>
                </el-menu-item>
                <el-menu-item index="/product-manage/productlist">
                    <el-icon><Menu /></el-icon>
                    <span>产品列表</span>
                </el-menu-item>
            </el-sub-menu>
        </el-menu>
    </el-aside>
</template>

<script setup>
    import { HomeFilled, Avatar, UserFilled, TrendCharts, GoodsFilled, Menu, Pointer } from '@element-plus/icons-vue'
    import { useRoute, useRouter } from 'vue-router'
    import { useStore } from 'vuex'

    const store = useStore()
    const route = useRoute()
    const router = useRouter()

    // 点击导航到首页
    const goHome = () => {
        router.push('/home')
    }
</script>

<style lang="scss" scoped>
    // 隐藏滚动条
    ::-webkit-scrollbar {
        width: 0;
        height: 0;
    }
    .el-aside {
        background-color: #304156;
        transition: 0.3s;
        .el-menu {
            background-color: #304156;
            border: #304156;
            height: 100%;
        }
        box-shadow: 2px 0 6px rgb(0 21 41 / 35%);
    }
    .siteTitle {
        cursor: pointer;
        font-weight: bold;
        font-size: 14px;
        text-align: center;
        height: 56px;
        line-height: 56px;
        background-color: #304156;
        color: #fff;
        position: sticky;
        top: 0;
        left: 0;
        z-index: 10;
        display: flex;
        justify-content: center;
        align-items: center;
        overflow: hidden;
        span {
            margin-left: 10px;
        }
        img {
            width: 20px;
        }
    }
    :deep(.el-sub-menu) .el-menu-item {
        background-color: #1f2d3d;
    }
    :deep(.el-menu-item):hover,
    :deep(.el-sub-menu__title):hover {
        background-color: #2d3d52;
    }
    :deep(.el-sub-menu) .el-menu-item:hover {
        background-color: #001528;
    }
</style>
