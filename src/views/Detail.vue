<template>
    <div class="detail">
        <el-row>
            <el-col :span="12">
                <div class="actor">
                    <img :src="actorC" style="width: 400px; height: 400px; margin: auto" />
                </div>
                <ul class="thumbnail-list">
                    <li
                        class="thumbnail-item"
                        v-for="(thumbnail, index) in imgData"
                        :key="index"
                        @mouseover="toggleActor(index)"
                    >
                        <img class="thumbnail" :src="thumbnail" style="width: 86px; height: 86px" />
                    </li>
                </ul>
            </el-col>
            <el-col :span="12">
                <p class="title base3">{{ bookData.bookName }}</p>
                <p class="intro base3">{{ bookData.bookIntro }}</p>
                <div class="base base1 base3">
                    <div>
                        作者:<span style="color: #55aaff">{{ bookData.bookAuthor }}</span>
                    </div>
                    <div>
                        出版社:<span style="color: #55aaff">{{ bookData.bookPublish }}</span>
                    </div>
                </div>
                <div class="base price base2">
                    <p>
                        定 价:<span class="original-price ml">￥{{ bookData.originalPrice }}</span>
                    </p>
                    <p style="margin-top: 25px">
                        售 价:<span class="sell-price ml">￥{{ bookData.sellingPrice }}</span>
                    </p>
                </div>

                <div class="base base2">
                    销量<span style="color: #000000" class="ml">{{ bookData.saleNum }}件</span>
                </div>
                <div class="base base2">
                    数量<el-input-number
                        size="mini"
                        class="ml mr"
                        v-model="num"
                        :min="1"
                    ></el-input-number>
                    <span>库存:{{ bookData.stockNum }}</span>
                </div>

                <div class="base3">
                    <el-button type="info" plain disabled v-if="bookData.bookSellStatus == 1"
                        >该书已下架</el-button
                    >
                    <template v-else>
                        <el-button type="info" plain disabled v-if="bookData.stockNum < num"
                            >库存不足</el-button
                        >
                        <template v-else>
                            <el-button icon="el-icon-shopping-cart-2" @click="addCart"
                                >加入购物车</el-button
                            >
                            <el-button type="primary" @click="goComfirm">立即购买</el-button>
                        </template>
                    </template>
                    <el-button
                        plain
                        icon="el-icon-star-off"
                        v-if="collectId == 0"
                        @click="addCollect"
                        >收藏</el-button
                    >
                    <el-button
                        plain
                        icon="el-icon-star-on"
                        style="color: #007aff"
                        v-else
                        @click="delCollect"
                        >取消收藏</el-button
                    >
                </div>
                <div class="base3">
                    <div class="base" style="float: left">服务</div>
                    <ul class="service">
                        <li><i class="el-icon-success" style="color: red"></i>正品保证</li>
                        <li><i class="el-icon-success" style="color: red"></i>满88包邮</li>
                        <li><i class="el-icon-success" style="color: red"></i>七天无理由退换</li>
                    </ul>
                </div>
            </el-col>
        </el-row>

        <!-- 详情，评论 -->
        <div class="card">
            <el-tabs type="border-card" name="1" @tab-click="handleClick" class="card-tabs">
                <el-tab-pane label="图书详情">
                    <p v-html="bookData.bookDetailContent"></p>
                </el-tab-pane>
                <el-tab-pane name="2">
                    <div slot="label">
                        <el-badge :value="total" type="primary" size="small">
                            <el-button type="text">评论</el-button>
                        </el-badge>
                    </div>
                    <div v-for="(item, index) in appraiseList" :key="index">
                        <el-row style="margin-bottom: 15px">
                            <el-col :span="3">
                                <el-avatar
                                    shape="square"
                                    :size="50"
                                    icon="el-icon-user-solid"
                                ></el-avatar>
                                <p style="font-size: 12px">{{ item.users.loginName | phone }}</p>
                                <div></div>
                            </el-col>
                            <el-col :span="17">
                                <div>
                                    <el-rate v-model="item.grade" disabled> </el-rate>
                                </div>
                                <div style="margin-top: 10px; font-size: 14px">
                                    <p v-if="item.appraiseContact != ''">
                                        {{ item.appraiseContact }}
                                    </p>
                                    <p v-else>此用户没有填写评价</p>
                                </div>
                            </el-col>
                            <el-col :span="4">
                                <div>
                                    {{ item.createTime | time }}
                                </div>
                            </el-col>
                        </el-row>
                    </div>

                    <div class="block" v-if="total > 0">
                        <el-pagination
                            @size-change="handleSizeChange"
                            @current-change="handleCurrentChange"
                            :current-page="currentPage"
                            :page-sizes="[10, 20, 30]"
                            :page-size="pageSize"
                            layout="total, sizes, prev, pager, next, jumper"
                            :total="total"
                        >
                        </el-pagination>
                    </div>
                    <div v-else>
                        <h4>暂无评论</h4>
                    </div>
                </el-tab-pane>
            </el-tabs>
        </div>
    </div>
