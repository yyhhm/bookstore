import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
    {
        path: '/login',
        name: 'Login',
        component: () => import('../views/Login.vue'),
    },
    {
        path: '/register',
        name: 'Register',
        component: () => import('../views/Register.vue'),
    },
    {
        path: '/',
        name: 'Home',
        component: () => import('../views/Home.vue'),
        redirect: '/index',
        children: [
            {
                path: '/index',
                name: 'Index',
                component: () => import('../views/Index.vue'),
                meta: {
                    //显示二级分类
                    showAlways: true,
                },
            },
            {
                path: '/detail',
                name: 'Detail',
                component: () => import('../views/Detail.vue'),
            },
            {
                path: 'shoppingCart',
                name: 'ShoppingCart',
                component: () => import('../views/ShoppingCart.vue'),
                meta: {
                    //隐藏搜索框
                    isShow: true,
                    //该页面是否需要登录
                    auth: true,
                },
            },

            {
                path: 'comfirm',
                name: 'Comfirm',
                component: () => import('../views/Comfirm.vue'),
                meta: {
                    isShow: true,
                    auth: true,
                },
            },
            {
                path: 'search',
                name: 'Search',
                component: () => import('../views/Search.vue'),
            },
            {
                path: '/my',
                name: 'My',
                component: () => import('../views/My.vue'),
                meta: {
                    auth: true,
                },
                children: [
                    {
                        path: '/information',
                        name: 'Information',
                        component: () => import('../views/Information.vue'),
                    },
                    {
                        path: '/order',
                        name: 'Order',
                        component: () => import('../views/Order.vue'),
                    },
                    {
                        path: '/collection',
                        name: 'Collection',
                        component: () => import('../views/Collection.vue'),
                    },
                    {
                        path: '/address',
                        name: 'Address',
                        component: () => import('../views/Address.vue'),
                    },
                    {
                        path: '/appraise',
                        name: 'Appraise',
                        component: () => import('../views/Appraise.vue'),
                    },
                ],
            },
            {
                path: '/orderDetail',
                name: 'OrderDetail',
                component: () => import('../views/OrderDetail.vue'),
                meta: {
                    auth: true,
                },
            },
        ],
    },
]

const router = new VueRouter({
    mode: 'hash',
    base: process.env.BASE_URL,
    routes,
})

export default router
