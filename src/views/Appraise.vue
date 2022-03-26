<template>
    <div class="body">
        <div class="header">
            <h3>我的评价</h3>
            <el-button type="text" @click="handleDelete()"><i class="el-icon-delete
"></i>删除</el-button>
        </div>

        <el-table ref="multipleTable" :data="tableData" tooltip-effect="dark" style="width: 100%" @selection-change="handleSelectionChange">
            <el-table-column type="selection" width="80">
            </el-table-column>
            <el-table-column label="商品信息" width="200">
                <template #default="scope">
                    <img @click="onChange(scope.row.orderItem.bookId)" style="width: 100px; height: 100px;" :src="scope.row.orderItem.bookCoverImg.split('#')[0]" alt="主图">
                    <p>{{scope.row.orderItem.bookName}}</p>
                </template>

            </el-table-column>
            <el-table-column width="100" prop="grade" label="评分">

            </el-table-column>
            <el-table-column width="200" label="评价" :show-overflow-tooltip='true'>
                <template #default="scope">
                    <div v-if="scope.row.appraiseContact.length>0">
                        <el-popover placement="top-start" width="300" trigger="hover" :disabled="scope.row.appraiseContact.length <= 10">
                            <div>{{ scope.row.appraiseContact }}</div>
                            <span slot="reference" v-if="scope.row.appraiseContact.length <= 10">{{scope.row.appraiseContact}}</span>
                            <span slot="reference" v-if="scope.row.appraiseContact.length > 10">{{scope.row.appraiseContact.substr(0, 10) + "..."}}</span>
                        </el-popover>
                    </div>
                    <div v-else>此用户没有评价</div>
                </template>

            </el-table-column>
            <el-table-column width="200" label="发表时间">
                <template #default="scope">
                    <span>{{scope.row.createTime | time}}</span>

                </template>
            </el-table-column>

            <el-table-column prop="" label="操作">
                <template #default="scope">

                    <el-button @click="handleDelete(scope.row.appraiseId)" type="text" size="small">删除</el-button>

                </template>

            </el-table-column>
        </el-table>
        <div class="block">
            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage" :page-sizes="[8,12,16,20]" :page-size="pageSize"
                layout="total, sizes, prev, pager, next, jumper" :total="total">
            </el-pagination>
        </div>
    </div>
</template>

<script>
export default {
    name: 'Appraise',
    data() {
        return {
            tableData: [],
            //查询条件
            currentPage: 1,
            pageSize: 10,
            /* 总数据条数 */
            total: 0,
            multipleSelection: [],
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
                .get('/appraise/list1', {
                    params: {
                        pageSize: this.pageSize,
                        currentPage: this.currentPage,
                    },
                })
                .then(res => {
                    this.tableData = res.data.list
                    this.total = res.data.total
                })
        },
        handleSelectionChange(val) {
            this.multipleSelection = val
        },
        handleDelete(id) {
            let ids = []
            if (id) {
                ids = [id]
            } else {
                if (this.multipleSelection.length == 0) {
                    this.$message.error('请选择项')
                    return
                }
                ids = this.multipleSelection.map(item => item.appraiseId)
            }
            this.$confirm('此操作将永久删除记录, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning',
            })
                .then(() => {
                    this.$axios
                        .delete('/appraise/delByIds', {
                            params: {
                                ids: ids.join(','),
                            },
                        })
                        .then(() => {
                            this.getAppraise()
                            this.$message.success('删除成功')
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
        this.getAppraise()
    },
}
</script>

<style scoped lang="less">
.body {
    width: 100%;
    padding: 20px;

    .header {
        margin-bottom: 30px;

        display: flex;
        justify-content: space-between;
        border-bottom: 1px #e4e4e4 solid;
    }
}
</style>
