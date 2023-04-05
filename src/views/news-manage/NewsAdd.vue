<template>
    <div>
        <!-- 面包屑导航 -->
        <el-breadcrumb separator="/">
            <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>添加新闻</el-breadcrumb-item>
        </el-breadcrumb>

        <el-card>
            <template #header>
                <div class="card-header">
                    <span>创建新闻</span>
                </div>
            </template>

            <el-form
                ref="addNewsFormRef"
                :model="addNewsForm"
                :rules="addNewsFormFules"
                label-width="120px"
                class="demo-ruleForm"
                status-icon
            >
                <!-- 新闻标题 -->
                <el-form-item
                    label="新闻标题"
                    prop="title"
                >
                    <el-input v-model="addNewsForm.title" />
                </el-form-item>
                <!-- 新闻内容 -->
                <el-form-item
                    label="新闻内容"
                    prop="content"
                >
                    <RichText
                        :content="addNewsForm.content"
                        @contentChange="contentChange"
                    />
                </el-form-item>
                <!-- 新闻分类 -->
                <el-form-item
                    label="新闻分类"
                    prop="category"
                >
                    <el-radio-group v-model="addNewsForm.category">
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
                        :avatar="addNewsForm.cover"
                        @fileChange="handleChange"
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
                            创建新闻
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
    import RichText from '@/components/RichText/RichText.vue'
    import UploadImage from '@/components/Upload/UploadImage.vue'
    import { useRouter } from 'vue-router'
    import loseFocus from '@/util/loseFocus.js'

    const addNewsFormRef = ref()
    // 新闻表单
    const addNewsForm = reactive({
        title: '',
        content: '',
        category: 1,
        cover: '',
        file: null,
        isPublishd: 0,
    })
    // 保存表单初始值
    const initAddNewsForm = JSON.parse(JSON.stringify(toRaw(addNewsForm)))

    // 验证规则
    const addNewsFormFules = reactive({
        title: [{ required: true, message: '请输入标题', trigger: 'blur' }],
        content: [{ required: true, message: '请输入内容', trigger: 'blur' }],
        category: [{ required: true, message: '请选择类别', trigger: 'blur' }],
        cover: [{ required: true, message: '请上传封面', trigger: 'blur' }],
    })
    //
    // 富文本改变
    const contentChange = text => {
        // console.log(text)
        addNewsForm.content = text
    }
    // 封面图片改变
    const handleChange = file => {
        // console.log(file)
        addNewsForm.cover = URL.createObjectURL(file)
        addNewsForm.file = file
    }
    // 清空表单
    const resetForm = () => {
        // 如果不是点击按钮触发的这个函数，则不会有bubbles，即冒泡事件，所以需要判断
        if (event.bubbles) {
            loseFocus()
        }
        for (const i in initAddNewsForm) {
            addNewsForm[i] = initAddNewsForm[i]
        }
        addNewsFormRef.value.resetFields()
    }

    // 实例router对象
    const router = useRouter()
    // 提交表单
    const submitForm = () => {
        loseFocus()
        addNewsFormRef.value.validate(async isValid => {
            if (isValid) {
                try {
                    const res = await upload('/admin/news/add', addNewsForm)
                    if (res.status === 201) {
                        // router.push('/news-manage/newslist')
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
