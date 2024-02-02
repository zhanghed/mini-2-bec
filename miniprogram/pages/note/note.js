//全局变量
const App = getApp().globalData

let modal = {
	"arr": [{
		"count": 0,
		"month": "1"
	}, {
		"count": 0,
		"month": "2"
	}, {
		"count": 0,
		"month": "3"
	}, {
		"count": 0,
		"month": "4"
	}, {
		"count": 0,
		"month": "5"
	}, {
		"count": 0,
		"month": "6"
	}, {
		"count": 0,
		"month": "7"
	}, {
		"count": 0,
		"month": "8"
	}, {
		"count": 0,
		"month": "9"
	}, {
		"count": 0,
		"month": "10"
	}, {
		"count": 0,
		"month": "11"
	}, {
		"count": 0,
		"month": "12"
	}, ],
	"year": "",
	"count": 0
}
let sss = null
Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		arr: [],
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad(options) {
		sss = JSON.parse(JSON.stringify(App.sss))
		let arr = []
		// !--__--! 统计每个月的记录条数
		for (let key in sss) {
			const date = key.split("z")
			const y = String(date[0])
			const m = String(date[1])
			let ty = arr.find(i => i.year === y)
			if (ty) {
				let tm = ty.arr.find(i => i.month === m)
				tm.count += 1
				ty.count += 1
			} else {
				let modali = JSON.parse(JSON.stringify(modal))
				modali.year = y
				let tm = modali.arr.find(i => i.month === m)
				tm.count += 1
				modali.count += 1
				arr.push(modali)
			}
		}
		arr.sort((a, b) => b.year - a.year)
		this.setData({
			arr: arr
		})

	},
	// 删除
	disCloseFun(event) {
		let that = this
		wx.showModal({
			title: '确认删除？',
			success: function (res) {
				if (res.confirm) {
					let year = Number(event.currentTarget.dataset.year)
					let no = Number(event.currentTarget.dataset.pid)
					let arr = that.data.arr
					arr.splice(no, 1)
					for (let key in sss) {
						if (key.indexOf(year) == 0) {
							delete sss[key]
						}
					}
					that.setData({
						arr: arr
					});
				}
			}
		})
	},
	// 提交
	formSubmit: function () {
		wx.showModal({
			title: '确认提交？',
			success: function (res) {
				if (res.confirm) {
					(async () => {
						wx.showLoading({
							title: '加载中',
							mask: true
						})
						await wx.cloud.callFunction({
							name: 'text',
							data: {
								text: JSON.stringify(sss)
							}
						})
						wx.hideLoading()
						wx.reLaunch({
							url: '/pages/index/index'
						})
					})()
				}
			}
		})
	},
	/**
	 * 生命周期函数--监听页面初次渲染完成
	 */
	onReady() {

	},

	/**
	 * 生命周期函数--监听页面显示
	 */
	onShow() {

	},

	/**
	 * 生命周期函数--监听页面隐藏
	 */
	onHide() {

	},

	/**
	 * 生命周期函数--监听页面卸载
	 */
	onUnload() {

	},

	/**
	 * 页面相关事件处理函数--监听用户下拉动作
	 */
	onPullDownRefresh() {

	},

	/**
	 * 页面上拉触底事件的处理函数
	 */
	onReachBottom() {

	},

	/**
	 * 用户点击右上角分享
	 */
	onShareAppMessage() {

	}
})