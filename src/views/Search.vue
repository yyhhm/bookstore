<template>
    <div class="body">
        <div style="width: 100%; line-height: 50px" v-if="catName.length > 0">
            <el-breadcrumb
                separator-class="el-icon-arrow-right"
                style="width: 100%; line-height: 50px"
            >
                <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
                <el-breadcrumb-item :to="{ path: '/search', query: { sid: catName[0].categoryId } }"
                    >{{ catName[0].categoryName }}
                </el-breadcrumb-item>
                <el-breadcrumb-item v-if="catName[1]"
                    >{{ catName[1].categoryName }}
                </el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="sort">
            <div>
                <el-radio-group
                    v-model="submitData.type"
                    size="small"
                    @change="getBookList"
                    style="margin-right: 15px"
                >
                    <el-radio-button label="1">价格</el-radio-button>
                    <el-radio-button label="2">销量</el-radio-button>
                    <el-radio-button label="3">新品</el-radio-button>
                </el-radio-group>
                <el-radio-group v-model="submitData.sort" @change="getBookList">
                    <el-radio label="asc">升序</el-radio>
                    <el-radio label="desc">降序</el-radio>
                </el-radio-group>
            </div>
            <div>
                <svg class="icon" aria-hidden="true" v-show="!show" @click="change">
                    <use xlink:href="#icon-bars1"></use>
                </svg>
                <svg class="icon" aria-hidden="true" v-show="show">
                    <use xlink:href="#icon-bars1-copy"></use>
                </svg>
                <svg class="icon" aria-hidden="true" v-show="show" @click="change1">
                    <use xlink:href="#icon-gird"></use>
                </svg>
                <svg class="icon" aria-hidden="true" v-show="!show">
                    <use xlink:href="#icon-gird-copy"></use>
                </svg>
            </div>
        </div>
        <div class="books">
            <div v-for="(item, index) in booksData" :key="index" v-show="show">
                <div @mouseenter="hoverIndex = index" @mouseleave="hoverIndex = -1" class="info">
                    <el-row>
                        <el-col :span="4">
                            <div class="imgDiv">
                                <img
                                    :src="item.bookCoverImg.split('#')[0]"
                                    class="image"
                                    @click="onChange(item.bookId)"
                                    :class="{ big: index == hoverIndex }"
                                />
                            </div>
                        </el-col>
                        <el-col :span="18">
                            <div class="contact">
                                <div>
                                    <h4>{{ item.bookName }}</h4>
                                </div>
                                <div>
                                    <span
                                        style="color: #e4393c; font-size: 20px; margin-right: 15px"
                                        >￥{{ item.sellingPrice | price }}</span
                                    >
                                    <span
                                        style="
                                            text-decoration: line-through;
                                            color: #999999;
                                            font-size: 14px;
                                        "
                                        >￥{{ item.originalPrice | price }}
                                    </span>
                                </div>
                                <div>
                                    <div>
                                        <span>作者：</span><span>{{ item.bookAuthor }}</span>
                                    </div>
                                    <div>
                                        <span>出版社：</span><span>{{ item.bookPublish }}</span>
                                    </div>
                                    <div>
                                        <span>上架时间：</span
                                        ><span>{{ item.createTime | time }}</span>
                                    </div>
                                </div>
                                <div>
                                    {{ item.bookIntro }}
                                </div>
                                <div>
                                    <el-button
                                        icon="el-icon-shopping-cart-2"
                                        type="primary"
                                        @click="addCart(item.bookId, item.stockNum)"
                                    >
                                        加入购物车</el-button
                                    >
                                </div>
                            </div>
                        </el-col>
                    </el-row>
                </div>
            </div>

            <div v-show="!show">
                <Card :wid="4" :gutter="10" :cardData="booksData"></Card>
            </div>
            <div class="block" v-if="booksData">
                <el-pagination
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    :current-page="submitData.currentPage"
                    :page-sizes="[12, 18, 24]"
                    :page-size="submitData.pageSize"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="total"
                >
                </el-pagination>
            </div>
        </div>
    </div>
</template>

