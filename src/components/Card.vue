<template>
    <div class="card">
        <el-row :gutter="gutter">
            <el-col :span="wid" v-for="(item, index) in cardData" :key="index">
                <el-card
                    @mouseenter.native="hoverIndex = index"
                    :class="{ shadow: index == hoverIndex }"
                    @mouseleave.native="hoverIndex = -1"
                    class="el-card"
                >
                    <div style="height: 160px; width: 160px; margin: 5px auto">
                        <img
                            :src="item.bookCoverImg.split('#')[0]"
                            class="image"
                            @click="onChange(item.bookId)"
                            :class="{ big: index == hoverIndex }"
                        />
                    </div>

                    <div style="padding: 5px; text-align: center">
                        <p style="height: 3em">{{ item.bookName }}</p>
                        <span style="color: #e4393c; font-size: 16px"
                            >￥{{ item.sellingPrice | price }}</span
                        >
                        <span style="color: #999999">|</span>
                        <span style="text-decoration: line-through; color: #999999; font-size: 12px"
                            >￥{{ item.originalPrice | price }}</span
                        >
                    </div>
                    <div class="del-but" v-show="index == hoverIndex" v-if="showDel">
                        <el-button
                            type="text"
                            icon="el-icon-delete"
                            @click="delCollect(item.collectId)"
                            style="color: #afa6a3"
                        ></el-button>
                    </div>
                </el-card>
            </el-col>
        </el-row>
    </div>
</template>

<script>
export default {
    name: 'Card',
    props: {
        wid: { type: String },
        cardData: {
            type: Array,
            default: () => [],
        },
        showDel: {
            type: Boolean,
            default: false,
        },
        gutter: {
            type: Number,
            default: 0,
        },
        reload: Function,
    },
    data() {
        return {
            hoverIndex: -1,
            isbig: false,
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
        delCollect(id) {
            this.$axios.delete(`/collect/${id}`).then(res => {
                this.collectId = res.data
                this.reload()
            })
        },
    },
}
</script>

<style lang="less" scoped>
.card {
    /deep/ .el-card__body {
        padding: 10px;
    }

    /deep/ .el-card.is-always-shadow {
        box-shadow: none;
    }

    // /deep/.el-card.is-hover-shadow:hover {
    //     box-shadow: 0 2px 12px 0 rgb(0 0 0 / 10%);
    // }
}

.time {
    font-size: 13px;
    color: #999;
}

.image {
    margin: auto;
    width: 90%;
    display: block;
}

.big {
    width: 100%;
}

.el-card {
    position: relative;
    margin-bottom: 20px;
    .del-but {
        position: absolute;
        top: 0px;
        right: 0px;
        width: 30px;
        height: 50px;
    }
}

.shadow {
    box-shadow: 2px 2px 8px #999999 !important;
}
</style>
