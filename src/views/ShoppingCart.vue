<template>
    <div class="cart">
        <h3>我的购物车</h3>
        <el-table
            ref="multipleTable"
            :data="tableData"
            tooltip-effect="dark"
            style="width: 100%"
            @selection-change="handleSelectionChange"
            :header-cell-style="headerStyle"
            :row-key="row => row.cartItemId"
        >
            <el-table-column
                type="selection"
                width="80"
                :selectable="selectable"
                :reserve-selection="true"
            >
            </el-table-column>
            <el-table-column label="商品信息" width="150">
                <template #default="scope">
                    <img
                        @click="onChange(scope.row.bookId)"
                        style="width: 100px; height: 100px"
                        :src="scope.row.bookCoverImg.split('#')[0]"
                        alt="主图"
                    />
                </template>
            </el-table-column>
            <el-table-column width="250" prop="bookName"> </el-table-column>
            <el-table-column label="单价" width="140">
                <template slot-scope="scope">
                    <span
                        style="
                            text-decoration: line-through;
                            display: block;
                            color: #999999;
                            font-size: 14px;
                        "
                        >￥{{ scope.row.originalPrice | price }}
                    </span>
                    <span style="color: #000000; font-size: 16px; display: block"
                        >￥{{ scope.row.sellingPrice | price }}</span
                    >
                </template>
            </el-table-column>
            <el-table-column label="数量" width="200">
                <template #default="scope">
                    <el-input-number
                        size="mini"
                        v-model="scope.row.bookCount"
                        :min="1"
                        @change="
                            (currentValue, oldValue) =>
                                numChange(currentValue, oldValue, scope.row.cartItemId)
                        "
                    >
                    </el-input-number>
                </template>
            </el-table-column>
            <el-table-column prop="" label="金额(元)" width="120">
                <template #default="scope">
                    <span style="color: #ff0000; font-size: 16px"
                        >￥{{ (scope.row.sellingPrice * scope.row.bookCount) | price }}</span
                    >
                </template>
            </el-table-column>
            <el-table-column>
                <template #default="scope">
                    <el-button @click="handleDelete(scope.row.cartItemId)" type="text" size="small"
                        >删除</el-button
                    >
                </template>
            </el-table-column>
            <el-table-column>
                <template #default="scope">
                    <span v-if="scope.row.bookSellStatus == 1"> 该书已下架 </span>
                    <div v-else>
                        <span v-if="scope.row.stockNum < scope.row.bookCount"> 库存不足 </span>
                    </div>
                </template>
            </el-table-column>
        </el-table>
        <ul class="cart-product-info">
            <!-- <li>
        <el-checkbox :indeterminate="indeterminated" v-model="checkAll">全选</el-checkbox>
      </li> -->
            <li>
                <span class="cart-font">已选 {{ multipleSelection.length }} 件</span>
            </li>
            <li>
                <el-button type="text" class="cart-font" @click="handleDelete()"
                    >删除所选商品</el-button
                >
            </li>

            <li>
                <span
                    >应付金额
                    <span style="color: #ff0000; font-size: 20px">
                        ￥{{ totalPrice | price }}</span
                    ></span
                >
            </li>
            <li
                :class="{ white: !multipleSelection.length > 0, red: multipleSelection.length > 0 }"
            >
                <el-button
                    type="text"
                    :disabled="!multipleSelection.length > 0"
                    style="color: #fff; font-size: 20px"
                    @click="comfirm"
                    >去结算</el-button
                >
            </li>
        </ul>
        <div class="block">
            <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="currentPage"
                :page-sizes="[3, 5, 7, 9]"
                :page-size="pageSize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="total"
            >
            </el-pagination>
        </div>
    </div>
</template>