<script>
import Card from '../components/Card.vue'
export default {
    name: 'Search',
    components: {
        Card,
    },
    data() {
        return {
            total: 0,
            sortIndex: 0,
            hoverIndex: -1,
            show: true,
            catName: [],
            submitData: {
                currentPage: 1,
                pageSize: 8,
                type: 2,
                sort: 'desc',
            },
            goodsTool: [
                // 排序类型
                {
                    title: '综合',
                    type: 2,
                },
                {
                    title: '销量',
                    type: 2,
                },
                {
                    title: '价格',
                    type: 1,
                },
                {
                    title: '新品',
                    type: 3,
                },
            ],
            booksData: [],
        }
    },
    methods: {
        handleSizeChange(newSize) {
            this.submitData.pageSize = newSize
            this.getBookList()
        },

        // 监听pagenum改变事件
        handleCurrentChange(newPage) {
            this.submitData.currentPage = newPage
            this.getBookList()
        },
        addCart(bookId, stockNum) {
            this.axios
                .post('/addShopCart', {
                    bookId: bookId,
                    bookCount: 1,
                    stockNum: stockNum,
                })
                .then(res => {
                    if (res.code === 200) {
                        this.$message.success('已加入购物车')
                        this.axios.get('/shopCart/items').then(res => {
                            this.$store.commit('setShopCartNum', res.data)
                        })
                    }
                })
        },

        change() {
            this.show = true

            this.getBookList()
        },
        change1() {
            this.show = false
            this.getBookList()
        },
        onChange(id) {
            this.$router.push({
                path: '/detail',
                query: {
                    id,
                },
            })
        },
        getBookList() {
            const params = {}
            Object.assign(params, this.submitData, this.$route.query)
            this.axios
                .get('/books/search', {
                    params,
                })
                .then(res => {
                    this.booksData = res.data.list
                    this.total = res.data.total
                })
        },
        getCatName() {
            let id = 0
            if (this.$route.query.sid || this.$route.query.tid) {
                if (this.$route.query.sid) {
                    id = this.$route.query.sid
                }
                if (this.$route.query.tid) {
                    id = this.$route.query.tid
                }

                this.axios.get(`/categories/${id}`).then(res => {
                    this.catName = res.data
                })
            } else {
                return
            }
        },
    },
    created() {
        this.getBookList()
        this.getCatName()
    },
    watch: {
        // 监听相同路由下参数变化的时候，从而实现异步刷新
        $route(to, from) {
            // 做一些路由变化的响应
            this.getBookList()
            this.getCatName()
        },
    },
}
</script>

<style lang="less" scoped>
.icon {
    width: 2em;
    height: 2em;
    vertical-align: -0.15em;
    fill: currentColor;
    overflow: hidden;
}

.body {
    .sort {
        margin: 20px 0;
        width: 100%;
        height: 38px;
        border: 1px solid #ccc;
        background-color: #f1f1f1;

        > div:first-child {
            line-height: 32px;
            float: left;
            height: auto;
        }

        > div:last-child {
            float: right;
        }
    }

    .books {
        border: 1px solid #ccc;
        width: 100%;
        min-height: 100px;

        .info {
            height: 180px;

            padding: 10px 20px;
            border-bottom: 1px solid #ccc;

            .imgDiv {
                width: 160px;

                .image {
                    margin: auto;
                    width: 90%;
                    display: block;
                }

                .big {
                    width: 100%;
                }
            }

            .contact {
                > div {
                    margin-top: 7px;
                }

                > div:first-child {
                    margin-top: 0;
                }

                > div:nth-child(3) {
                    overflow: hidden;

                    > div {
                        float: left;
                        width: 250px;
                        font-size: 12px;

                        span:first-child {
                            color: #999;
                        }
                    }
                }

                > div:nth-child(4) {
                    font-size: 12px;
                    color: #ccc;
                    display: -webkit-box;
                    -webkit-box-orient: vertical;
                    -webkit-line-clamp: 2;
                    /*设置p元素最大4行，父元素需填写宽度才明显*/
                    text-overflow: ellipsis;
                    overflow: hidden;
                }
            }
        }
    }
}
</style>
