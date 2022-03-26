<template>
    <div class="back">
        <div class="login">
            <div style="line-height: 50px;text-align: center;">
                <span style="color: #007AFF;">用户登录</span>
                <router-link to="/">
                    <span style="float: right;" class="ziti">首页</span>
                </router-link>
            </div>

            <el-form :rules="rules" :model="ruleForm" ref="loginForm">
                <el-form-item prop="username">
                    <el-input type="text" v-model.trim="ruleForm.username" autocomplete="off" placeholder="请输入手机号码">
                        <template slot="prepend"><i class="el-icon-s-custom"></i></template>
                    </el-input>
                </el-form-item>
                <el-form-item prop="password">

                    <el-input :type="pwdType" v-model.trim="ruleForm.password" autocomplete="off" placeholder="请输入密码">
                        <i slot="prepend" class="el-icon-unlock"></i>
                        <i slot="suffix" class="el-input__icon el-icon-view" @click="showPwd"></i>
                    </el-input>
                </el-form-item>
                <el-form-item prop="code">
                    <el-row>
                        <el-col :span="14">
                            <el-input type="text" v-model="ruleForm.code" auto-complete="off"></el-input>
                        </el-col>
                        <el-col :span="10">
                            <!-- <div class="login-code" @click="refreshCode"> -->
                            <!--验证码组件-->
                            <s-identify :identifyCode="identifyCode" @click.native="refreshCode"></s-identify>
                            <!-- </div> -->
                        </el-col>
                    </el-row>
                </el-form-item>
                <el-form-item>
                    <el-button style="width: 100%" type="primary" @click="submitForm">立即登录</el-button>
                </el-form-item>
                <el-form-item>
                    <router-link to='/register'>
                        <el-button style="width: 100%">马上去注册成新用户</el-button>
                    </router-link>
                </el-form-item>
            </el-form>
        </div>

    </div>
</template>

<script>
import SIdentify from '../components/SIdentify.vue'
export default {
    components: {
        SIdentify,
    },
    name: 'Login',
    data() {
        const validatePhone = (rule, value, callback) => {
            if (!value) {
                callback(new Error('请输入手机号码!'))
            }
            if (!/^1[34578]\d{9}$/.test(value)) {
                callback(new Error('请输入正确的手机号码!'))
            } else {
                callback()
            }
        }
        const validateCode = (rule, value, callback) => {
            if (!value) {
                callback(new Error('请输入验证码!'))
            } else {
                if (this.identifyCode !== value) {
                    this.refreshCode()
                    console.log('验证码错误')
                    callback(new Error('请输入正确的验证码'))
                } else {
                    callback()
                }
            }
        }
        return {
            pwdType: 'password',
            ruleForm: {
                username: '',
                password: '',
                code: '',
            },
            identifyCodes: '1234567890',
            identifyCode: '',
            rules: {
                username: [
                    {
                        required: 'true',
                        trigger: 'blur',
                        validator: validatePhone,
                    },
                ],
                password: [
                    {
                        required: 'true',
                        message: '密码不能为空',
                        trigger: 'blur',
                    },
                ],
                code: [
                    {
                        required: true,
                        message: '请输入验证码',
                        trigger: 'blur',
                    },
                    {
                        trigger: 'blur',
                        validator: validateCode,
                    },
                ],
            },
        }
    },
    methods: {
        checkPhone(rule, value, callback) {
            if (!value) {
                callback(new Error('请输入手机号码!'))
            }
            if (!/^1[34578]\d{9}$/.test(value)) {
                callback(new Error('请输入正确的手机号码!'))
            }
        },
        validateCode(rule, value, callback) {
            if (this.identifyCode !== value) {
                callback(new Error('请输入正确的验证码'))
            } else {
                callback()
            }
        },
        submitForm() {
            this.$refs.loginForm.validate(valid => {
                if (valid) {
                    this.$axios
                        .post('/login', {
                            loginName: this.ruleForm.username,
                            password: this.ruleForm.password,
                        })
                        .then(res => {
                            if (res.code == 200) {
                                this.$message.success('登录成功')
                                console.log('ff' + res.data)
                                window.localStorage.setItem('token', res.data)
                                window.location.href = '/'
                            } else {
                                this.$message.error(res.data)
                            }
                        })
                } else {
                    console.log('error submit!!')
                    return false
                }
            })
        },
        refreshCode() {
            this.identifyCode = ''
            this.makeCode(this.identifyCodes, 4)
        },
        randomNum(min, max) {
            return Math.floor(Math.random() * (max - min) + min)
        },
        makeCode(o, l) {
            for (let i = 0; i < l; i++) {
                this.identifyCode += this.identifyCodes[this.randomNum(0, this.identifyCodes.length)]
            }
        },
        showPwd() {
            this.pwdType === 'password' ? (this.pwdType = '') : (this.pwdType = 'password')
            let e = document.getElementsByClassName('el-icon-view')[0]
            this.pwdType == '' ? e.setAttribute('style', 'color: #409EFF') : e.setAttribute('style', 'color: #c0c4cc')
        },
    },
    created() {
        this.refreshCode()
    },
}
</script>

<style scoped lang="less">
.back {
    height: 100vh;
    background-image: url(../assets/back.jpg);
    background-size: 100% 100%;
    position: relative;
}

.ziti {
    color: #4a4a4a !important;
    font-size: 16px;
    text-decoration: none;

    &:hover {
        color: #00aaff !important;
    }
}

.login {
    position: absolute;
    right: 50px;
    top: 100px;
    padding: 10px 30px;
    width: 30%;
    background-color: #ffffff;
}
</style>
