<template>
    <div>
        <el-card class="box-card">
            <el-row>
                <el-col :span="4">
                    <el-avatar
                        :size="100"
                        :src="store.state.userInfo.avatar"
                    />
                </el-col>
                <el-col :span="20">
                    <h3 style="line-height: 100px">欢迎 {{ store.state.userInfo.username }} 回来, {{ welcomeText }}</h3>
                </el-col>
            </el-row>
        </el-card>

        <el-card class="box-card">
            <template #header>
                <div class="card-header">
                    <span>公司产品</span>
                </div>
            </template>

            <!-- 轮播图 -->
            <swiper
                v-if="listData.length"
                class="swiper"
                :modules="modules"
                :slides-per-view="3"
                :loop="true"
                :navigation="true"
                :pagination="{ clickable: true }"
                :autoplay="{
                    delay: 2500,
                    disableOnInteraction: false,
                }"
            >
                <swiper-slide
                    class="slide"
                    v-for="(item, index) in listData"
                    :key="item.id"
                >
                    <img
                        :src="item.product_image"
                        alt=""
                    />
                </swiper-slide>
            </swiper>
        </el-card>
    </div>
</template>

<script setup>
    import { useStore } from 'vuex'
    import { computed, ref, onMounted } from 'vue'
    import axios from 'axios'
    import { Pagination, Navigation, FreeMode, Autoplay, Zoom } from 'swiper'
    import { Swiper, SwiperSlide } from 'swiper/vue'
    import 'swiper/css'
    import 'swiper/css/pagination'
    import 'swiper/css/navigation'

    const store = useStore()
    const welcomeText = computed(() => (new Date().getHours() < 12 ? '要开心每一天.' : '喝杯咖啡提提神吧.'))

    //#region 数据
    const listData = ref([])
    onMounted(() => {
        getData()
    })
    const getData = async () => {
        const res = await axios.get('/admin/product/list')
        listData.value = res.data.data
        // console.log(listData)
    }
    //#endregion

    //#region swiper配置
    const modules = ref([Pagination, Navigation, FreeMode, Autoplay, Zoom])
    //#endregion
</script>

<style lang="scss" scoped>
    .box-card {
        margin-top: 50px;
    }
</style>

<style lang="scss" scoped>
    .swiper {
        // height: 40vh;
        height: 300px;
        .slide {
            height: 100%;
            display: flex;
            justify-content: space-around;

            img {
                height: 100%;
                padding: 0;
                margin: 0;
            }
        }
    }
</style>
