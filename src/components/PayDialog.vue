<template>
    <el-dialog title="选择支付方式" :visible.sync="dialogVisible" width="30%" :close-on-click-modal="false" @close="handleClose">
        <el-tabs v-model="activeName" type="border-card" width="100%" stretch>
            <el-tab-pane label="支付宝支付" name="1">
                <div class="imgDiv">
                    <img src="../assets/支付宝支付.jpg" alt="" class="img">
                </div>
            </el-tab-pane>
            <el-tab-pane label="微信支付" name="2">
                <div class="imgDiv">
                    <img src="../assets/微信支付.jpg" alt="" class="img">
                </div>
            </el-tab-pane>
        </el-tabs>

        <span slot="footer" class="dialog-footer">
            <el-button @click="dialogVisible = false">稍后支付</el-button>
            <el-button type="primary" @click="paySuccess">支付成功</el-button>
        </span>
    </el-dialog>
</template>

<script>
export default {
    name: 'PayDialog',

    props: {
        orderId: Number,
        reload: Function,
        isOrder: {
            type: Boolean,
            default: false,
        },
    },
    data() {
        return {
            activeName: '1',
            dialogVisible: false,
        }
    },
    methods: {
        open() {
            this.dialogVisible = true
        },
        handleClose() {
            //this.dialogVisible = false
            if (!this.isOrder) {
                this.$router.push({
                    path: '/order',
                })
            }
        },
        paySuccess() {
            this.$axios
                .put('/order/update', {
                    orderId: this.orderId,
                    payType: parseInt(this.activeName),
                    payStatus: 1,
                    orderStatus: 1,
                })
                .then(res => {
                    this.$message.success('支付成功')
                    this.dialogVisible = false
                    if (this.isOrder) {
                        this.reload()
                    } else {
                        this.$router.push({
                            path: '/order',
                        })
                    }
                })
        },
    },
}
</script>

<style scoped>
.imgDiv {
    width: 100%;
    text-align: center;
    height: 250px;
}

.img {
    width: 180px;
}
</style>
