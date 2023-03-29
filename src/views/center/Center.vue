<template>
    <div>
        <!-- 面包屑导航 -->
        <el-breadcrumb separator="/">
            <el-breadcrumb-item>首页</el-breadcrumb-item>
            <el-breadcrumb-item>个人中心</el-breadcrumb-item>
        </el-breadcrumb>

        <!-- 主体 -->
        <el-row :gutter="20">
            <el-col :span="6">
                <el-card class="userInfo">
                    <template #header>
                        <div class="card-header">
                            <span>个人信息</span>
                        </div>
                    </template>
                    <!-- 头像 -->
                    <el-avatar
                        :size="100"
                        :src="store.state.userInfo.avatar"
                    />
                    <h3>{{ store.state.userInfo.username }}</h3>
                    <h4>{{ store.state.userInfo.role === 1 ? '管理员' : '编辑' }}</h4>
                </el-card>
            </el-col>
            <el-col :span="18">
                <el-card class="basicInfo">
                    <template #header>
                        <div class="card-header">
                            <span>基本资料</span>
                        </div>
                    </template>
                    <!-- 表单 -->
                    <el-form
                        ref="userFormRef"
                        :model="userForm"
                        :rules="userFormFules"
                        label-width="120px"
                        class="demo-ruleForm"
                        status-icon
                    >
                        <!-- 用户名 -->
                        <el-form-item
                            label="用户名"
                            prop="username"
                        >
                            <el-input v-model="userForm.username" />
                        </el-form-item>
                        <!-- 介绍 -->
                        <el-form-item
                            label="个人介绍"
                            prop="introduction"
                        >
                            <el-input
                                v-model="userForm.introduction"
                                type="textarea"
                                autosize
                            />
                        </el-form-item>
                        <!-- 性别 -->
                        <el-form-item
                            label="性别"
                            prop="gender"
                        >
                            <el-radio-group v-model="userForm.gender">
                                <el-radio :label="1">男</el-radio>
                                <el-radio :label="2">女</el-radio>
                            </el-radio-group>
                        </el-form-item>
                        <!-- 头像 -->
                        <el-form-item
                            label="更换头像"
                            prop="avatar"
                        >
                            <UploadAvatar
                                :avatar="userForm.avatar"
                                @fileChange="handleChange"
                            />
                        </el-form-item>
                        <div class="button">
                            <!-- 提交按钮 -->
                            <el-form-item class="submit">
                                <el-button
                                    type="primary"
                                    @click="submitForm()"
                                    size="large"
                                >
                                    保存
                                </el-button>
                            </el-form-item>
                            <!-- 提交按钮 -->
                            <el-form-item class="submit">
                                <el-button
                                    type="info"
                                    @click="resetForm(userFormRef)"
                                    size="large"
                                >
                                    重置
                                </el-button>
                            </el-form-item>
                        </div>
                    </el-form>
                </el-card>
            </el-col>
        </el-row>
    </div>
</template>

<script setup>
    import { useStore } from 'vuex'
    import { ref, reactive, toRaw } from 'vue'
    import upload from '@/util/upload'
    import UploadAvatar from '@/components/Upload/UploadAvatar.vue'
    const store = useStore()
    let { username, gender, introduction, avatar: oldAvatar } = store.state.userInfo
    const userFormRef = ref()
    let userForm = reactive({
        username,
        gender,
        introduction,
        oldAvatar,
        avatar: null,
        file: null,
    })
    // 保存初始表单，用来校验表单是否变化
    let initUserForm = JSON.parse(JSON.stringify(toRaw(userForm)))
    // 校验规则
    const userFormFules = reactive({
        username: [{ required: true, message: '用户名不能为空', trigger: 'blur' }],
        gender: [{ required: true, message: '性别不能为空', trigger: 'blur' }],
    })

    // 选择图片
    const handleChange = file => {
        // console.log(file)
        userForm.avatar = URL.createObjectURL(file)
        userForm.file = file
    }
    // 重置表单
    const resetForm = userFormRef => {
        for (const i in initUserForm) {
            userForm[i] = initUserForm[i]
        }
    }
    // 提交表单
    const submitForm = () => {
        userFormRef.value.validate(async isValid => {
            // 如果验证通过且表单改变了
            if (isValid && !(JSON.stringify(initUserForm) === JSON.stringify(userForm))) {
                const res = await upload('/admin/user/upload', userForm)
                if (res.status === 200) {
                    store.commit('changeUserInfo', res.data.data)

                    // 重新给表单赋值
                    userForm.avatar = ''
                    userForm.oldAvatar = store.state.userInfo.avatar
                    initUserForm = JSON.parse(JSON.stringify(toRaw(userForm)))
                    // 通知
                    ElNotification({
                        message: '信息更新成功',
                        type: 'success',
                    })
                }
            } else {
                ElNotification({
                    message: '请修改信息后提交',
                    type: 'info',
                })
            }
        })
    }
</script>

<style scope lang="scss">
    .el-row {
        margin-top: 20px;
        .userInfo {
            text-align: center;
            .card-header {
                text-align: left;
            }
        }
        .basicInfo {
            .button {
                display: flex;
                justify-content: flex-start;
                .el-form-item {
                    width: 100px;
                }
            }
        }
    }
</style>
