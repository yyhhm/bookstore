<template>
    <el-dialog title="提交评价" :close-on-click-modal="false" :visible.sync="dialogFormVisible" width="500px" @close="handleClose" class="body">
        <div class="toubu" v-if="goods!=null">
            <div>
                <img :src="goods.bookCoverImg" alt="" @click="onChange(goods.bookId)" style="width: 150px;" />
            </div>
            <div>{{ goods.bookName }}</div>
            <div>
                <span style="text-decoration: line-through;display:block;color: #999999;font-size: 14px;">￥{{goods.originalPrice | rounding}}
                </span>
                <span style="color: #000000;font-size: 16px;  display:block;">￥{{goods.sellingPrice | rounding}}
                </span>
            </div>
            <div>
                x{{goods.bookCount}}
            </div>
        </div>
        <el-form :model="form" ref="formRef" :rules="rules" label-width="80px">
            <el-form-item label="评分:" prop="grade">
                <el-rate v-model="form.grade" show-text style="margin: 10px 0;">
                </el-rate>
            </el-form-item>
            <el-form-item label="评价:" prop="contact">
                <el-input type="textarea" v-model="form.contact"></el-input>
            </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button @click="dialogFormVisible = false">取 消</el-button>
            <el-button type="primary" @click="submitForm">确 定</el-button>
        </div>

    </el-dialog>
</template>

<script>
export default {
    name: 'AppraiseDialog',
    props: {
        reload: Function,
    },
    data() {
        const validategrade = (rule, value, callback) => {
            if (value == 0) {
                callback(new Error('评分不能为空'))
            }
            if (value > 0) {
                callback()
            }
        }
        return {
            dialogFormVisible: false,
            orderItemId: 0,
            goods: {},
            form: {
                grade: 0,
                contact: '',
            },
            rules: {
                grade: {
                    required: 'true',
                    validator: validategrade,
                    trigger: 'blur',
                },
            },
        }
    },
    methods: {
        open(id) {
            this.dialogFormVisible = true
            this.orderItemId = id
            this.getOrderItem(id)
        },
        handleClose() {
            this.dialogFormVisible = false
            this.$refs.formRef.resetFields()
            this.goods = {}
        },
        getOrderItem(id) {
            this.$axios.get(`/order-item/${id}`).then(res => {
                this.goods = res.data
            })
        },
        submitForm() {
            this.$refs.formRef.validate(valid => {
                if (valid) {
                    this.$axios
                        .put('/appraise', {
                            grade: this.form.grade,
                            appraiseContact: this.form.contact,
                            orderItemId: this.orderItemId,
                            bookId: this.goods.bookId,
                        })
                        .then(() => {
                            this.$message.success('评价成功')
                            this.dialogFormVisible = false
                            this.reload()
                        })
                }
            })
        },
    },
    created() {},
}
</script>

<style lang="less" scoped>
.toubu {
    width: 100%;
    display: flex;

    > div {
        justify-content: space-around;
        flex: 1;
        height: 150px;
    }

    > div:not(:first-child) {
        padding-top: 50px;
    }
}
</style>
