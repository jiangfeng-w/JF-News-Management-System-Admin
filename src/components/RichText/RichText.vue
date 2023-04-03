<template>
    <div id="myeditor"></div>
</template>

<script setup>
    import E from 'wangeditor'
    import { onMounted, defineProps, defineEmits, watch } from 'vue'
    const props = defineProps({
        content: {
            type: String,
            default: '',
        },
    })
    let editor

    const emit = defineEmits(['contentChange'])
    onMounted(() => {
        editor = new E('#myeditor')
        editor.create()
        editor.config.onchange = function (content) {
            // console.log('change 之后最新的 html', newHtml)
            //子传父
            emit('contentChange', content)
        }
    })
    watch(
        () => props.content,
        newVal => {
            editor && editor.txt.html(newVal)
        }
    )
</script>
<!-- <script>
    import E from 'wangeditor'
    export default {
        name: 'Editor',
        props: {
            content: {
                type: String,
                default: '',
            },
        },
        mounted() {
            const editor = new E('#myeditor')
            this.editor = editor
            editor.config.height = 250 // 高度，单位xp
            editor.config.zIndex = 500 // z-index属性
            editor.config.onchange = function (newHtml) {
                // 需要改变this指向域
                if (newHtml) {
                    this.$emit('contentChange', newHtml)
                }
            }.bind(this)
            editor.create()
        },
        methods: {},
        watch: {
            content() {
                this.editor.txt.html(this.content)
            },
        },
    }
</script> -->
