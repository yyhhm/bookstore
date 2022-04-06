<template>
    <el-dialog
        :title="type == 'add' ? '添加地址' : '修改地址'"
        :close-on-click-modal="false"
        :visible.sync="dialogFormVisible"
        width="600px"
        @close="handleClose"
    >
        <el-form :model="ruleForm" :rules="rules" ref="formRef" label-width="100px">
            <el-form-item label="所在地区:" prop="selectedOptions">
                <el-cascader
                    :options="areaSelectData"
                    @change="handleChange"
                    size="large"
                    v-model="ruleForm.selectedOptions"
                    placeholder="请选择您所在的城市"
                />
            </el-form-item>
            <el-form-item label="详细地址:" prop="detailAddress">
                <el-input
                    type="textarea"
                    v-model="ruleForm.detailAddress"
                    placeholder="街道或门牌号等"
                    :rows="4"
                    maxlength="100"
                >
                </el-input>
            </el-form-item>
            <el-row>
                <el-col :span="12">
                    <el-form-item label="收货人:" prop="name">
                        <el-input type="text" v-model="ruleForm.name"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="手机号码:" prop="phone">
                        <el-input type="text" v-model="ruleForm.phone"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button @click="dialogFormVisible = false">取 消</el-button>
            <el-button type="primary" @click="submitForm">确 定</el-button>
        </div>
    </el-dialog>
</template>

<script>
import { regionData, CodeToText, TextToCode } from 'element-china-area-data'
export default {
    name: 'AddressDialog',
    props: {
        type: String,
        reload: Function,
    },
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
        return {
            dialogFormVisible: false,
            areaSelectData: regionData, // options绑定的数据就是引入的 provinceAndCityData
            checked: false,
            id: '',
            ruleForm: {
                selectedOptions: [], // 地区选择参数，['省区域码', '市区域码']
                detailAddress: '',
                name: '',
                phone: '',
            },
            rules: {
                selectedOptions: {
                    required: 'true',
                    message: '地区不能为空',
                    trigger: 'blur',
                },
                detailAddress: {
                    required: 'true',
                    message: '请输入详细地址',
                    trigger: 'blur',
                },
                name: {
                    required: 'true',
                    message: '请输入收货人姓名',
                    trigger: 'blur',
                },
                phone: {
                    required: 'true',
                    trigger: 'blur',
                    validator: validatePhone,
                },
            },
        }
    },
    methods: {
        async open(id) {
            this.dialogFormVisible = true
            if (id > 0) {
                this.id = id
                await this.getDetail(this.id)
            }
        },
        handleClose() {
            this.dialogFormVisible = false
            this.$refs.formRef.resetFields()
            this.id = ''
        },
        handleChange(val) {
            console.log(val[0], val[1], val[2])
        },
        submitForm() {
            this.$refs.formRef.validate(valid => {
                if (valid) {
                    if (this.id) {
                        this.axios
                            .put('/address', {
                                addressId: this.id,
                                name: this.ruleForm.name,
                                phone: this.ruleForm.phone,
                                provinceName: CodeToText[this.ruleForm.selectedOptions[0]],
                                cityName: CodeToText[this.ruleForm.selectedOptions[1]],
                                regionName: CodeToText[this.ruleForm.selectedOptions[2]],
                                detailAddress: this.ruleForm.detailAddress,
                            })
                            .then(res => {
                                if (res.code === 200) {
                                    this.dialogFormVisible = false

                                    this.reload()
                                    this.$message.success('修改成功')
                                }
                            })
                    } else {
                        this.axios
                            .post('/address', {
                                name: this.ruleForm.name,
                                phone: this.ruleForm.phone,
                                provinceName: CodeToText[this.ruleForm.selectedOptions[0]],
                                cityName: CodeToText[this.ruleForm.selectedOptions[1]],
                                regionName: CodeToText[this.ruleForm.selectedOptions[2]],
                                detailAddress: this.ruleForm.detailAddress,
                            })
                            .then(res => {
                                if (res.code === 200) {
                                    this.dialogFormVisible = false

                                    this.reload()
                                    this.$message.success('添加成功')
                                }
                            })
                    }
                }
            })
        },
        async getDetail(id) {
            await this.axios.get(`/address/${id}`).then(res => {
                this.ruleForm.name = res.data.name
                this.ruleForm.phone = res.data.phone
                this.ruleForm.detailAddress = res.data.detailAddress
                this.ruleForm.selectedOptions = [
                    TextToCode[res.data.provinceName].code,
                    TextToCode[res.data.provinceName][res.data.cityName].code,
                    TextToCode[res.data.provinceName][res.data.cityName][res.data.regionName].code,
                ]
                console.log('ss+' + this.ruleForm.selectedOptions)
            })
        },
    },
}
</script>

<style></style>
