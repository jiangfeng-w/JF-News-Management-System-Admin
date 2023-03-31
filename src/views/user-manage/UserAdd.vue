<template>
    <div>
        <!-- 面包屑导航 -->
        <el-breadcrumb separator="/">
            <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>添加用户</el-breadcrumb-item>
        </el-breadcrumb>

        <!-- 添加 -->
        <el-card class="basicInfo">
            <template #header>
                <div class="card-header">
                    <span>基本资料</span>
                </div>
            </template>
            <!-- 表单 -->
            <el-form
                ref="addUserFormRef"
                :model="addUserForm"
                :rules="addUserFormFules"
                label-width="120px"
                class="demo-ruleForm"
                status-icon
            >
                <!-- 用户名 -->
                <el-form-item
                    label="用户名"
                    prop="username"
                >
                    <el-input v-model="addUserForm.username" />
                </el-form-item>
                <!-- 密码 -->
                <el-form-item
                    label="密码"
                    prop="password"
                >
                    <el-input
                        v-model="addUserForm.password"
                        type="password"
                    />
                </el-form-item>
                <!-- 确认密码 -->
                <el-form-item
                    label="确认密码"
                    prop="checkPass"
                >
                    <el-input
                        v-model="addUserForm.checkPass"
                        type="password"
                    />
                </el-form-item>
                <!-- 介绍 -->
                <el-form-item
                    label="个人介绍"
                    prop="introduction"
                >
                    <el-input
                        v-model="addUserForm.introduction"
                        type="textarea"
                        autosize
                    />
                </el-form-item>
                <!-- 角色 -->
                <el-form-item
                    label="角色"
                    prop="role"
                >
                    <el-radio-group v-model="addUserForm.role">
                        <el-radio :label="1">管理员</el-radio>
                        <el-radio :label="2">编辑</el-radio>
                    </el-radio-group>
                </el-form-item>
                <!-- 性别 -->
                <el-form-item
                    label="性别"
                    prop="gender"
                >
                    <el-radio-group v-model="addUserForm.gender">
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
                        :avatar="addUserForm.avatar"
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
                            添加
                        </el-button>
                    </el-form-item>
                    <!-- 提交按钮 -->
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
    import axios from 'axios'
    import { ref, reactive, toRaw } from 'vue'
    import upload from '../../util/upload'
    import { ElMessage } from 'element-plus'

    const addUserFormRef = ref()
    // 表单数据
    const addUserForm = reactive({
        username: '',
        password: '',
        checkPass: '',
        introduction: '',
        role: 1,
        gender: 1,
        avatar: null,
        file: null,
    })
    // 保存初始表单
    const initAddUserForm = JSON.parse(JSON.stringify(toRaw(addUserForm)))

    // 校验规则
    const addUserFormFules = reactive({
        username: [
            { required: true, message: '用户名不能为空', trigger: 'blur' },
            { min: 2, message: '用户名至少为2个字符', trigger: 'blur' },
            { max: 10, message: '用户名最多为10个字符', trigger: 'blur' },
        ],
        password: [
            { required: true, message: '密码不能为空', trigger: 'blur' },
            { min: 6, max: 16, message: '密码长度在6到16位之间', trigger: 'blur' },
            {
                validator: (rule, value, callback) => {
                    const reg = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]+$/
                    if (!reg.test(value)) {
                        callback(new Error('密码为字母和数字组合'))
                    } else if (addUserForm.checkPass !== '') {
                        if (!addUserFormRef.value) return
                        addUserFormRef.value.validateField('checkPass', () => null)
                    }
                    callback()
                },
                trigger: 'blur',
            },
        ],
        checkPass: [
            { required: true, message: '请再次输入密码', trigger: 'blur' },
            {
                validator: (rule, value, callback) => {
                    if (value !== addUserForm.password) {
                        callback(new Error('两次密码输入不一致'))
                    } else {
                        callback()
                    }
                },
                trigger: 'blur',
            },
        ],
        role: [{ required: true, message: '角色不能为空', trigger: 'blur' }],
        gender: [{ required: true, message: '性别不能为空', trigger: 'blur' }],
    })

    // 选择图片
    const handleChange = file => {
        // console.log(file)
        addUserForm.avatar = URL.createObjectURL(file)
        addUserForm.file = file
    }
    // 清空表单
    const resetForm = () => {
        for (const i in initAddUserForm) {
            addUserForm[i] = initAddUserForm[i]
        }
    }

    // 提交表单
    const submitForm = () => {
        addUserFormRef.value.validate(async isValid => {
            // 如果验证通过
            if (isValid) {
                try {
                    const res = await upload('/admin/user/add', addUserForm)
                    if (res.status === 201) {
                        // 清空表单
                        resetForm()
                        // 通知
                        ElMessage.success(res.data.message)
                    }
                } catch (err) {
                    ElMessage.error(err.response.data.error)
                }
            } else {
                ElMessage.error('请正确填写信息后提交')
            }
        })
    }
</script>

<style scope lang="scss">
    .el-card {
        margin-top: 20px;
    }
    .button {
        display: flex;
        justify-content: flex-start;
        .el-form-item {
            width: 100px;
        }
    }
</style>
