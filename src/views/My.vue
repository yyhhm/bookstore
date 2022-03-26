<template>
    <div class="userinfo">
        <el-row :gutter="20">
            <el-col :span="4">
                <div class="left">
                    <h3 class="title">个人中心</h3>

                    <el-menu router :default-active="$route.path">
                        <el-menu-item index="/information">
                            <span slot="">我的信息</span>
                        </el-menu-item>
                        <el-menu-item index="/collection">
                            <span slot="">我的收藏</span>
                        </el-menu-item>

                        <el-menu-item index="/order">
                            <span slot="">我的订单</span>
                        </el-menu-item>
                        <el-menu-item index="/address">
                            <span slot="">我的地址</span>
                        </el-menu-item>
                        <el-menu-item index="/appraise">
                            <span slot="">我的评价</span>
                        </el-menu-item>
                    </el-menu>
                </div>
            </el-col>
            <el-col :span="20">
                <div class="right">
                    <router-view></router-view>
                </div>
            </el-col>
        </el-row>
    </div>
</template>

<script>
export default {
    name: 'My',
}
</script>

<style lang="less" scoped>
.userinfo {
    padding: 60px 60px;
}

.el-menu {
    border: 0px;
    width: 100%;
    text-align: center;
}

.left {
    width: 100%;
    height: 350px;
    border: 1px #e4e4e4 solid;

    .title {
        color: #404040;
        padding: 20px 0 20px 15px;
        border-bottom: 1px #e4e4e4 solid;
    }
}

.right {
    width: 100%;
    min-height: 200px;
    border: 1px #e4e4e4 solid;
}
</style>
