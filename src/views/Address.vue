<template>
    <div class="address">
        <div class="header">
            <h3>已保存收货地址<span class="base">(地址最多10条，还能保存{{10 - tableData.length}}条)</span></h3>
            <el-button type="text" @click="handleAdd"><i class="el-icon-plus"></i>新建地址</el-button>
        </div>
        <el-table ref="multipleTable" :data="tableData" tooltip-effect="dark" style="width: 100%" @cell-mouse-enter="enter" @cell-mouse-leave="leave">

            <el-table-column label="收货人" width="130" prop="name">
            </el-table-column>

            <el-table-column width="300" label="收货地址">
                <template slot-scope="scope">
                    <span>{{scope.row.provinceName+scope.row.cityName+scope.row.regionName+scope.row.detailAddress}}</span>
                </template>
            </el-table-column>

            <el-table-column prop="phone" label="联系电话" width="150">

            </el-table-column>

            <el-table-column width="200">
                <template slot-scope="scope">
                    <span v-if="scope.row.defaultFlag == 1">默认地址</span>
                    <span v-else>
                        <el-button type="text" style="padding: 0;" @click="setDefault(scope.row.addressId)" v-show="actorIndex===scope.row.addressId">设为默认</el-button>
                    </span>
                </template>
            </el-table-column>

            <el-table-column prop="" label="操作">
                <template slot-scope="scope">
                    <el-button type="text" size="mini" @click="handleEdit(scope.row.addressId)">
                        编辑
                    </el-button>

                    <el-button type="text" size="mini" @click="handleDelete(scope.row.addressId)">
                        删除
                    </el-button>

                </template>
            </el-table-column>
        </el-table>
        <AddressDialog ref='addDialog' :type="type" :reload="getAddressList" />
    </div>
</template>

<script>
import AddressDialog from '../components/AddressDialog.vue'
export default {
    name: 'Address',

    components: {
        AddressDialog,
    },
    data() {
        return {
            actorIndex: 0,
            type: 'add',
            tableData: [],
        }
    },
    methods: {
        handleAdd() {
            if (this.tableData.length < 10) {
                this.type = 'add'
                this.$refs.addDialog.open()
            } else {
                this.$message('只能添加10条收货地址信息')
                return false
            }
        },
        getAddressList() {
            this.$axios.get('/address/list').then(res => {
                this.tableData = res.data
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
        setDefault(id) {
            this.$axios
                .put('/address/setDefault', {
                    addressId: id,
                })
                .then(() => {
                    this.getAddressList()
                })
        },
        enter(row) {
            this.actorIndex = row.addressId
        },
        leave() {
            this.actorIndex = 0
        },
    },
    mounted() {
        this.getAddressList()
    },
}
</script>

<style lang="less" scoped>
.address {
    width: 100%;
    height: auto;
    padding: 30px;

    .header {
        display: flex;
        justify-content: space-between;
        border-bottom: 1px #e4e4e4 solid;
    }
}

.base {
    font-size: 14px;
    color: #999999;
}
</style>
