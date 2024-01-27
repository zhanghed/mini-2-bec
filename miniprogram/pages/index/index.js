import {
	table_data
} from '../../utils/table_data.js'

// 系统日期
const Localdate = {
	year: new Date().getFullYear(),
	month: new Date().getMonth() + 1,
	day: new Date().getDate(),
}
// 全局变量
const App = getApp().globalData
// 局部变量
let k = false
let k2 = [] //输入框展示日期用
let ran = Math.floor(Math.random() * 12 + 1)
Page({
	data: {
		year: Localdate.year,
		month: Localdate.month,
		dis: App.dis,
		show: App.shows[0],
		sss: App.sss,
		no: App.no,
		idd: 's' + Localdate.year + Localdate.month,
		zi: false,
		tabw: App.tabw,
		tabh: App.tabh,
		weekh: App.weekh,
		mainh: App.mainh,
		buth: App.buth,
		week: ['日', '一', '二', '三', '四', '五', '六'],
		ran: ran
	},

	// 加载
	onLoad: function (options) {
		(async () => {
			wx.showLoading({
				title: '加载中',
				mask: true
			})
			// 云函数获取状态信息
			let tamp = null //真为需要重新获取，假为使用不用重新获取
			await wx.cloud.callFunction({
				name: 'information_get',
				data: {}
			}).then(res => {
				let r = res.result.data
				if (r[0]) {
					if (r[0].information.timestamp != App.information.timestamp) { // 判断云端是否有更改
						tamp = true
					} else {
						tamp = false
					}
				} else {
					tamp = true
				}
			})
			console.log(tamp)

			// // 信息状态
			// App.information = {
			// 	timestamp: new Date().getTime() //时间戳
			// }
			// // 缓存
			// wx.setStorageSync('information', App.information)
			// // 云函数设置或更新
			// await wx.cloud.callFunction({
			// 	name: 'information',
			// 	data: {
			// 		information: App.information
			// 	}
			// }).then(res => {
			// 	console.log(res)
			// })

		})()
		// 分享且无规则
		if (options.uuid != null && options.uuid != undefined && App.dis.length == 0) {
			wx.showLoading({
				title: '加载中',
				mask: true
			})
			console.log('分享且无规则')
			App.dis = JSON.parse(options.uuid).slice(0);
			(async () => {
				await wx.cloud.callFunction({
					name: 'user',
					data: {
						dis: App.dis
					}
				}).then(res => {})
				await wx.cloud.callFunction({
					name: 'text_get',
					data: {}
				}).then(res => {
					let r = res.result.data
					App.sss = r[0] ? JSON.parse(r[0].text) : {}
				})
				await (async () => {
					App.shows = table_data(Localdate.year, App.dis)
					wx.setStorageSync('shows', App.shows)
					wx.setStorageSync('dis', App.dis)
					wx.setStorageSync('sss', App.sss)
					this.shows_data()
				})()
			})()
		}
		// 空白
		else if (App.shows.length == 0) {
			wx.showLoading({
				title: '加载中',
				mask: true
			})
			console.log('空白');
			(async () => {
				await wx.cloud.callFunction({
					name: 'user_get',
					data: {}
				}).then(res => {
					let r = res.result.data
					App.dis = r[0] ? r[0].dis : []
				})
				await wx.cloud.callFunction({
					name: 'text_get',
					data: {}
				}).then(res => {
					let r = res.result.data
					App.sss = r[0] ? JSON.parse(r[0].text) : {}
				})
				await (async () => {
					App.shows = table_data(Localdate.year, App.dis)
					wx.setStorageSync('shows', App.shows)
					wx.setStorageSync('dis', App.dis)
					wx.setStorageSync('sss', App.sss)
					this.shows_data()
				})()
			})()
		}
		// 跨年
		else if (App.shows[0][0][10].sYear != Localdate.year) {
			wx.showLoading({
				title: '加载中',
				mask: true
			})
			console.log('跨年')
			App.shows = table_data(Localdate.year, App.dis)
			wx.setStorageSync('shows', App.shows)
			this.shows_data()
		}
		// 正常
		else {
			wx.showLoading({
				title: '加载中',
				mask: true
			})
			console.log('正常')
			this.shows_data()
		}
	},

	// 显示
	shows_data: function () {
		// 今天
		for (let item of App.shows) {
			for (let i of item[Localdate.month - 1]) {
				if (i.sDay == Localdate.day && this.data.year == Localdate.year) {
					i.now_day = true
				}
			}
		}
		// 绑定数据
		this.setData({
			dis: App.dis,
			show: App.shows[App.no],
			sss: App.sss,
		})
		wx.hideLoading()
		this.setData({
			idd: 's' + this.data.year + this.data.month,
		})
	},

	// 选择标签
	click_tab: function (event) {
		App.no = Number(event.currentTarget.dataset.pid)
		this.setData({
			no: App.no,
			show: App.shows[App.no]
		})
		wx.setStorageSync('no', App.no)
	},

	//更改日期
	set_date: function (e) {
		if (Number(e.currentTarget.dataset.pid)) {
			this.setData({
				year: Localdate.year,
				month: Localdate.month
			})
		} else {
			this.setData({
				year: Number(e.detail.value.split('-')[0]),
				month: Number(e.detail.value.split('-')[1])
			})
		}
		if (this.data.show[0][10].sYear == this.data.year) {
			this.setData({
				idd: 's' + this.data.year + this.data.month,
			})
		} else {
			wx.showLoading({
				title: '加载中',
				mask: true
			})
			App.shows = table_data(this.data.year, App.dis)
			this.shows_data()
		}
	},
	//点击格子
	click_block: function (e) {
		k = e.currentTarget.dataset.pid

		// 输入框展示日期用
		k2 = e.currentTarget.dataset.pid2
		k2 = [k2.sYear, k2.sMonth, k2.sDay]

		this.setData({
			k: k,
			k2: k2,
			zi: !this.data.zi
		})
	},

	//输入框输入完成
	confirm: function (event) {
		let x = event.detail.value.trim() ? event.detail.value.trim() : false
		if (x && Object.getOwnPropertyNames(App.sss).length >= 500) { //判断记录数
			wx.showModal({
				title: '特殊标记数量限制，请及时清理！ ',
			})
		} else {
			if (x) { //有内容，更新
				App.sss[k] = x
				this.setData({
					sss: App.sss
				})
			} else { //没有内容，删除
				delete App.sss[k]
				this.setData({
					sss: App.sss
				})
			}
			wx.setStorageSync('sss', App.sss);
			wx.cloud.callFunction({
				name: 'text',
				data: {
					text: JSON.stringify(App.sss)
				}
			})
		}
	},

	//输入框失去焦点
	blur: function (event) {
		this.setData({
			zi: !this.data.zi
		})
	},
	//跳转页面
	to_work: function (event) {
		wx.navigateTo({
			url: '/pages/work/work'
		})
	},
	to_note: function (event) {
		wx.navigateTo({
			url: '/pages/note/note'
		})
	},
	to_about: function (event) {
		wx.navigateTo({
			url: '/pages/about/about'
		})
	},

	//右上角分享
	onShareAppMessage: function () {
		if (App.dis.length > 0) {
			let uuid = JSON.stringify(App.dis)
			return {
				path: '/pages/index/index?uuid=' + uuid,
			}
		}
	},
	/**
	 * 生命周期函数--监听页面显示
	 */
	onShow: function () {
		this.setData({
			sss: App.sss
		})
	}



})