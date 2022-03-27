<template>
    <div class="cate-nav" v-show="!$route.meta.isShow">
        <div class="nav-con">
            <div
                class="all-categories hover-pointer"
                @mouseenter="showFirstList = true"
                @mouseleave="showFirstList = false"
            >
                全部商品分类
            </div>
        </div>
        <!-- 全部商品分类 -->
        <div
            class="cate-list"
            v-show="$route.meta.showAlways || showFirstList"
            @mouseenter="showFirstList = true"
            @mouseleave="showFirstList = false"
        >
            <!-- 第一级分类 -->
            <div class="nav-side">
                <ul>
                    <li
                        v-for="(item, index) in cateList"
                        :key="index"
                        @mouseleave="panel = false"
                        @mouseenter="showDetail(index), (hoverIndex = -1)"
                        :class="{ isHover: index == hoverIndex }"
                    >
                        <span class="nav-side-item">{{ item.categoryName }}</span>
                    </li>
                </ul>
            </div>
            <!-- 展开分类 -->
            <div
                class="detail-item-panel"
                v-show="panel"
                @mouseenter=";(panel = true), (hoverIndex = hoverIndex2)"
                @mouseleave=";(panel = false), (hoverIndex = -1)"
            >
                <ul>
                    <li v-for="(items, index) in panelData" :key="index" class="detail-item-row">
                        <span class="detail-item-title" @click="secondCategory(items.categoryId)">
                            {{ items.categoryName }}
                            <i class="el-icon-arrow-right"></i>
                        </span>
                        <div>
                            <span
                                v-for="(item, subIndex) in items.children"
                                :key="subIndex"
                                class="detail-item"
                                @click="thirdCategory(item.categoryId)"
                                >{{ item.categoryName }}</span
                            >
                        </div>
                    </li>
                </ul>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'Header',
    props: {
        showNavBar: {
            // 显示全部商品分类右侧导航条
            default: true,
            type: Boolean,
        },
    },
    data() {
        return {
            panel: false, // 二级分类展示
            panelData: [], // 二级分类数据
            showFirstList: false, // 始终展示一级列表
            cateList: [], // 商品分类
            hoverIndex: -1,
            // 临时index
            hoverIndex2: -1,
        }
    },
    methods: {
        secondCategory(id) {
            this.$router.push({
                path: '/Search',
                query: {
                    sid: id,
                },
            })
        },
        thirdCategory(id) {
            this.$router.push({
                path: '/Search',
                query: {
                    tid: id,
                },
            })
        },
        showDetail(index) {
            this.hoverIndex = index

            this.hoverIndex2 = index
            // 展示全部分类
            this.panel = true
            this.panelData = this.cateList[index].children
        },
        getCatList() {
            this.$axios.get('/category/list').then(res => {
                this.cateList = res.data
            })
        },
    },

    mounted() {
        this.getCatList()
    },
    computed: {},
    watch: {},
}
</script>

<style scoped lang="less">
.nav-lis:hover {
    color: #e4393c !important;
    cursor: pointer;
}

.cate-nav {
    width: 1150px;
    margin-left: 60px;
    position: relative;
}

/** 商品分类 */
.nav-con {
    width: auto;
    height: 40px;
    margin: 0 auto;
    display: flex;

    .all-categories {
        width: 200px;
        line-height: 40px;
        color: #fff;
        background-color: #00aaff;
        text-align: center;
        font-size: 16px;
        border-bottom: none;
    }

    .nav-item {
        width: 1000px;
        height: 40px;
        line-height: 40px;
        overflow: hidden;
        list-style: none;
        /* background-color: #eee; */
        display: flex;

        li {
            float: left;
            font-weight: bold;
            margin-left: 20px;
            color: rgb(129, 127, 127);
            font-size: 15px;

            &:hover {
                color: #222;
            }
        }
    }
}

// 分类列表
.cate-list {
    margin: 0 auto;
    position: absolute;
    z-index: 1000;
}

.nav-side {
    width: 200px;
    float: left;
    padding: 0px;
    color: #fff;
    background-color: rgba(76, 76, 76, 0.8);
    height: 335px;
    overflow: hidden;
}

.nav-side ul {
    width: 100%;
    padding: 0px;
    padding-top: 5px;
    list-style: none;
}

.nav-side li {
    text-align: center;
    padding: 7.5px 0;
    padding-left: 12px;
    font-size: 13px;
    line-height: 18px;

    &:hover {
        background: #ffffff;
        color: #222222;
    }
}

.isHover {
    background: #ffffff;
    color: #222222;
}

/*显示商品详细信息*/
.detail-item-panel {
    width: 800px;
    min-height: 305px;
    background-color: #fff;
    box-shadow: 0px 0px 15px #ccc;
    position: absolute;
    top: 0;
    left: 200px;
    z-index: 1000;
    padding: 15px;
}

.detail-item-panel li {
    line-height: 30px;
}

.detail-item-title {
    font-weight: bold;
    font-size: 12px;
    cursor: pointer;
    color: #555555;
    padding-right: 10px;
    width: 100px;
    text-align: right;
}

.detail-item-title:hover {
    color: #4ad0de;
}

.detail-item-row {
    display: flex;

    > div {
        flex: 1;
    }
}

.detail-item {
    font-size: 12px;
    padding-left: 8px;
    padding-right: 8px;
    cursor: pointer;
    border-left: 1px solid #ccc;
    //第三级分类第一个分类前面没有 |
    &:first-child {
        border: none;
        padding-left: 0;
    }
}

.detail-item:hover {
    color: #4ad0de;
}
</style>
