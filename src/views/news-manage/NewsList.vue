<template>
    <div>
        <!-- 面包屑导航 -->
        <el-breadcrumb separator="/">
            <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>新闻列表</el-breadcrumb-item>
        </el-breadcrumb>

        <!-- 列表 -->
        <el-card>
            <el-table
                :data="tableData"
                style="width: 100%"
                :cell-style="{ textAlign: 'center' }"
                :header-cell-style="{ 'text-align': 'center' }"
            >
                <!-- 标题 -->
                <el-table-column
                    class="title"
                    prop="title"
                    label="新闻标题"
                    width="250"
                ></el-table-column>
                <!-- 类别 -->
                <el-table-column label="新闻分类">
                    <template #default="scope">
                        {{ trueCategory(scope.row.category) }}
                    </template>
                </el-table-column>
                <!-- 更新时间 -->
                <el-table-column
                    label="更新时间"
                    min-width="110"
                >
                    <template #default="scope">
                        {{ formatTime(scope.row.updateTime) }}
                    </template>
                </el-table-column>
                <!-- 是否发布 -->
                <el-table-column label="是否发布">
                    <template #default="scope">
                        <el-switch
                            v-model="scope.row.isPublishd"
                            :active-value="1"
                            :inactive-value="0"
                            @change="handleChange(scope.row)"
                        />
                    </template>
                </el-table-column>
                <!-- 操作 -->
                <el-table-column
                    label="操作"
                    width="250"
                >
                    <template #default="scope">
                        <!-- 预览按钮 -->
                        <el-button
                            color="#626aef"
                            size="small"
                            plain
                            :icon="View"
                            @click="previewNews(scope.row)"
                        >
                            预览
                        </el-button>
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
                            title="确认删除此新闻?"
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

        <!-- 预览新闻对话框 -->
        <el-dialog
            v-model="previewDialog"
            title="新闻预览"
            width="50%"
        >
            <div class="previewnews_title">
                <h2>{{ previewData.title }}</h2>
                <div class="newsTime">{{ formatTime(previewData.updateTime) }}</div>
                <el-divider />
            </div>
            <div
                class="previewnews_content"
                v-html="previewData.content"
            ></div>
        </el-dialog>

        <!-- 编辑新闻 -->
        <el-dialog
            v-model="editDialog"
            title="编辑用户"
            width="60%"
            @closed="closeEditDialog"
            top="0"
        >
            <el-form
                ref="editNewsFormRef"
                :model="editNewsForm"
                :rules="editNewsFormFules"
                label-width="120px"
                class="demo-ruleForm"
                status-icon
            >
                <!-- 新闻标题 -->
                <el-form-item
                    label="新闻"
                    prop="title"
                >
                    <el-input v-model="editNewsForm.title" />
                </el-form-item>
                <!-- 新闻内容 -->
                <el-form-item
                    label="新闻内容"
                    prop="content"
                >
                    <RichText
                        class="editnew_content"
                        :content="editNewsForm.content"
                        @contentChange="contentChange"
                    />
                </el-form-item>
                <!-- 新闻分类 -->
                <el-form-item
                    label="新闻内容"
                    prop="category"
                >
                    <el-radio-group v-model="editNewsForm.category">
                        <el-radio
                            :label="1"
                            border
                        >
                            最新动态
                        </el-radio>
                        <el-radio
                            :label="2"
                            border
                        >
                            典型案例
                        </el-radio>
                        <el-radio
                            :label="3"
                            border
                        >
                            通知公告
                        </el-radio>
                    </el-radio-group>
                </el-form-item>
                <!-- 新闻封面 -->
                <el-form-item
                    label="新闻封面"
                    prop="cover"
                >
                    <UploadImage
                        :max_width="'500px'"
                        :max_height="'300px'"
                        :avatar="editNewsForm.cover"
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
                            @click="editDialog = false"
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
    import { Edit, Delete, View } from '@element-plus/icons-vue'
    import axios from 'axios'
    import dayjs from 'dayjs'
    import { ElMessage } from 'element-plus'
    import loseFocus from '@/util/loseFocus'
    import RichText from '@/components/RichText/RichText.vue'
    import UploadImage from '@/components/Upload/UploadImage.vue'
    import upload from '@/util/upload'

    const tableData = reactive([])
    // 获取新闻列表数据
    const getTableData = async () => {
        const res = await axios.get('/admin/news/list')

        // const newTableData = []
        // for (const user of res.data.data) {
        //     newTableData.push(user)
        // }
        // 使用解构赋值和splice方法替换tableData中的元素
        tableData.splice(0, tableData.length, ...res.data.data)
        // console.log(tableData)
    }
    onMounted(() => {
        getTableData()
    })
    // 分类的值
    const trueCategory = item => {
        const cateArr = ['最新动态', '典型案例', '通知公告']
        return cateArr[item - 1]
    }
    // 格式化时间
    const formatTime = timeStamp => {
        const formattedTime = dayjs(timeStamp).format('YYYY-MM-DD HH:mm:ss')
        return formattedTime
    }

    // 是否发布变化
    const handleChange = async item => {
        try {
            const res = await axios.put('/admin/news/publish', {
                id: item.id,
                isPublishd: item.isPublishd,
            })
            if (res.status === 200) {
                getTableData()
            }
        } catch (err) {
            ElMessage.error(err.response.data.message)
            // 报错说明更新失败，重新获取列表
            getTableData()
        }
    }

    //#region 预览新闻
    // 预览新闻对话框
    const previewDialog = ref(false)
    // 对话框数据
    const previewData = ref({})
    // 预览新闻
    const previewNews = item => {
        loseFocus()
        previewData.value = item
        previewDialog.value = true
    }
    //#endregion

    const editNewsFormRef = ref()
    // 编辑新闻对话框
    const editDialog = ref(false)
    // 编辑对话框数据
    let editNewsForm = reactive({})
    let initEditNewsForm
    // 打开编辑新闻对话框
    const editButton = async item => {
        loseFocus()
        editDialog.value = true
        // 用id向后端请求用户数据，避免脏数据
        const res = await axios.get(`/admin/news/list/${item.id}`)
        Object.assign(editNewsForm, res.data.data)

        editNewsForm.oldCover = res.data.data.cover
        // 保存原始数据
        initEditNewsForm = JSON.parse(JSON.stringify(toRaw(editNewsForm)))
    }
    // 编辑新闻验证规则
    const editNewsFormFules = reactive({
        title: [{ required: true, message: '请输入标题', trigger: 'blur' }],
        content: [{ required: true, message: '请输入内容', trigger: 'blur' }],
        category: [{ required: true, message: '请选择类别', trigger: 'blur' }],
        cover: [{ required: true, message: '请上传封面', trigger: 'blur' }],
    })
    // 内容变动
    const contentChange = text => {
        // console.log(text)
        editNewsForm.content = text
    }
    // 封面图片改变
    const fileChange = file => {
        // console.log(file)
        editNewsForm.cover = URL.createObjectURL(file)
        editNewsForm.file = file
    }
    // 确认更新
    const submitForm = () => {
        loseFocus()
        editNewsFormRef.value.validate(async isValid => {
            // 表单数据改变了
            if (!(JSON.stringify(initEditNewsForm) === JSON.stringify(editNewsForm))) {
                // 验证通过
                if (isValid) {
                    // console.log(editNewsForm)
                    try {
                        const res = await upload(`/admin/news/list`, editNewsForm)
                        if (res.status === 200) {
                            ElMessage.success(res.data.message)
                            getTableData()
                            editDialog.value = false
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
        editNewsForm = reactive({})
    }

    // 删除新闻
    const deleteConfirm = async item => {
        loseFocus()
        // console.log(item)
        try {
            const res = await axios.put(`/admin/news/list/${item.id}`, {
                cover: item.cover,
            })
            if (res.status === 200) {
                getTableData()
            }
        } catch (err) {
            ElMessage.error(err.response.data.message)
            getTableData()
        }
    }
</script>

<style lang="scss" scoped>
    .el-card {
        margin-top: 20px;
    }
    :deep(.cell) {
        white-space: nowrap;
        text-overflow: ellipsis;
    }
    .newsTime {
        color: gray;
        margin-top: 10px;
    }
    :deep(.previewnews_content) {
        height: 400px;
        overflow-y: scroll;
        img {
            max-width: 100%;
        }
    }
    :deep(.editnew_content) {
        img {
            max-width: 100%;
        }
    }
    .button {
        display: flex;
        justify-content: flex-start;
        .el-form-item {
            width: 80px;
        }
    }
</style>