<script>
export default {
    name: 'ShoppingCart',
    data() {
        return {
            multipleSelection: [],
            tableData: [],
            // 查询条件
            currentPage: 1,
            pageSize: 5,
            /* 总数据条数 */
            total: 0,
            ids: [],
        }
    },
    methods: {
        // 图片跳转详情
        onChange(id) {
            this.$router.push({
                path: '/detail',
                query: {
                    id,
                },
            })
        },
        // 更新购物车每项的购买数量
        numChange(newVal, oldVal, id) {
            this.axios
                .put('/shopCart/updateNum', {
                    cartItemId: id,
                    bookCount: newVal,
                })
                .then(res => {
                    this.getCartList()
                })
        },
        // 判断下架、超过库存，禁止选中
        selectable(row, index) {
            if (row.stockNum >= row.bookCount && row.bookSellStatus === 0) {
                return true
            } else {
                return false
            }
        },
        // 标头样式
        headerStyle() {
            return {
                background: '#f3f3f3',
                lineHeight: '50px',
                color: 'black',
            }
        },
        // 跳转结算页面
        comfirm() {
            const ids = this.multipleSelection.map(item => item.cartItemId)
            this.$router.push({
                path: '/comfirm',
                query: {
                    ids: ids,
                },
            })
        },
        // 选中计算
        handleSelectionChange(val) {
            this.multipleSelection = val
        },

        handleSizeChange(newSize) {
            this.pageSize = newSize
            this.$refs.multipleTable.clearSelection()
            this.getCartList()
        },

        // 监听pagenum改变事件
        handleCurrentChange(newPage) {
            this.currentPage = newPage
            this.$refs.multipleTable.clearSelection()
            this.getCartList()
        },
        getCartList() {
            this.axios
                .get('/shopCart/list', {
                    params: {
                        currentPage: this.currentPage,
                        pageSize: this.pageSize,
                    },
                })
                .then(res => {
                    this.tableData = res.data.list
                    this.total = res.data.total
                })
        },
        handleDelete(id) {
            let ids = []
            if (id) {
                ids = [id]
            } else {
                if (this.multipleSelection.length === 0) {
                    this.$message.error('请选择项')
                    return
                }
                ids = this.multipleSelection.map(item => item.cartItemId)
            }
            this.$confirm('此操作将永久删除记录, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning',
            })
                .then(() => {
                    this.$axios
                        .delete('/shopCart/delByIds', {
                            params: {
                                ids: ids.join(','),
                            },
                        })
                        .then(res => {
                            this.$message.success('删除成功')
                            this.getCartList()
                            // 更新购物车项数量
                            this.$axios.get('/shopCart/items').then(res => {
                                this.$store.commit('setShopCartNum', res.data)
                                this.$refs.multipleTable.clearSelection()
                            })
                        })
                })
                .catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除',
                    })
                })
        },
    },
    created() {
        this.getCartList()
    },
    computed: {
        totalPrice() {
            let totalPrice = 0
            this.tableData.forEach(item => {
                this.multipleSelection.forEach(mul => {
                    if (item.cartItemId === mul.cartItemId) {
                        totalPrice += item.sellingPrice * item.bookCount
                    }
                })
            })
            return totalPrice
        },
    },

    destroyed() {
        console.log('购物车销毁')
    },
    beforeRouteLeave(to, from, next) {
        next()
    },
}
</script>
<style scoped>
.cart >>> .el-table__header .el-table-column--selection .cell .el-checkbox:after {
    color: #333;
    content: '全选';
    font-size: 14px;
    margin-left: 12px;
    font-weight: bold;
}
</style>
<style scoped lang="less">
.cart-product-info {
    height: 60px;
    line-height: 60px;
    color: #000000;
    background: #f3f3f3;

    width: 100%;
    padding-left: 20px;

    .white {
        background-color: #999;
    }

    .red {
        background-color: red;
    }

    li {
        //float: left;
        display: inline-block;
        margin-right: 30px;

        &:last-child {
            float: right;
        }

        &:nth-child(4) {
            margin-right: 0;
            padding: 0 20px;
            float: right;
        }
    }
}

.cart-font {
    color: black;
    font-size: 16px;
}
</style>
