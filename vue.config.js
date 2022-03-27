module.exports = {
	//lintOnSave: false,
	devServer: {
		port:8083,
		proxy: {
			'/user': {
				target: 'http://localhost:8089'
			},
			'/image':{
				target: 'http://localhost:8089'
			}

		}
	}
}
