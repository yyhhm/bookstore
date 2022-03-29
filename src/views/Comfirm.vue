<template>
    <div class="comfim-body">
        <div class="address">
            <div class="header">
                <h3>选择收货地址</h3>
                <router-link to="/address">
                    <el-button type="text">管理收货人地址</el-button>
                </router-link>
            </div>
            <div class="address-manage">
                <div
                    class="address-item"
                    v-show="moreAddr ? true : index < 3"
                    :class="selectId === index ? 'border-red' : ''"
                    @mouseenter="showEditBtn = index"
                    @mouseleave="showEditBtn = ''"
                    @click="selectAddress(index)"
                    v-for="(item, index) in tableData"
                    :key="index"
                >
                    <div>
                        <span>{{ item.name }}</span>
                        <el-tag v-if="item.defaultFlag == 1" size="mini">默认</el-tag>
                    </div>
                    <div>{{ item.phone }}</div>
                    <div>
                        {{ item.provinceName }} {{ item.cityName }} {{ item.regionName }}
                        {{ item.detailAddress }}
                    </div>
                    <div class="edit-btn" v-show="showEditBtn === index">
                        <span @click.stop="handleEdit(item.addressId)">修改</span>
                        <span class="ml-10" @click.stop="handleDelete(item.addressId)">删除</span>
                    </div>
                    <div class="corner-icon" v-show="selectId === index">
                        <div></div>
                        <i class="el-icon-check"></i>
                    </div>
                </div>
                <div class="add-address" @click="handleAdd">
                    <i class="el-icon-circle-plus-outline ivu-icon"></i>
                    <div>添加新地址</div>
                </div>
            </div>
            <AddressDialog ref="addDialog" :type="type" :reload="getAddressList" />
            <el-button
                type="text"
                class="more-addr"
                @click="moreAddr = !moreAddr"
                v-if="tableData.length > 3"
            >
                {{ moreAddr ? '收起地址' : '更多地址' }}
                <i v-show="!moreAddr" class="el-icon-caret-bottom"></i>
                <i v-show="moreAddr" class="el-icon-caret-top"></i>
            </el-button>
        </div>
        <div class="bookInfo">
            <div class="header">
                <h3>确认商品信息</h3>
                <router-link to="/shoppingCart">
                    <el-button type="text">返回购物车</el-button>
                </router-link>
            </div>
            <div class="eltable">
                <el-table
                    ref="multipleTable"
                    :data="shopCart"
                    tooltip-effect="dark"
                    style="width: 100%"
                    :header-cell-style="headerStyle"
                >
                    <el-table-column label="商品信息" width="150">
                        <template #default="scope">
                            <img
                                style="width: 100px; height: 100px"
                                :src="scope.row.bookCoverImg.split('#')[0]"
                                alt="主图"
                            />
                        </template>
                    </el-table-column>
                    <el-table-column width="400" prop="bookName"> </el-table-column>
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
                            <span style="color: #000000; font-size: 16px; display: block">
                                ￥{{ scope.row.sellingPrice | price }}
                            </span>
                        </template>
                    </el-table-column>
                    <el-table-column label="数量" width="200" prop="bookCount"> </el-table-column>
                    <el-table-column prop="" label="金额(元)">
                        <template #default="scope">
                            <span style="color: #ff0000; font-size: 16px">
                                ￥ {{ (scope.row.sellingPrice * scope.row.bookCount) | price }}
                            </span>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
            <div class="comfirm">
                <ul>
                    <li>
                        总金额为: <span>￥{{ totalPrice | price }}</span>
                    </li>
                    <li>
                        运费: <span v-if="totalPrice < 88">￥5.00</span>
                        <span v-else>￥0.00</span>
                    </li>
                    <li>
                        应付金额为:
                        <span style="color: red; font-size: 20px">
                            ￥{{ order.totalPrice | price }}
                        </span>
                    </li>
                    <li>
                        配送至: {{ order.orderAddress.provinceName }}
                        {{ order.orderAddress.cityName }} {{ order.orderAddress.regionName }}
                        {{ order.orderAddress.detailAddress }} &nbsp;&nbsp;收货人:
                        {{ order.orderAddress.name }}
                        {{ order.orderAddress.phone }}
                    </li>
                    <li>
                        <el-button type="danger" style="font-size: 20px" @click="comfirm"
                            >提交订单</el-button
                        >
                    </li>
                </ul>
            </div>
        </div>

        <PayDialog :orderId="orderId" ref="addPayDialog"></PayDialog>
    </div>
