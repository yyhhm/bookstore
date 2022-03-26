import Vue from 'vue'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import App from './App.vue'
import router from './router'
import store from './store'
import less from 'less'
import axios from './until/axios.js'
import filter from './until/filter.js'
Vue.prototype.$axios = axios
Vue.use(less)

Vue.config.productionTip = false

Vue.use(ElementUI)
axios.get('/isLogin').then(res => {
    console.log('已验证')
    if (res.data == '已登陆') {
        store.commit('SET_IsLogin', true)
        console.log('111')
        axios.get('/getNickName').then(res => {
            console.log('222')
            store.commit('setUserName', res.data)
        })
        axios.get('/shopCart/items').then(res => {
            console.log('333')
            store.commit('setShopCartNum', res.data)
        })
    } else {
        store.commit('SET_IsLogin', false)
    }
})
router.beforeEach((to, from, next) => {
    if (to.matched.some(m => m.meta.auth)) {
        axios.get('/token').then(res => {
            if (res.code == 200) {
                next()
            }
        })
    } else {
        next()
    }
})

new Vue({
    el: '#app',
    router,
    store,
    components: {
        App,
    },
    template: '<App/>',
    render: h => h(App),
})
// new Vue({
//   router,
//   store,
//   render: h => h(App)
// }).$mount('#app')