</template>

<script>
export default {
    name: 'Detail',

    data() {
        return {
            val: '',
            num: 1,
            id: '',
            imgData: [],
            bookData: {},
            actorIndex: 0,
            collectId: 0,
            appraiseList: [],
            // 查询条件
            currentPage: 1,
            pageSize: 10,
            /* 总数据条数 */
            total: 0,
        }
    },
    methods: {
        handleClick(tab, event) {
            console.log('sssssss' + tab.name)
            if (tab.name === 2) {
                this.getAppraise()
            }
        },
        handleSizeChange(newSize) {
            this.pageSize = newSize
            this.getAppraise()
        },

        // 监听pagenum改变事件
        handleCurrentChange(newPage) {
            this.currentPage = newPage
            this.getAppraise()
        },
        getAppraise() {
            this.$axios
                .get('/appraise/list', {
                    params: {
                        pageSize: this.pageSize,
                        currentPage: this.currentPage,
                        bookId: this.id,
                    },
                })
                .then(res => {
                    this.appraiseList = res.data.list
                    this.total = res.data.total
                })
        },
        goComfirm() {
            this.$router.push({
                path: '/comfirm',
                query: {
                    bookId: this.bookData.bookId,
                    bookCount: this.num,
                },
            })
        },
        getDetail() {
            console.log('dddd' + this.val)
            this.$axios.get(`/books/${this.id}`).then(res => {
                this.bookData = res.data

                this.imgData = res.data.bookCoverImg.split('#')
                this.imgData.pop()
            })
        },
        addCollect() {
            this.$axios
                .post('/collect', {
                    bookId: this.id,
                })
                .then(res => {
                    this.collectId = res.data
                })
        },
        delCollect() {
            this.$axios.delete(`/collect/${this.collectId}`).then(res => {
                this.collectId = res.data
            })
        },
        getCollect() {
            const login = this.$store.state.login
            if (login) {
                this.$axios.get(`/isCollect/${this.id}`).then(res => {
                    this.collectId = res.data
                })
            } else {
                this.collectId = 0
            }
        },
        toggleActor(index) {
            this.actorIndex = index
        },
        addCart() {
            this.$axios
                .post('/addShopCart', {
                    bookId: this.bookData.bookId,
                    bookCount: this.num,
                    stockNum: this.bookData.stockNum,
                })
                .then(res => {
                    if (res.code === 200) {
                        this.$message.success('已加入购物车')
                        this.$axios.get('/shopCart/items').then(res => {
                            this.$store.commit('setShopCartNum', res.data)
                        })
                    }
                })
        },
    },
    created() {
        this.val = this.$route.query.val
        this.id = this.$route.query.id
        this.getCollect()
        this.getDetail()
        this.getAppraise()
    },
    mounted() {},

    computed: {
        actorC() {
            return this.imgData[this.actorIndex]
        },
        disabled() {
            if (this.bookData.stockNum >= this.num) {
                return false
            } else {
                return true
            }
        },
    },
}
</script>

<style scoped lang="less">
.detail {
    width: 100%;
    padding: 20px 60px;
}

.card {
    width: 100%;
    margin-top: 20px;
    .card-tabs {
        min-height: 100px;
    }
    & /deep/ .el-badge__content.is-fixed {
        top: 8px;
        right: 5px;
    }
}

.left {
    padding-top: 50px;
    width: 50%;
    float: left;
}

.actor {
    width: 430px;
    height: 430px;
    border: 1px #cccccc solid;
    position: relative;
    text-align: center;
}

.thumbnail-list {
    margin-top: 15px;
    border: 1px #cccccc solid;
    width: 430px;
    list-style: none;
}

.thumbnail-item {
    display: inline-block;
    width: 86px;
    cursor: pointer;
}

.thumbnail {
    border: 1px solid transparent;
    box-sizing: border-box;
}

.thumbnail:hover {
    border-color: rgba(0, 0, 0, 0.2);
}

.right {
    width: 50%;
    padding-top: 50px;
    float: right;
}

.title {
    font-size: 18px;
}

.intro {
    font-size: 18px;
    color: #b2b2b2;
}

.base {
    font-size: 14px;
    color: #999999;
}

.base1 {
    display: flex;
    flex-direction: row;
}

.base1 > div {
    flex: 1;
}

.price {
    background-color: #e5e5e5;

    .original-price {
        color: black;
        text-decoration: line-through;
    }

    .sell-price {
        color: #ff0036;
        font-size: 20px;
    }
}

.ml {
    margin-left: 30px;
}

.mr {
    margin-right: 30px;
}

.base2 {
    width: 100%;
    padding: 10px 15px;
}

.base3 {
    width: 100%;
    padding: 10px 0px;
}

.service {
    float: left;
    margin-left: 40px;

    li {
        //float: left;
        display: inline-block;
        margin-right: 40px;
    }
}
</style>
