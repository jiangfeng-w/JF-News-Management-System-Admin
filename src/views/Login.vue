<template>
    <div>
        <Particles
            id="tsparticles"
            :particlesInit="particlesInit"
            :options="options"
        />

        <!-- 登录表单 -->
        <div class="login">
            <h3>企业门户网站管理系统</h3>
            <el-form
                ref="loginFormRef"
                :model="loginForm"
                status-icon
                :rules="loginRules"
                label-width="0"
                class="loginForm"
            >
                <!-- 用户名 -->
                <el-form-item prop="username">
                    <el-input
                        v-model="loginForm.username"
                        :prefix-icon="User"
                        placeholder="请输入用户名"
                        @keyup.enter="submitForm()"
                    />
                </el-form-item>
                <!-- 密码 -->
                <el-form-item prop="password">
                    <el-input
                        v-model="loginForm.password"
                        type="password"
                        :prefix-icon="Lock"
                        placeholder="请输入密码"
                        @keyup.enter="submitForm()"
                    />
                </el-form-item>
                <!-- 按钮 -->
                <el-form-item class="submit">
                    <el-button
                        type="primary"
                        @click="submitForm()"
                    >
                        登录
                    </el-button>
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>

<script setup>
    import { loadFull } from 'tsparticles'
    import { reactive, ref } from 'vue'
    import { useRouter } from 'vue-router'
    import { User, Lock } from '@element-plus/icons-vue'
    import axios from 'axios'
    import { useStore } from 'vuex'

    //登录表单
    const loginForm = reactive({
        username: '',
        password: '',
    })
    // 表单绑定的响应式对象
    const loginFormRef = ref()
    // 登录表单校验规则
    const loginRules = reactive({
        username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
        password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
    })

    const router = useRouter()
    const store = useStore()
    // 提交表单
    const submitForm = () => {
        // 表单校验
        loginFormRef.value.validate(isValid => {
            if (isValid) {
                axios
                    .post('/admin/user/login', loginForm)
                    .then(res => {
                        // console.log(res.data)
                        if (res.status === 200) {
                            router.push('/home')
                            // 存储用户信息
                            store.commit('changeUserInfo', res.data.data)
                            store.commit('changeGetterRouter', false)
                        }
                    })
                    .catch(err => {
                        ElMessage.error(err.response.data.message)
                    })
            }
        })
    }

    // 粒子动效初始化
    const particlesInit = async engine => {
        await loadFull(engine)
    }
    // 粒子动效配置
    const options = {
        background: {
            color: {
                value: '#2b3a49',
            },
        },
        fpsLimit: 120,
        interactivity: {
            events: {
                onClick: {
                    enable: true,
                    mode: 'push',
                },
                onHover: {
                    enable: true,
                    mode: 'repulse',
                },
                resize: true,
            },
            modes: {
                bubble: {
                    distance: 400,
                    duration: 2,
                    opacity: 0.8,
                    size: 40,
                },
                push: {
                    quantity: 4,
                },
                repulse: {
                    distance: 200,
                    duration: 2,
                },
            },
        },
        particles: {
            color: {
                value: '#ffffff',
            },
            links: {
                color: '#ffffff',
                distance: 150,
                enable: true,
                opacity: 0.5,
                width: 1,
            },
            collisions: {
                enable: true,
            },
            move: {
                direction: 'none',
                enable: true,
                outModes: {
                    default: 'bounce',
                },
                random: false,
                speed: 2,
                straight: false,
            },
            number: {
                density: {
                    enable: true,
                    area: 800,
                },
                value: 80,
            },
            opacity: {
                value: 0.5,
            },
            shape: {
                type: 'circle',
            },
            size: {
                value: { min: 1, max: 5 },
            },
        },
        detectRetina: true,
    }
</script>

<style lang="scss" scoped>
    .login {
        border-radius: 5px;
        width: 400px;
        // height: 300px;
        position: fixed;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
        background: rgba($color: #000000, $alpha: 0.5);
        color: white;
        text-align: center;
        padding: 20px;
        h3 {
            font-size: 30px;
        }
        .el-button {
            width: 100%;
        }
        .loginForm {
            margin-top: 20px;
        }
    }
</style>
