<template>
    <div>
        <!-- 面包屑导航 -->
        <el-breadcrumb separator="/">
            <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>添加产品</el-breadcrumb-item>
        </el-breadcrumb>

        <el-card>
            <template #header>
                <div class="card-header">
                    <span>添加产品</span>
                </div>
            </template>

            <el-form
                ref="addProductFormRef"
                :model="addProductForm"
                :rules="addProductFormFules"
                label-width="120px"
                class="demo-ruleForm"
                status-icon
            >
                <!-- 产品名称 -->
                <el-form-item
                    label="产品名称"
                    prop="product_name"
                >
                    <el-input v-model="addProductForm.product_name" />
                </el-form-item>
                <!-- 产品简述 -->
                <el-form-item
                    label="产品简述"
                    prop="product_brief"
                >
                    <el-input v-model="addProductForm.product_brief" />
                </el-form-item>
                <!-- 产品详述 -->
                <el-form-item
                    label="产品详述"
                    prop="product_detail"
                >
                    <el-input
                        v-model="addProductForm.product_detail"
                        type="textarea"
                        autosize
                    />
                </el-form-item>
                <!-- 产品图片 -->
                <el-form-item
                    label="产品图片"
                    prop="product_image"
                >
                    <UploadImage
                        :avatar="addProductForm.product_image"
                        @fileChange="fileChange"
                    />
                </el-form-item>
                <!-- 按钮 -->
                <div class="button">
                    <!-- 提交按钮 -->
                    <el-form-item class="submit">
                        <el-button
                            type="primary"
                            @click="submitForm()"
                            size="large"
                        >
                            添加产品
                        </el-button>
                    </el-form-item>
                    <!-- 重置按钮 -->
                    <el-form-item class="submit">
                        <el-button
                            type="info"
                            @click="resetForm()"
                            size="large"
                        >
                            清空
                        </el-button>
                    </el-form-item>
                </div>
            </el-form>
        </el-card>
    </div>
</template>

<script setup>
    import { ref, reactive, toRaw } from 'vue'
    import upload from '@/util/upload'
    import UploadImage from '@/components/Upload/UploadImage.vue'
    import loseFocus from '@/util/loseFocus.js'

    const addProductFormRef = ref()
    // 产品表单
    const addProductForm = reactive({
        product_name: '',
        product_brief: '',
        product_detail: '',
        product_image: '',
        file: null,
    })
    // 保存初始表单
    const initAddProductForm = JSON.parse(JSON.stringify(toRaw(addProductForm)))
    // 验证规则
    const addProductFormFules = reactive({
        product_name: [{ required: true, message: '请输入产品名称', trigger: 'blur' }],
        product_brief: [{ required: true, message: '请输入产品简述', trigger: 'blur' }],
        product_detail: [{ required: true, message: '请输入产品详述', trigger: 'blur' }],
        product_image: [{ required: true, message: '请上传产品图片', trigger: 'blur' }],
    })
    // 选择图片
    const fileChange = file => {
        // console.log(file)
        addProductForm.product_image = URL.createObjectURL(file)
        addProductForm.file = file
    }

    // 提交表单
    const submitForm = () => {
        loseFocus()
        addProductFormRef.value.validate(async isValid => {
            // 如果验证通过
            if (isValid) {
                try {
                    const res = await upload('/admin/product/add', addProductForm)
                    // console.log(res.status === 201)
                    if (res.status === 201) {
                        // 清空表单
                        resetForm()
                        // 通知
                        ElMessage.success(res.data.message)
                    }
                } catch (err) {
                    ElMessage.error(err.response.data.message)
                }
            }
        })
    }
    // 重置表单
    const resetForm = () => {
        // 如果不是点击按钮触发的这个函数，则不会有bubbles，即冒泡事件，所以需要判断
        if (event.bubbles) {
            loseFocus()
        }
        for (const i in addProductForm) {
            addProductForm[i] = initAddProductForm[i]
        }
        addProductFormRef.value.resetFields()
    }
</script>

<style lang="scss" scoped>
    .el-card {
        margin-top: 20px;
    }
    .button {
        display: flex;
        justify-content: flex-start;
        .el-form-item {
            width: 110px;
        }
    }
</style>
