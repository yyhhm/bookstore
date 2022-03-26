<template>
    <el-dialog title="修改信息" :close-on-click-modal="false" :visible.sync="dialogFormVisible" width="400px" @close="handleClose">

        <el-form :model="ruleForm" :rules="rules" ref="formRef" label-width="60px">

            <el-form-item label="昵称:" prop="nickName">
                <el-input type="text" v-model="ruleForm.nickName">
                </el-input>
            </el-form-item>
            <el-form-item label="性别:" prop="sex">
                <el-radio-group v-model="ruleForm.sex">
                    <el-radio :label="0">男</el-radio>
                    <el-radio :label="1">女</el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item label="签名:" prop="introduceSign">
                <el-input type="textarea" v-model="ruleForm.introduceSign"></el-input>
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
    name: 'UserInfoDialog',
    props: {
        reload: Function,
    },
    data() {
        return {
            ruleForm: {
                nickName: '',
                introduceSign: '',
                sex: 0,
            },
            rules: {
                nickName: {
                    required: 'true',
                    message: '昵称不能为空',
                    trigger: '',
                },

                introduceSign: {
                    required: 'true',
                    message: '签名不能为空',
                    trigger: 'blur',
                },
            },
            dialogFormVisible: false,
        }
    },
    methods: {
        open() {
            this.dialogFormVisible = true
            this.$axios.get('/user/info').then(res => {
                this.ruleForm.introduceSign = res.data.introduceSign
                this.ruleForm.sex = res.data.sex
                this.ruleForm.nickName = res.data.nickName
            })
        },
        handleClose() {
            this.$refs.formRef.resetFields()
            this.dialogFormVisible = false
        },
        submitForm() {
            this.$axios
                .put('/user/edit', {
                    nickName: this.ruleForm.nickName,
                    introduceSign: this.ruleForm.introduceSign,
                    sex: this.ruleForm.sex,
                })
                .then(res => {
                    this.$message.success('修改成功')
                    this.$axios.get('/getNickName').then(res => {
                        this.$store.commit('setUserName', res.data)
                    })
                    this.reload()
                    this.$message.success('修改成功')
                    this.dialogFormVisible = false
                })
        },
    },
}
</script>

<style>
</style>
