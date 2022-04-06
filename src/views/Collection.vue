<template>
    <div class="body">
        <div class="header">
            <h3>我的收藏</h3>
        </div>
        <Card
            :wid="6"
            :cardData="tableData"
            :showDel="true"
            :gutter="15"
            :reload="getCollectList"
        ></Card>

        <div class="block">
            <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="currentPage"
                :page-sizes="[8, 12, 16, 20]"
                :page-size="pageSize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="total"
            >
            </el-pagination>
        </div>
    </div>
</template>

<script>
import Card from '../components/Card.vue'
export default {
    name: 'Collection',
    components: {
        Card,
    },
    data() {
        return {
            tableData: [],
            // 查询条件
            currentPage: 1,
            pageSize: 12,
            /* 总数据条数 */
            total: 0,
        }
    },
    methods: {
        getCollectList() {
            this.axios('/collect/list', {
                params: {
                    currentPage: this.currentPage,
                    pageSize: this.pageSize,
                },
            }).then(res => {
                this.tableData = res.data.list
                this.total = res.data.total
            })
        },
        handleSizeChange(newSize) {
            this.pageSize = newSize
            this.getCollectList()
        },

        // 监听pagenum改变事件
        handleCurrentChange(newPage) {
            this.currentPage = newPage
            this.getCollectList()
        },
    },
    created() {
        this.getCollectList()
    },
}
</script>

<style scoped lang="less">
.body {
    padding: 20px;
    .header {
        border-bottom: 1px #e4e4e4 solid;
        margin-bottom: 20px;
        padding-bottom: 20px;
    }
    .block {
        margin-left: 50%;
        margin-top: 20px;
    }
}
</style>
