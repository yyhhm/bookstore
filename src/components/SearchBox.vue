<template>
    <div class="search">
        <router-link to="/" class="logo">
            <img src="../assets/logo.jpg" alt="">
        </router-link>
        <!-- <div class="logo" @click="returnIndex">
      <img src="../assets/logo.jpg" alt="">
    </div> -->
        <div class="search-box" v-show="!$route.meta.isShow">
            <el-input placeholder="请输入内容" v-model="inputSearch" class="input-with-select">
                <el-button slot="append" icon="el-icon-search" @click="search"></el-button>
            </el-input>
        </div>
        <div class="shopping-cart" v-show="!$route.meta.isShow">
            <el-badge :value="this.$store.getters.shopCartNum" class="item" v-if="this.$store.state.login">
                <el-button icon="el-icon-shopping-cart-2" size="big" @click="goCart">购物车</el-button>
            </el-badge>
            <el-button icon="el-icon-shopping-cart-2" size="big" @click="goCart" v-else>购物车</el-button>
        </div>
    </div>
</template>

<script>
export default {
    name: 'SearchBox',
    props: {
        isShow: {
            default: true,
            type: Boolean,
        },
    },
    data() {
        return {
            inputSearch: '',
        }
    },
    methods: {
        search() {
            if (this.inputSearch) {
                this.$router.push({
                    path: '/Search',
                    query: {
                        val: this.inputSearch,
                    },
                })
            } else {
                this.$router.push({
                    path: '/Search',
                })
            }
        },
        goCart() {
            this.$router.push({
                path: '/ShoppingCart',
            })
        },
        getShopCartNum() {
            if (sessionStorage.getItem('isLogin') === 'true') {
                console.log('验证购物车')
                this.$axios.get('/shopCart/items').then(res => {
                    this.$store.commit('setShopCartNum', res.data)
                })
            }
        },
    },
    created() {
        // this.getShopCartNum()
    },
}
</script>

<style scoped lang="less">
.search {
    padding: 0px 60px;
    width: 100%;
    height: 100px;
    display: flex;
    justify-content: space-between;

    .logo {
        margin: 5px 0;
        height: 90px;

        img {
            height: 90px;
        }
    }

    .search-box {
        line-height: 100px;
        width: 400px;
    }

    .shopping-cart {
        margin: auto 0;
        width: auto;
    }
}
</style>
