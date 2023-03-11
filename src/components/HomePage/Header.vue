<template>
    <el-header>
        <el-icon
            @click="handleCollapsed"
            size="25"
        >
            <Expand />
        </el-icon>
        Header
    </el-header>
</template>

<script setup>
    import { Fold, Expand } from '@element-plus/icons-vue'
    import { useStore } from 'vuex'

    const store = useStore()
    const handleCollapsed = () => {
        store.commit('changeCollapse')
    }
</script>

<style lang="scss" scope></style>
