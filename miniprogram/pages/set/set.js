Page({

	data: {
		inputValue: '未命名',
		date: '2016-09-01',
		array: ['美国', '中国', '巴西', '日本'],
		no: 0,
		dis: [{
			listName: '',
			listDate: '',
			listRule: []
		}]
	},

	bindKeyInput: function (e) {
		console.log(e.detail.value)
		this.setData({
			inputValue: e.detail.value
		})
	},
	bindDateChange: function (e) {
		console.log(e.detail.value)
		this.setData({
			date: e.detail.value
		})
	},
	bindPickerChange: function (e) {
		console.log(e.detail.value)
		let dis = this.data.dis
		dis[this.data.no].listRule.push(this.data.array[e.detail.value])
		this.setData({
			dis: dis
		})
	},
	submit(e) {
		console.log('submit')
	},

	reset(e) {
		console.log('reset')
	}
})