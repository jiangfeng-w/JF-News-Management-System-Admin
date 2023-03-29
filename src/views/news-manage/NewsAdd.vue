<!--
 * @作者: kerwin
 * @公众号: 大前端私房菜
-->
<template>
    <div @click="increase">newsadd{{ a }}--{{ b.c }}</div>
</template>

<script setup>
    import { ref, reactive } from 'vue'
    const a = ref(4)
    const b = reactive({
        c: 2,
    })
    const increase = () => {
        a.value++
        b.c++
    }
</script>

<style></style>