</template>

<script>
import AddressDialog from '../components/AddressDialog.vue'
import PayDialog from '../components/PayDialog.vue'
export default {
    name: 'Comfirm',
    components: {
        AddressDialog,
        PayDialog,
    },
    data() {
        return {
            orderId: 0,
            activeName: '1',
            dialogVisible: false,
            tableData: [],
            selectId: 0,
            showEditBtn: '',
            moreAddr: false, // 更多地址
            type: 'add',
            ids: [],
            shopCart: [],
            totalPrice: 0,
            order: {
                totalPrice: 0,
                orderAddress: {
                    provinceName: '',
                    cityName: '',
                    regionName: '',
                    detailAddress: '',
                    name: '',
                    phone: '',
                },
                orderItems: [],
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
        handleAdd() {
            if (this.tableData.length < 10) {
                this.type = 'add'
                this.$refs.addDialog.open()
            } else {
                this.$message('只能添加10条收货地址信息')
                return false
            }
        },
        selectAddress(id) {
            this.selectId = id
            this.order.orderAddress.provinceName = this.tableData[id].provinceName
            this.order.orderAddress.cityName = this.tableData[id].cityName
            this.order.orderAddress.regionName = this.tableData[id].regionName
            this.order.orderAddress.detailAddress = this.tableData[id].detailAddress
            this.order.orderAddress.name = this.tableData[id].name
            this.order.orderAddress.phone = this.tableData[id].phone
        },
        getAddressList() {
            this.$axios.get('/address/list').then(res => {
                this.tableData = res.data
                this.tableData.forEach((item, index) => {
                    if (item.defaultFlag === 1) {
                        this.selectId = index
                        this.order.orderAddress.provinceName = this.tableData[index].provinceName
                        this.order.orderAddress.cityName = this.tableData[index].cityName
                        this.order.orderAddress.regionName = this.tableData[index].regionName
                        this.order.orderAddress.detailAddress = this.tableData[index].detailAddress
                        this.order.orderAddress.name = this.tableData[index].name
                        this.order.orderAddress.phone = this.tableData[index].phone
                        return
                    }
                })
            })
        },

        handleEdit(id) {
            this.type = 'edit'
            this.$refs.addDialog.open(id)
        },
        handleDelete(id) {
            this.$confirm('此操作将永久删除该记录, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning',
            })
                .then(() => {
                    this.removeAddress(id)
                })
                .catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除',
                    })
                })
        },
        removeAddress(id) {
            this.$axios
                .delete('/address', {
                    params: {
                        id: id,
                    },
                })
                .then(() => {
                    this.$message.success('删除成功')
                    this.getAddressList()
                })
        },

        selectShopCartByIds(ids) {
            console.log('gg' + this.ids)
            this.$axios.get(`/shopCart/${ids}`).then(res => {
                this.shopCart = res.data
                this.shopCart.forEach(item => {
                    this.totalPrice += item.sellingPrice * item.bookCount
                })
                if (this.totalPrice < 88) {
                    this.order.totalPrice = this.totalPrice + 5
                } else {
                    this.order.totalPrice = this.totalPrice
                }
            })
        },
        comfirm() {
            this.shopCart.forEach(item => {
                const obj = {}
                obj.bookId = item.bookId
                obj.bookName = item.bookName
                obj.bookCoverImg = item.bookCoverImg.split('#')[0]
                obj.originalPrice = item.originalPrice
                obj.sellingPrice = item.sellingPrice
                obj.bookCount = item.bookCount
                this.order.orderItems.push(obj)
            })
            if (this.$route.query.ids) {
                this.$axios
                    .post('/order', {
                        order: this.order,
                        ids: this.ids,
                    })
                    .then(res => {
                        this.orderId = res.data
                        this.$axios.get('/shopCart/items').then(res => {
                            console.log('跟新数据')
                            this.$store.commit('setShopCartNum', res.data)
                        })
                        this.$refs.addPayDialog.open()
                    })
            } else {
                this.$axios
                    .post('/order', {
                        order: this.order,
                    })
                    .then(res => {
                        this.orderId = res.data
                        this.$axios.get('/shopCart/items').then(res => {
                            console.log('跟新数据')
                            this.$store.commit('setShopCartNum', res.data)
                        })
                        this.$refs.addPayDialog.open()
                    })
            }
        },
        getBook(bookId, bookCount) {
            this.$axios
                .get('/comfirm', {
                    params: {
                        bookId: bookId,
                        bookCount: bookCount,
                    },
                })
                .then(res => {
                    this.shopCart = res.data
                    this.shopCart.forEach(item => {
                        this.totalPrice += item.sellingPrice * item.bookCount
                    })
                    if (this.totalPrice < 88) {
                        this.order.totalPrice = this.totalPrice + 5
                    }
                })
        },
    },
    created() {
        console.log('结算页面创建成功')
        if (this.$route.query.ids) {
            this.ids = this.$route.query.ids
            this.selectShopCartByIds(this.ids)
        } else {
            this.getBook(this.$route.query.bookId, this.$route.query.bookCount)
        }

        this.getAddressList()
    },
}
</script>

