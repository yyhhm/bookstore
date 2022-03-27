import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
    state: {
        shopCartNum: 0,
        userName: '',
        login: window.sessionStorage.getItem('isLogin'),
        isLogin2: 6,
    },
    mutations: {
        setUserName(state, userName) {
            state.userName = userName
        },
        setShopCartNum(state, shopCartNum) {
            state.shopCartNum = shopCartNum
        },
        SET_IsLogin: (state, value) => {
            state.login = value
            window.sessionStorage.setItem('isLogin', value)
        },
    },
    getters: {
        userName: state => state.userName,
        shopCartNum: state => state.shopCartNum,
        login: state => state.login,
    },
    actions: {},
    modules: {},
})
