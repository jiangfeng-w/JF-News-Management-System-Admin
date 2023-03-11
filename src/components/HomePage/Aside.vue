<template>
    <el-aside :width="$store.state.isCollapse ? '64px' : '180px'">
        <p class="siteTitle">企业门户管理</p>
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
            <el-menu-item index="/center">
                <el-icon><Avatar /></el-icon>
                <span>个人中心</span>
            </el-menu-item>

            <!-- 用户管理 -->
            <el-sub-menu index="/user-manage">
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
    import { useRoute } from 'vue-router'
    const route = useRoute()
</script>

<style lang="scss" scope>
    .siteTitle {
        font-weight: bold;
        text-align: center;
        height: 56px;
        line-height: 56px;
        background-color: #304156;
        color: #fff;
        position: sticky;
        top: 0;
        left: 0;
        z-index: 10;
    }
    .el-aside {
        background-color: #304156;
        height: 100vh;
        transition: 0.3s;
        .el-menu {
            background-color: #304156;
            border: #304156;
        }
    }
    .el-menu-item:hover,
    .el-sub-menu__title:hover {
        background-color: #2d3d51;
    }
    .el-sub-menu .el-menu-item {
        background-color: #1f2d3d;
    }
    .el-sub-menu .el-menu-item:hover {
        background-color: #001528;
    }
</style>
