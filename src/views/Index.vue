<template>
    <div>

        <Swiper></Swiper>
        <h3 style="margin:30px 60px;">新书推荐</h3>
        <hr style="width:100%;">
        <div class="card">
            <Card :wid="wid" :cardData="cardData"></Card>
        </div>

    </div>
</template>

<script>
import Swiper from '../components/Swiper.vue'
import Card from '../components/Card.vue'
export default {
    name: 'Home',
    components: {
        Swiper,
        Card,
    },
    data() {
        return {
            wid: 4,
            cardData: [],
        }
    },
    methods: {
        getBooks() {
            this.$axios.get('/books/newBooks').then(res => {
                this.cardData = res.data
            })
        },
    },
    mounted() {
        this.getBooks()
    },
}
</script>

<style scoped>
.card {
    width: 100%;
    padding: 20px 20px;
}
</style>
