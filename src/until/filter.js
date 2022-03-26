import Vue from 'vue'

// 个人中心-支付状态
Vue.filter('orderMap', value => {
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
})
Vue.filter('time',value =>{
	return value.toLocaleString().replace(/T/g, ' ').replace(/\.[\d]{3}Z/, '')
})

Vue.filter('phone', function (value) {
  if (!value) return '';
  let str = value;
  str = str.toString().replace(/^(\d{3})(\d{4})(\d{4})/g , '$1****$3')
  return str;
})
Vue.filter('rounding', function (value) {

  let toFixedNum = Number(value).toFixed(3);
      let realVal = toFixedNum.substring(0, toFixedNum.toString().length - 1);
      return realVal;

})
