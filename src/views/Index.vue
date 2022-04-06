<template>
    <div class="body">
        <Swiper></Swiper>
        <el-row :gutter="30">
            <el-col :span="17">
                <h3 style="margin: 20px 0">新书推荐</h3>
                <hr style="width: 100%" />
                <div class="card">
                    <Card :wid="6" :cardData="cardData"></Card>
                </div>
            </el-col>

            <el-col :span="7">
                <h3 style="margin: 20px 0">热销排行</h3>
                <hr style="width: 100%" />
                <ul class="sale">
                    <li
                        v-for="(item, index) in saleData"
                        :key="index"
                        class="saleList"
                        @mouseenter="show(index)"
                    >
                        <el-row :gutter="10" class="contact">
                            <el-col :span="2"> {{ index + 1 }}.</el-col>
                            <template v-if="hoverIndex === index">
                                <el-col :span="7">
                                    <img
                                        :src="item.bookCoverImg.split('#')[0]"
                                        alt=""
                                        style="width: 100%"
                                        @click="onChange(item.bookId)"
                                    />
                                </el-col>
                                <el-col :span="7" class="wen">
                                    <span @click="onChange(item.bookId)">{{ item.bookName }}</span>
                                </el-col>
                            </template>
                            <template v-else>
                                <el-col :span="14" class="wen">
                                    {{ item.bookName }}
                                </el-col>
                            </template>

                            <el-col :span="8">销售量:{{ item.saleNum }} </el-col>
                        </el-row>
                    </li>
                </ul>
            </el-col>
        </el-row>
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
            saleData: [],
            hoverIndex: 0,
        }
    },
    methods: {
        onChange(id) {
            this.$router.push({
                path: '/detail',
                query: {
                    id,
                },
            })
        },
        getBooks() {
            this.axios.get('/books/newBooks').then(res => {
                this.cardData = res.data
            })
        },
        getSale() {
            this.axios.get('/books/sale').then(res => {
                this.saleData = res.data
            })
        },
        show(index) {
            this.hoverIndex = index
        },
    },
    mounted() {
        this.getBooks()
        this.getSale()
    },
}
</script>

<style scoped lang="less">
.body {
    background-color: white;
}
.sale {
    .saleList {
        font-size: 14px;
        line-height: 3em;
        margin: auto;
        color: rgb(126, 117, 117);
        border-bottom: 1px solid silver;
        .contact {
            .wen {
                cursor: pointer; /*鼠标放上变小手*/
                word-break: keep-all; /*不换行*/
                white-space: nowrap; /*不换行*/
                overflow: hidden; /*内容超出宽度时隐藏超出部分的内容*/
                text-overflow: ellipsis; /*当对象内文本溢出时显示省略标记(...)；需与overflow:hidden;一起使用。*/
            }
        }
    }
}
</style>
