<template>
    <div class="back">
        <div class="register">
            <div style="line-height: 50px; text-align: center">
                <span style="color: #007aff">用户登录</span>
                <router-link to="/">
                    <span style="float: right" class="ziti">首页</span>
                </router-link>
            </div>
            <el-form :rules="rules" :model="ruleForm" ref="registerForm">
                <el-form-item prop="username">
                    <el-input
                        type="text"
                        v-model.trim="ruleForm.username"
                        autocomplete="off"
                        placeholder="请输入手机号码"
                    >
                        <template slot="prepend"><i class="el-icon-s-custom"></i></template>
                    </el-input>
                </el-form-item>
                <el-form-item prop="password">
                    <el-input
                        :type="pwdType"
                        v-model.trim="ruleForm.password"
                        autocomplete="off"
                        placeholder="请输入密码"
                    >
                        <i slot="prepend" class="el-icon-unlock"></i>
                        <i slot="suffix" class="el-input__icon el-icon-view" @click="showPwd"></i>
                    </el-input>
                </el-form-item>
                <el-form-item prop="checkPass">
                    <el-input
                        :type="pwdType1"
                        v-model="ruleForm.checkPass"
                        autocomplete="off"
                        placeholder="请输入确认密码"
                    >
                        <i slot="prepend" class="el-icon-unlock"></i>

                        <i slot="suffix" class="el-input__icon el-icon-view" @click="showPwd1"></i>
                    </el-input>
                </el-form-item>
                <el-form-item prop="code">
                    <el-row>
                        <el-col :span="14">
                            <el-input
                                v-model="ruleForm.code"
                                auto-complete="off"
                                label="验证码:"
                                placeholder="请输入验证码"
                            ></el-input>
                        </el-col>
                        <el-col :span="10">
                            <!--验证码组件-->
                            <s-identify
                                :identifyCode="identifyCode"
                                @click.native="refreshCode"
                            ></s-identify>
                        </el-col>
                    </el-row>
                </el-form-item>
                <el-form-item prop="condition">
                    <el-checkbox v-model="ruleForm.condition" label=""
                        >注册表示您已同意<a>《注册协议》</a></el-checkbox
                    >
                </el-form-item>

                <el-form-item>
                    <el-button style="width: 100%" type="primary" @click="submitForm"
                        >立即注册</el-button
                    >
                </el-form-item>
            </el-form>
            <router-link to="/login">
                <el-button style="width: 100%; margin: 0" type="text">已有账户，去登陆</el-button>
            </router-link>
        </div>
    </div>
</template>

<script>
import SIdentify from '../components/SIdentify.vue'
export default {
    components: {
        SIdentify,
    },
    name: 'Register',
    data() {
        const validateCheckbox = (rule, value, callback) => {
            if (value) {
                callback()
            } else {
                callback(new Error('请先阅读并同意注册协议'))
            }
        }
        const validatePass2 = (rule, value, callback) => {
            if (value === '') {
                callback(new Error('请再次输入密码'))
            } else if (value !== this.ruleForm.password) {
                callback(new Error('两次输入密码不一致!'))
            } else {
                callback()
            }
        }
        const validatePass1 = (rule, value, callback) => {
            console.log('dsf=' + value)
            if (value !== '') {
                console.log('dddd')
                if (this.ruleForm.checkPass !== '') {
                    console.log('dddd2')
                    this.$refs.registerForm.validateField('checkPass')
                }
                const passwordreg = /(?=.*\d)(?=.*[a-zA-Z])(?=.*[^a-zA-Z0-9]).{6,16}/
                if (!passwordreg.test(value)) {
                    console.log('dddd3')
                    callback(new Error('密码必须由数字、字母、特殊字符组合,请输入6-16位'))
                }
            } else {
                callback(new Error('请输入密码'))
            }
            callback()
        }
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
            pwdType1: 'password',
            pwdType: 'password',
            ruleForm: {
                username: '',
                password: '',
                checkPass: '',
                code: '',
                condition: false,
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
                        transform: value => value,
                        trigger: 'blur',
                        validator: validatePass1,
                    },
                    {
                        type: 'string',
                        message: '请输入不包含空格的字符',
                        trigger: 'blur',
                        transform(value) {
                            if (value && value.indexOf(' ') === -1) {
                                return value
                            } else {
                                return false
                            }
                        },
                    },
                ],
                code: [
                    {
                        trigger: 'blur',
                        validator: validateCode,
                    },
                ],
                checkPass: [
                    {
                        validator: validatePass2,
                        trigger: 'blur',
                    },
                ],
                condition: [
                    {
                        trigger: 'change',
                        validator: validateCheckbox,
                    },
                ],
            },
        }
    },
    methods: {
        submitForm() {
            this.$refs.registerForm.validate(valid => {
                if (valid) {
                    this.$axios
                        .post('/register', {
                            loginName: this.ruleForm.username,
                            password: this.ruleForm.password,
                        })
                        .then(res => {
                            if (res.code === 200) {
                                this.$message.success('注册成功')
                                this.$router.push({
                                    path: '/login',
                                })
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
                this.identifyCode +=
                    this.identifyCodes[this.randomNum(0, this.identifyCodes.length)]
            }
        },
        showPwd() {
            this.pwdType === 'password' ? (this.pwdType = '') : (this.pwdType = 'password')
            const e = document.getElementsByClassName('el-icon-view')[0]
            this.pwdType === ''
                ? e.setAttribute('style', 'color: #409EFF')
                : e.setAttribute('style', 'color: #c0c4cc')
        },
        showPwd1() {
            this.pwdType1 === 'password' ? (this.pwdType1 = '') : (this.pwdType1 = 'password')
            const e = document.getElementsByClassName('el-icon-view')[1]
            this.pwdType1 === ''
                ? e.setAttribute('style', 'color: #409EFF')
                : e.setAttribute('style', 'color: #c0c4cc')
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
.register {
    position: absolute;
    right: 50px;
    top: 60px;
    padding: 10px 30px;
    width: 30%;
    background-color: #ffffff;
}
</style>
