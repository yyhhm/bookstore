<template>
    <div class="body">
        <el-tabs v-model="activeName" type="border-card" @tab-click="handleClick" stretch>
            <el-tab-pane
                v-for="(item, index) in tabsName"
                :key="index"
                :label="item.name"
                :name="item.status"
                lazy
            >
                <div class="order-content" v-loading="loading">
                    <div
                        class="order-list"
                        v-for="(order, onderIndex) in orderList"
                        :key="onderIndex"
                    >
                        <div class="order-header">
                            <div>
                                {{ order.createTime | time }}&nbsp; &nbsp; &nbsp;订单号：{{
                                    order.orderNo
                                }}
                            </div>
                        </div>
                        <div class="order-body">
                            <div class="goods-list">
                                <div
                                    v-for="(goods, goodsIndex) in order.orderItems"
                                    :key="goodsIndex"
                                >
                                    <img
                                        :src="goods.bookCoverImg"
                                        alt=""
                                        @click="onChange(goods.bookId)"
                                    />
                                    <div>{{ goods.bookName }}</div>
                                    <div>
                                        <span
                                            style="
                                                text-decoration: line-through;
                                                display: block;
                                                color: #999999;
                                                font-size: 14px;
                                            "
                                            >￥{{ goods.originalPrice | price }}
                                        </span>
                                        <span
                                            style="color: #000000; font-size: 16px; display: block"
                                            >￥{{ goods.sellingPrice | price }}</span
                                        >
                                    </div>
                                    <div>x{{ goods.bookCount }}</div>
                                    <div v-if="goods.isAppraise == 1">
                                        <el-button
                                            type="primary"
                                            size="mini"
                                            icon="el-icon-chat-dot-round"
                                            @click="appraise(goods.orderItemId)"
                                            >去评价</el-button
                                        >
                                    </div>
                                    <div v-if="goods.isAppraise == 2">
                                        <span>评价完成</span>
                                    </div>
                                </div>
                            </div>
                            <div class="order-totalPrice">￥{{ order.totalPrice | price }}</div>
                            <div class="order-status">
                                <div>
                                    {{ order.orderStatus | orderMap }}
                                </div>
                            </div>
                            <div>
                                <div>
                                    <el-button
                                        type="text"
                                        v-if="order.orderStatus == 0"
                                        @click="payClick(order.orderId)"
                                        >去支付</el-button
                                    >
                                    <el-button
                                        type="text"
                                        v-if="order.orderStatus == 3"
                                        @click="handleComfirm(order.orderId)"
                                        >确认收货
                                    </el-button>
                                </div>
                                <div>
                                    <el-button type="text" @click="getDetail(order.orderId)"
                                        >订单详情</el-button
                                    >
                                </div>

                                <div>
                                    <el-button
                                        type="text"
                                        v-if="order.orderStatus == 0"
                                        @click="closeOrder(order.orderId)"
                                        >关闭订单</el-button
                                    >
                                </div>
                                <div>
                                    <el-button
                                        type="text"
                                        v-if="order.orderStatus > 0 && order.orderStatus < 4"
                                        @click="refund(order.orderId)"
                                        >退款</el-button
                                    >
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </el-tab-pane>
        </el-tabs>
        <div class="block">
            <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="currentPage"
                :page-sizes="[5, 10, 15, 20]"
                :page-size="pageSize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="total"
            >
            </el-pagination>
        </div>
        <PayDialog :orderId="orderId" ref="addPayDialog" :reload="getOrderList" :isOrder="true" />
        <AppraiseDialog ref="addAppraiseDialog" :reload="getOrderList" />
    </div>
</template>