<style scoped lang="less">
.ml-10 {
    margin-left: 10px;
}

.imgDiv {
    width: 100%;
    text-align: center;
    height: 250px;
}

.img {
    width: 180px;
}

.header {
    display: flex;
    justify-content: space-between;
    border-bottom: 1px #e4e4e4 solid;
}

.comfim-body {
    height: auto;
    .address {
        width: 100%;
        height: auto;

        .address-manage {
            display: flex;
            flex-wrap: wrap;

            > div {
                border: 1px dotted #949494;
                width: 230px;
                height: 120px;
                margin: 20px 20px 0 0;
                padding: 10px;
                cursor: pointer;
                color: #999;
            }

            .add-address {
                display: flex;
                align-items: center;
                justify-content: center;
                flex-direction: column;

                .ivu-icon {
                    font-size: 24px;
                }
            }

            .address-item {
                position: relative;
                font-size: 12px;

                > div:nth-child(1) {
                    margin-bottom: 10px;

                    span {
                        margin-right: 10px;
                    }

                    span:nth-child(1) {
                        color: #000000;
                        font-size: 14px;
                    }
                }

                .edit-btn {
                    font-size: 12px;
                    position: absolute;
                    top: 15px;
                    right: 20px;
                    color: red;

                    span:hover {
                        border-bottom: 1px solid red;
                    }
                }

                .corner-icon {
                    position: absolute;
                    right: -1px;
                    bottom: -1px;

                    div {
                        width: 0;
                        border-top: 20px solid transparent;
                        border-right: 20px solid red;
                    }

                    .el-icon-check {
                        font-size: 12px;
                        position: absolute;
                        bottom: 0;
                        right: 1px;
                        transform: rotate(-15deg);
                        color: #fff;
                    }
                }
            }

            .border-red {
                border-color: red;
            }
        }
    }

    .bookInfo {
        .eltable {
            margin-top: 20px;
        }
    }

    .comfirm {
        margin-top: 20px;
        background-color: #eee;
        color: #2b2b2b;
        width: 100%;
        height: 230px;

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
