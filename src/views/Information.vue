<template>
    <div class="body">
        <div class="header">
            <h3>我的信息</h3>
            <el-button type="text" @click="handleEdit"><i class="el-icon-plus"></i>编辑</el-button>
        </div>
        <div class="info" v-loading="loading">
            <table>
                <tr>
                    <td>手机号</td>
                    <td>{{ userData.loginName }}</td>
                </tr>
                <tr>
                    <td>昵称</td>
                    <td>{{ userData.nickName }}</td>
                </tr>
                <tr>
                    <td>性别</td>
                    <td v-if="userData.sex == 0">男</td>
                    <td v-else>女</td>
                </tr>
                <tr>
                    <td>签名</td>
                    <td>{{ userData.introduceSign }}</td>
                </tr>
            </table>
        </div>
        <div></div>
        <UserInfoDialog ref="addDialog" :reload="getUser" />
    </div>
</template>

<script>
import UserInfoDialog from '../components/UserInfoDialog.vue'
export default {
    name: 'Information',
    components: {
        UserInfoDialog,
    },
    data() {
        return {
            userData: {},
            loading: true,
        }
    },
    methods: {
        getUser() {
            this.$axios.get('/user/info').then(res => {
                this.userData = res.data
                this.loading = false
            })
        },
        handleEdit() {
            this.$refs.addDialog.open()
        },
    },
    created() {
        this.getUser()
    },
}
</script>

<style scoped lang="less">
.body {
    width: 100%;
    padding: 20px;

    .header {
        display: flex;
        justify-content: space-between;
        border-bottom: 1px #e4e4e4 solid;
        margin-bottom: 20px;
    }

    .info {
        width: 100%;
        padding: 10px 30px;
        height: 140px;
        background-color: #e6e6e6;

        table {
            tr {
                td:first-child {
                    text-align: right;
                    width: 100px;
                    height: 28px;
                    padding-right: 50px;
                }
            }
        }
    }
}
</style>
