<template>
    <div class="recommendPage">
        <el-carousel height="340px">
            <el-carousel-item v-for="item in imgDate" :key="item.carousel_id">
                <img style="width: 100%; height: 340px" :src="item.carouselUrl" alt="" />
            </el-carousel-item>
        </el-carousel>
    </div>
</template>

<script>
export default {
    name: 'Swiper',

    data() {
        return {
            imgDate: [],
        }
    },
    computed: {},
    methods: {
        getimg() {
            this.$axios.get('/carousel/list').then(res => {
                this.imgDate = res.data
            })
        },
    },
    mounted() {
        this.getimg()
    },
}
</script>
<style scoped>
.recommendPage {
    position: relative;
    width: 100%;
    height: 340px;
}
</style>
