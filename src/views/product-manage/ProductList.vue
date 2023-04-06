<!--
 * @作者: kerwin
 * @公众号: 大前端私房菜
-->
<template>
    <div>
        <!-- 面包屑导航 -->
        <el-breadcrumb separator="/">
            <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>产品列表</el-breadcrumb-item>
        </el-breadcrumb>

        <!-- 列表 -->
        <el-card>
            <el-table
                :data="tableData"
                style="width: 100%"
                :cell-style="{ textAlign: 'center' }"
                :header-cell-style="{ 'text-align': 'center' }"
            >
                <!-- 产品名称 -->
                <el-table-column
                    class="product_name"
                    prop="product_name"
                    label="产品名称"
                    width="250"
                ></el-table-column>
                <!-- 简要描述 -->
                <el-table-column
                    class="product_brief"
                    prop="product_brief"
                    label="简要描述"
                    width="250"
                ></el-table-column>

                <!-- 更新时间 -->
                <el-table-column
                    label="更新时间"
                    min-width="110"
                >
                    <template #default="scope">
                        {{ formatTime(scope.row.update_time) }}
                    </template>
                </el-table-column>
                <!-- 操作 -->
                <el-table-column
                    label="操作"
                    width="250"
                >
                    <template #default="scope">
                        <!-- 编辑按钮 -->
                        <el-button
                            type="primary"
                            size="small"
                            plain
                            :icon="Edit"
                            @click="editButton(scope.row)"
                        >
                            编辑
                        </el-button>
                        <!-- 删除按钮 -->
                        <el-popconfirm
                            width="220"
                            confirm-button-text="确认"
                            cancel-button-text="取消"
                            title="确认删除此产品?"
                            @confirm="deleteConfirm(scope.row)"
                        >
                            <template #reference>
                                <el-button
                                    type="danger"
                                    size="small"
                                    plain
                                    :icon="Delete"
                                    @click="loseFocus()"
                                >
                                    删除
                                </el-button>
                            </template>
                        </el-popconfirm>
                    </template>
                </el-table-column>
            </el-table>
        </el-card>

        <!-- 编辑产品 -->
        <el-dialog
            v-model="editProductDialog"
            title="编辑产品"
            width="60%"
            @closed="closeEditDialog"
        >
            <el-form
                ref="editProductFormRef"
                :model="editProductForm"
                :rules="editProductFormFules"
                label-width="120px"
                class="demo-ruleForm"
                status-icon
            >
                <!-- 产品名称 -->
                <el-form-item
                    label="产品名称"
                    prop="product_name"
                >
                    <el-input v-model="editProductForm.product_name" />
                </el-form-item>
                <!-- 产品简述 -->
                <el-form-item
                    label="产品简述"
                    prop="product_brief"
                >
                    <el-input
                        v-model="editProductForm.product_brief"
                        type="textarea"
                        autosize
                    />
                </el-form-item>
                <!-- 产品详述 -->
                <el-form-item
                    label="产品详述"
                    prop="product_detail"
                >
                    <el-input
                        v-model="editProductForm.product_detail"
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
                        :avatar="editProductForm.product_image"
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
                            更新
                        </el-button>
                    </el-form-item>
                    <!-- 重置按钮 -->
                    <el-form-item class="submit">
                        <el-button
                            @click="editProductDialog = false"
                            size="large"
                        >
                            取消
                        </el-button>
                    </el-form-item>
                </div>
            </el-form>
        </el-dialog>
    </div>
</template>

<script setup>
    import { ref, reactive, onMounted, toRaw } from 'vue'
    import { Edit, Delete } from '@element-plus/icons-vue'
    import axios from 'axios'
    import dayjs from 'dayjs'
    import { ElMessage } from 'element-plus'
    import loseFocus from '@/util/loseFocus'
    import UploadImage from '@/components/Upload/UploadImage.vue'
    import upload from '@/util/upload'

    const tableData = reactive([])
    // 获取新闻列表数据
    const getTableData = async () => {
        const res = await axios.get('/admin/product/list')
        // 使用解构赋值和splice方法替换tableData中的元素
        tableData.splice(0, tableData.length, ...res.data.data)
        // console.log(tableData)
    }
    onMounted(() => {
        getTableData()
    })
    // 格式化时间
    const formatTime = timeStamp => {
        const formattedTime = dayjs(timeStamp).format('YYYY-MM-DD HH:mm:ss')
        return formattedTime
    }

    // 确认删除
    const deleteConfirm = async data => {
        // console.log(data)
        try {
            const res = await axios.put(`/admin/product/list/${data.id}`, {
                product_image: data.product_image,
            })
            if (res.status === 200) {
                // ElMessage.success(res.data.message)
                // 重新获取数据
                getTableData()
            }
        } catch (err) {
            ElMessage.error(err.response.data.message)
            getTableData()
        }
    }

    //#region 编辑产品
    // 编辑新闻对话框
    const editProductDialog = ref(false)
    // 编辑对话框数据
    let editProductForm = reactive({})
    const editProductFormRef = ref()
    let initEditProductForm
    // 打开编辑新闻对话框
    const editButton = async item => {
        loseFocus()
        editProductDialog.value = true
        // 用id向后端请求用户数据，避免脏数据
        const res = await axios.get(`/admin/product/list/${item.id}`)
        Object.assign(editProductForm, res.data.data)

        editProductForm.oldImage = res.data.data.product_image
        // 保存原始数据
        initEditProductForm = JSON.parse(JSON.stringify(toRaw(editProductForm)))
    }
    // 编辑新闻验证规则
    const editProductFormFules = reactive({
        product_name: [{ required: true, message: '请输入产品名称', trigger: 'blur' }],
        product_brief: [{ required: true, message: '请输入产品简述', trigger: 'blur' }],
        product_detail: [{ required: true, message: '请输入产品详述', trigger: 'blur' }],
        product_image: [{ required: true, message: '请上传产品图片', trigger: 'blur' }],
    })
    // 封面图片改变
    const fileChange = file => {
        // console.log(file)
        editProductForm.product_image = URL.createObjectURL(file)
        editProductForm.file = file
    }
    // 确认更新
    const submitForm = () => {
        loseFocus()
        editProductFormRef.value.validate(async isValid => {
            // 表单数据改变了
            if (!(JSON.stringify(initEditProductForm) === JSON.stringify(editProductForm))) {
                // 验证通过
                if (isValid) {
                    // console.log(editProductForm)
                    try {
                        const res = await upload(`/admin/product/list`, editProductForm)
                        if (res.status === 200) {
                            ElMessage.success(res.data.message)
                            getTableData()
                            editProductDialog.value = false
                        }
                    } catch (err) {
                        ElMessage.error(err.response.data.message)
                        getTableData()
                    }
                }
            } else {
                ElMessage.info('请修改后再提交')
            }
        })
    }
    // 退出之后清空dialog
    const closeEditDialog = () => {
        editProductForm = reactive({})
    }
    //#endregion
</script>

<style lang="scss" scoped>
    .el-card {
        margin-top: 20px;
    }

    :deep(.cell) {
        white-space: nowrap;
        text-overflow: ellipsis;
    }
    .button {
        display: flex;
        justify-content: flex-start;
        .el-form-item {
            width: 80px;
        }
    }
</style>
