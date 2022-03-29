// 个人中心-支付状态
const orderMap = value => {
    switch (value) {
        case 0:
            return '待支付'
        case 1:
            return '已支付'
        case 2:
            return '配货完成'
        case 3:
            return '出库成功'
        case 4:
            return '交易成功'
        case -1:
            return '手动关闭'
        case -2:
            return '商家关闭'
        case -3:
            return '用户退款'
        case -4:
            return '退款成功'
        default:
            return '未知状态'
    }
}
const time = value => {
    return value
        .toLocaleString()
        .replace(/T/g, ' ')
        .replace(/\.[\d]{3}Z/, '')
}

const phone = value => {
    if (!value) return ''
    let str = value
    str = str.toString().replace(/^(\d{3})(\d{4})(\d{4})/g, '$1****$3')
    return str
}
const rounding = value => {
    const toFixedNum = Number(value).toFixed(3)
    const realVal = toFixedNum.substring(0, toFixedNum.toString().length - 1)
    return realVal
}
const price = value => {
    return value.toFixed(2)
}
export { orderMap, time, phone, rounding, price }
