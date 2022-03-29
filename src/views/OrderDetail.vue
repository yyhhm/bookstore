<template>
    <div class="body">
        <div class="breadcrumb">
            <el-breadcrumb separator-class="el-icon-arrow-right">
                <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
                <el-breadcrumb-item :to="{ path: '/order' }">我的订单</el-breadcrumb-item>
                <el-breadcrumb-item>订单详情</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="orderInfo">
            <el-row :gutter="100">
                <el-col :span="12">
                    <div class="box">
                        <h5>订单信息</h5>
                        <table>
                            <tbody>
                                <tr>
                                    <td>订单编号：</td>
                                    <td>{{ order.orderNo }}</td>
                                </tr>
                                <tr>
                                    <td>订单状态：</td>
                                    <td>{{ order.orderStatus | orderMap }}</td>
                                </tr>
                                <tr>
                                    <td>下单时间：</td>
                                    <td>{{ order.createTime | time }}</td>
                                </tr>

                                <tr>
                                    <td>支付方式：</td>
                                    <td v-if="order.payType == 0">无</td>
                                    <td v-if="order.payType == 1">支付宝支付</td>
                                    <td v-if="order.payType == 2">微信支付</td>
                                </tr>
                                <tr>
                                    <td>支付时间：</td>
                                    <td>{{ order.payTime | time }}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </el-col>
                <el-col :span="12">
                    <div class="box">
                        <h5>收货信息</h5>
                        <table>
                            <tbody>
                                <tr>
                                    <td>收件人</td>
                                    <td>：{{ order.orderAddress.name }}</td>
                                </tr>
                                <tr>
                                    <td>地址</td>
                                    <td>
                                        ： {{ order.orderAddress.provinceName }}
                                        {{ order.orderAddress.cityName }}
                                        {{ order.orderAddress.regionName }}
                                        {{ order.orderAddress.detailAddress }}
                                    </td>
                                </tr>
                                <tr>
                                    <td>手机号码</td>
                                    <td>：{{ order.orderAddress.phone }}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </el-col>
            </el-row>
        </div>

        <div>
            <el-table
                ref="multipleTable"
                :data="order.orderItems"
                tooltip-effect="dark"
                style="width: 100%"
                :header-cell-style="headerStyle"
            >
                <el-table-column label="商品信息" width="150">
                    <template #default="scope">
                        <img
                            style="width: 100px; height: 100px"
                            @click="onChange(scope.row.bookId)"
                            :src="scope.row.bookCoverImg.split('#')[0]"
                            alt="主图"
                        />
                    </template>
                </el-table-column>
                <el-table-column width="300" prop="bookName"> </el-table-column>
                <el-table-column prop="" label="单价" width="200">
                    <template slot-scope="scope">
                        <span
                            style="
                                text-decoration: line-through;
                                display: block;
                                color: #999999;
                                font-size: 14px;
                            "
                        >
                            ￥{{ scope.row.originalPrice | price }}
                        </span>
                        <span style="color: #000000; font-size: 16px; display: block"
                            >￥{{ scope.row.sellingPrice | price }}</span
                        >
                    </template>
                </el-table-column>
                <el-table-column label="数量" width="200" prop="bookCount"> </el-table-column>
                <el-table-column prop="" label="金额(元)">
                    <template #default="scope">
                        <span style="color: #ff0000; font-size: 16px"
                            >￥{{ (scope.row.sellingPrice * scope.row.bookCount) | price }}</span
                        >
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <div>
            <div class="comfirm">
                <ul>
                    <li>
                        总金额为:
                        <span v-if="order.totalPrice - 5 < 88"
                            >￥{{ (order.totalPrice - 5) | price }}</span
                        >
                        <span v-else>￥{{ order.totalPrice | price }}</span>
                    </li>

                    <li>
                        运费: <span v-if="order.totalPrice - 5 < 88">￥5.00</span>
                        <span v-else>￥0.00</span>
                    </li>
                    <li>
                        应付金额为:
                        <span style="color: red; font-size: 20px"
                            >￥{{ order.totalPrice | price }}</span
                        >
                    </li>
                </ul>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'OrderDetail',
    data() {
        return {
            orderId: 0,
            order: {},
            status: {
                0: '待支付',
                1: '待发货',
                3: '待收货',
                4: '交易完成',
            },
        }
    },
    methods: {
        headerStyle() {
            return {
                background: '#f3f3f3',
                lineHeight: '50px',
                color: 'black',
            }
        },
        getOrder() {
            this.$axios.get(`/order/${this.orderId}`).then(res => {
                this.order = res.data
            })
        },
        onChange(id) {
            this.$router.push({
                path: '/detail',
                query: {
                    id,
                },
            })
        },
    },
    created() {
        this.orderId = this.$route.query.orderId
        this.getOrder()
    },
}
</script>

<style scoped lang="less">
.body {
    min-height: 500px;
    border: 1px solid #cccccc;
    margin: 20px 60px;

    .breadcrumb {
        margin-left: 20px;
    }

    > div {
        margin-top: 20px;
    }

    .orderInfo {
        width: 100%;

        .box {
            height: 300px;

            background-color: #f5f5f5;
            padding: 30px 15px;

            h5 {
                margin-bottom: 10px;
            }

            table {
                tbody {
                    tr {
                        td {
                            padding: 5px 0;
                            color: #999;
                            font-size: 12px;
                        }

                        > td:first-child {
                            text-align: center;
                            text-align: justify;
                            text-justify: distribute-all-lines;
                            text-align-last: justify;
                        }
                    }
                }
            }
        }
    }

    .comfirm {
        padding: 20px 0;
        background-color: #eee;
        color: #2b2b2b;
        width: 100%;
        height: 170px;

        ul {
            float: right;
            text-align: right;

            li {
                padding: 10px;

                span {
                    display: inline-block;
                    width: 120px;
                }
            }
        }
    }
}
</style>
