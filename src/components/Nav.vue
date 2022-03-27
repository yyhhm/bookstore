<template>
    <ul class="nav">
        <li v-if="this.$store.state.login">
            <span>欢迎{{ this.$store.getters.userName }} | </span>
            <el-button type="text" class="ziti" @click="logout">退出</el-button>
        </li>
        <li v-else>
            <router-link to="/login" class="ziti">登录</router-link> |
            <router-link to="/register" class="ziti"> 注册</router-link>
        </li>
        <li>
            <router-link to="/information" class="ziti">个人中心</router-link>
            <!-- <el-button type="text" class="ziti">个人中心</el-button> -->
        </li>
        <li>
            <router-link to="/order" class="ziti">我的订单</router-link>
        </li>
        <li>
            <router-link to="/collection" class="ziti">我的收藏</router-link>
        </li>
    </ul>
</template>

<script>
export default {
    name: 'Nav',
    data() {
        return {
            isLogin: false,
        }
    },
    methods: {
        // getNickName() {
        //   console.log("验证登陆账号")
        //   this.$axios.get("/getNickName").then(res => {
        //     this.userName = res.data
        //   })
        // },

        // if (sessionStorage.getItem("isLogin") === "true") {

        //   this.isLogin = true
        //   this.$axios.get("/getNickName").then(res => {
        //     this.$store.commit('setUserName', res.data);
        //   })
        // } else {
        //   this.isLogin = false
        // }

        logout() {
            this.$axios.delete('/logout').then(res => {
                if (res.code === 200) {
                    // sessionStorage.setItem("isLogin", false)
                    this.$store.commit('SET_IsLogin', false)
                    window.localStorage.removeItem('token')
                    window.location.reload()
                }
            })
        },
    },
}
</script>

<style lang="less" scoped>
.nav {
    width: 100%;
    height: 50px;
    background: #f3f3f3;
    padding: 0 60px;
    line-height: 50px;

    li {
        float: right;
        //display: inline-block;
        padding: 0 20px;
        color: #4a4a4a !important;

        &:first-child {
            float: left;
            padding: 0;
        }
    }
}

.ziti {
    color: #4a4a4a !important;
    font-size: 16px;
    text-decoration: none;

    &:hover {
        color: #00aaff !important;
    }
}
</style>
