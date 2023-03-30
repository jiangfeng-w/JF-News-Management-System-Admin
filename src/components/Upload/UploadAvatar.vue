<template>
    <div>
        <el-upload
            class="avatar-uploader"
            action="#"
            :show-file-list="false"
            :auto-upload="false"
            :on-change="handleChange"
        >
            <img
                v-if="avatar"
                :src="avatar"
                class="avatar"
            />
            <el-icon
                v-else
                class="avatar-uploader-icon"
            >
                <Plus />
            </el-icon>
        </el-upload>
    </div>
</template>

<script setup>
    import { Plus } from '@element-plus/icons-vue'
    // import { defineEmits, defineProps } from 'vue'

    // 接收porps
    const props = defineProps({
        avatar: String,
    })
    // 注册emit
    const emit = defineEmits(['fileChange'])

    // 选择图片
    const handleChange = file => {
        // console.log(file)
        // userForm.avatar = URL.createObjectURL(file.raw)
        // userForm.file = file.raw
        emit('fileChange', file.raw)
    }
</script>

<style scoped lang="scss">
    :deep(.avatar-uploader) .el-upload {
        border: 1px dashed var(--el-border-color);
        border-radius: 6px;
        cursor: pointer;
        position: relative;
        overflow: hidden;
        transition: var(--el-transition-duration-fast);
    }

    :deep(.avatar-uploader) .el-upload:hover {
        border-color: var(--el-color-primary);
    }

    .el-icon.avatar-uploader-icon {
        font-size: 28px;
        color: #8c939d;
        width: 178px;
        height: 178px;
        text-align: center;
    }
    .avatar-uploader .avatar {
        width: 178px;
        height: 178px;
        display: block;
    }
</style>
