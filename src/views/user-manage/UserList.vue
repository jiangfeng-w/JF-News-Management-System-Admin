<template>
    <div>
        <!-- 面包屑导航 -->
        <el-breadcrumb separator="/">
            <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>用户列表</el-breadcrumb-item>
        </el-breadcrumb>

        <el-card>
            <el-table
                :data="tableData"
                style="width: 100%"
                :cell-style="{ textAlign: 'center' }"
                :header-cell-style="{ 'text-align': 'center' }"
            >
                <!-- 用户名 -->
                <el-table-column
                    prop="username"
                    label="用户名"
                />
                <!-- 头像 -->
                <el-table-column label="头像">
                    <template #default="scope">
                        <el-avatar
                            :size="50"
                            :src="scope.row.avatar"
                        ></el-avatar>
                    </template>
                </el-table-column>
                <!-- 角色 -->
                <el-table-column label="角色">
                    <template #default="scope">
                        <el-tag :type="scope.row.role === 1 ? '' : 'success'">
                            {{ scope.row.role === 1 ? '管理员' : '编辑' }}
                        </el-tag>
                    </template>
                </el-table-column>
                <!-- 操作 -->
                <el-table-column label="操作">
                    <template #default="scope">
                        <el-button
                            type="primary"
                            size="small"
                            @click="editButton(scope.row)"
                        >
                            编辑
                        </el-button>
                        <el-popconfirm
                            width="220"
                            confirm-button-text="确认"
                            cancel-button-text="取消"
                            title="确认删除此用户?"
                            @confirm="deleteButton(scope.row)"
                        >
                            <template #reference>
                                <el-button
                                    type="danger"
                                    size="small"
                                >
                                    删除
                                </el-button>
                            </template>
                        </el-popconfirm>
                    </template>
                </el-table-column>
            </el-table>
        </el-card>

        <!-- 编辑用户对话框 -->
        <el-dialog
            v-model="dialogVisible"
            title="编辑用户"
            width="50%"
        >
            <el-form
                ref="editUserFormRef"
                :model="editUserForm"
                :rules="editUserFormFules"
                label-width="120px"
                class="demo-ruleForm"
                status-icon
            >
                <!-- 用户名 -->
                <el-form-item
                    label="用户名"
                    prop="username"
                >
                    <el-input
                        placeholder="请输入用户名"
                        v-model="editUserForm.username"
                    />
                </el-form-item>
                <!-- 密码 -->
                <el-form-item
                    label="密码"
                    prop="password"
                >
                    <el-input
                        placeholder="请输入新密码"
                        v-model="editUserForm.password"
                        type="password"
                    />
                </el-form-item>

                <!-- 角色 -->
                <el-form-item
                    label="角色"
                    prop="role"
                >
                    <el-radio-group v-model="editUserForm.role">
                        <el-radio :label="1">管理员</el-radio>
                        <el-radio :label="2">编辑</el-radio>
                    </el-radio-group>
                </el-form-item>
                <!-- 介绍 -->
                <el-form-item
                    label="个人介绍"
                    prop="introduction"
                >
                    <el-input
                        placeholder="请输入个人介绍"
                        v-model="editUserForm.introduction"
                        type="textarea"
                        autosize
                    />
                </el-form-item>
            </el-form>
            <template #footer>
                <span class="dialog-footer">
                    <el-button
                        type="primary"
                        @click="editConfirm()"
                    >
                        确认
                    </el-button>
                    <el-button @click="dialogVisible = false">取消</el-button>
                </span>
            </template>
        </el-dialog>
    </div>
</template>

<script setup>
    import { reactive, ref, onMounted, toRaw } from 'vue'
    import axios from 'axios'

    const tableData = reactive([])
    // 获取用户列表数据
    const getFormData = async () => {
        const res = await axios.get('/admin/user/list')
        // tableData.push(...res.data.data)
        Object.assign(tableData, res.data.data)
        // console.log(tableData)
    }
    onMounted(() => {
        getFormData()
    })
    // 删除按钮
    const deleteButton = async data => {
        // console.log(data)
        try {
            const res = await axios.delete(`/admin/user/list/${data.id}`)
            if (res.status === 200) {
                ElMessage.success(res.data.message)
                // 重新获取数据
                getFormData()
            }
        } catch (err) {
            ElMessage.error(err.response.data.message)
        }
    }

    // 对话框是否可见
    const dialogVisible = ref(false)
    // 编辑用户表单
    const editUserFormRef = ref()
    const editUserForm = reactive({
        username: '',
        password: '',
        introduction: '',
        role: null,
    })
    let inntEditUserForm = null
    // 校验规则
    const editUserFormFules = reactive({
        username: [
            { required: true, message: '用户名不能为空', trigger: 'blur' },
            { min: 2, message: '用户名至少为2个字符', trigger: 'blur' },
            { max: 10, message: '用户名最多为10个字符', trigger: 'blur' },
        ],
        password: [
            { min: 6, max: 16, message: '密码长度在6到16位之间', trigger: 'blur' },
            {
                validator: (rule, value, callback) => {
                    const reg = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]+$/
                    if (value === '') {
                        callback()
                    } else if (!reg.test(value)) {
                        callback(new Error('密码为字母和数字组合'))
                    }
                    callback()
                },
                trigger: 'blur',
            },
        ],
        role: [{ required: true, message: '角色不能为空', trigger: 'blur' }],
    })

    // 编辑按钮
    const editButton = async data => {
        // console.log(data)
        dialogVisible.value = true
        // 用id向后端请求用户数据，避免脏数据
        const res = await axios.get(`/admin/user/list/${data.id}`)
        // console.log(res.data.data)
        Object.assign(editUserForm, res.data.data)
        // 保存原始数据
        inntEditUserForm = JSON.parse(JSON.stringify(toRaw(editUserForm)))
    }

    // 确认提交
    const editConfirm = () => {
        editUserFormRef.value.validate(async isValid => {
            // 表单数据改变了
            if (!(JSON.stringify(inntEditUserForm) === JSON.stringify(editUserForm))) {
                // 验证通过
                if (isValid) {
                    // console.log(editUserForm)
                    try {
                        const res = await axios.put(`/admin/user/list/${editUserForm.id}`, editUserForm)
                        if (res.status === 200) {
                            ElMessage.success(res.data.message)
                            dialogVisible.value = false
                        }
                    } catch (err) {
                        ElMessage.error(err.response.data.message)
                    }
                }
            } else {
                ElMessage.info('请修改信息后提交')
            }
        })
    }
</script>

<style lang="scss" scope></style>
