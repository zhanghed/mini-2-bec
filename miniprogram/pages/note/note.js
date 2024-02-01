//全局变量
const App = getApp().globalData
//局部变量
let sss = App.sss
// let arr = JSON.parse(JSON.stringify(App.sss))

Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		arr:[]
	},
	//点击记录
	one: function (e) {
		let index = e.currentTarget.dataset.pid
		this.data.arr[index][2] = !this.data.arr[index][2] //修改标记
		this.setData({
			arr: this.data.arr
		})
	},
	//全选
	click_all: function () {
		for (let item of this.data.arr) {
			item[2] = false
		}
		this.setData({
			arr: this.data.arr
		})
	},
	//反选
	click_invert: function () {
		for (let item of this.data.arr) {
			item[2] = !item[2]
		}
		this.setData({
			arr: this.data.arr
		})
	},
	//删除
	click_delete: function (e) {
		let that = this
		let x = false
		for (let item of this.data.arr) { //查看是否有选中的记录
			if (!item[2]) {
				x = true
				break
			}
		}
		if (x) {
			wx.showModal({
				title: '确认删除？',
				success: function (res) {
					if (res.confirm) {
						for (let item of that.data.arr) {
							if (!item[2]) { //删除标记为假的数据
								let a = item[0].replaceAll('/', 'z')
								delete sss[a]
							}
						}
						App.sss = sss
						// wx.setStorageSync('sss', sss);
						console.log('text');
						(async () => { //更新云端数据
							await wx.cloud.callFunction({
								name: 'text',
								data: {
									text: JSON.stringify(sss)
								}
							})
						})()
						that.data.arr = that.show(sss)
						that.setData({
							arr: that.data.arr
						})
					}
				}
			})
		}
	},
	//显示
	show: function (a) {
		wx.showLoading({
			title: '加载中',
			mask: true
		})
		delete a['date']
		a = Object.entries(a) //转数组
		a = a.map(item => { //日期转格式
			return [item[0].replaceAll('z', '/'), item[1], true]
		})
		a = a.sort((a, b) => { //根据日期排序
			return Date.parse(b[0]) - Date.parse(a[0]);
		})
		wx.hideLoading()
		return a
	},
	/**
	 * 生命周期函数--监听页面加载
	*/
	onLoad: function (options) {
		// let a = JSON.parse(JSON.stringify(App.sss))
		let sss = JSON.parse(JSON.stringify(App.sss))
		let arr = this.show(sss)
		// 复位
		for (let item of arr) {
			item[2] = true
		}
		this.setData({
			arr: arr
		})
	},

})