<script>
import PayDialog from '../components/PayDialog.vue'
import AppraiseDialog from '../components/AppraiseDialog.vue'
export default {
    name: 'Order',
    components: {
        PayDialog,
        AppraiseDialog,
    },
    data() {
        return {
            loading: true,
            orderId: 0,
            activeName: '6',
            // 查询条件
            currentPage: 1,
            pageSize: 5,
            /* 总数据条数 */
            total: 0,

            tabsName: [
                {
                    name: '全部订单',
                    status: '6',
                },
                {
                    name: '待付款',
                    status: '0',
                },
                {
                    name: '待发货',
                    status: '1',
                },
                {
                    name: '待收货',
                    status: '3',
                },
                {
                    name: '交易完成',
                    status: '4',
                },
                {
                    name: '待退款',
                    status: '-3',
                },
            ],
            orderList: [],
        }
    },
    methods: {
        refund(id) {
            this.$axios
                .put('/order/update', {
                    orderId: id,
                    orderStatus: -3,
                })
                .then(res => {
                    this.$message.success('已经退款，待商家同意')
                    this.getOrderList()
                })
        },
        appraise(id) {
            this.$refs.addAppraiseDialog.open(id)
        },
        handleComfirm(id) {
            this.$axios
                .put('/order/update', {
                    orderId: id,
                    orderStatus: 4,
                })
                .then(res => {
                    this.$message.success('收货成功')
                    this.getOrderList()
                })
        },
        closeOrder(id) {
            this.$axios
                .put('/order/update', {
                    orderId: id,
                    orderStatus: -1,
                })
                .then(res => {
                    this.$message.success('关闭订单成功')
                    this.getOrderList()
                })
        },
        handleSizeChange(newSize) {
            this.pageSize = newSize
            this.getOrderList()
        },

        // 监听pagenum改变事件
        handleCurrentChange(newPage) {
            this.currentPage = newPage
            this.getOrderList()
        },

        onChange(id) {
            this.$router.push({
                path: '/detail',
                query: {
                    id,
                },
            })
        },
        getDetail(id) {
            this.$router.push({
                path: '/orderDetail',
                query: {
                    orderId: id,
                },
            })
        },
        payClick(id) {
            this.orderId = id
            this.$refs.addPayDialog.open()
        },
        handleClick(tab, event) {
            this.getOrderList()
        },
        getOrderList() {
            const param = {
                currentPage: this.currentPage,
                pageSize: this.pageSize,
            }
            if (parseInt(this.activeName) !== 6) {
                param.orderStatus = parseInt(this.activeName)
            }
            this.$axios
                .get('/orders', {
                    params: param,
                })
                .then(res => {
                    this.orderList = res.data.list
                    this.total = res.data.total
                    this.loading = false
                })
        },
    },
    created() {
        this.getOrderList()
    },
}
</script>

<style scoped lang="less">
.body {
    padding: 20px 20px;

    .order-content {
        .order-list {
            border: 1px solid #ddd;
            border-radius: 3px;
            margin-bottom: 10px;

            &:hover {
                .del-btn {
                    visibility: visible;
                }
            }

            .del-btn {
                visibility: hidden;
            }

            .order-header {
                display: flex;
                align-items: center;
                padding: 10px;
                justify-content: space-between;
                border-bottom: 1px solid #ddd;

                > div:nth-child(1) > div:nth-child(2) {
                    font-size: 12px;
                    color: #999;
                    margin-top: 3px;
                }
            }

            .order-body {
                display: flex;
                justify-content: space-between;
                color: #999;
                width: 100%;

                .goods-list {
                    border-right: 1px solid #ddd;
                    width: 55%;

                    > div {
                        padding: 10px;
                        display: flex;
                        border-bottom: 1px solid #ddd;

                        &:last-child {
                            border-bottom: none;
                        }

                        img {
                            height: 100px;
                            margin-right: 10px;
                        }

                        > div {
                            margin: auto 0;
                            flex: 1;
                        }
                    }
                }

                > div:not(:first-child) {
                    width: 15%;
                    text-align: center;
                    border-right: 1px solid #ddd;
                }

                > div:last-child {
                    border-right: none;
                }
            }
        }
    }
}
</style>
