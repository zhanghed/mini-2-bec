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
// let ran = Math.floor(Math.random() * 12 + 1)
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
		// ran: ran,
		//下划线位置
		line: {
			width: 0,
			left: 0
		}
	},

	// 页面加载钩子函数
	onLoad: function (options) {
		wx.showLoading({
			title: '加载中',
			mask: true
		});
		(async () => {
			// 正常加载 获取用户的规则和记事 生成日历数据 最后渲染
			let user_data = await wx.cloud.callFunction({
				name: 'user_get',
				data: {}
			})
			let text_data = await wx.cloud.callFunction({
				name: 'text_get',
				data: {}
			})
			App.dis = user_data.result.data[0] ? user_data.result.data[0].dis : []
			App.sss = text_data.result.data[0] ? JSON.parse(text_data.result.data[0].text) : []
			App.shows = table_data(Localdate.year, App.dis)
			this.shows_data()

			// 分享 先正常加载再判断分享情况
			// 如果采用分享来的规则 则更新云端规则 并且重新生成日历数据并渲染
			// 如果不采用 则跳出
			if (options.uuid != null && options.uuid != undefined) {
				const that = this
				wx.showModal({
					title: '您是否使用分享的规则？',
					success: function (res) {
						if (res.confirm) {
							(async () => {
								App.dis = JSON.parse(options.uuid).slice(0);
								await wx.cloud.callFunction({
									name: 'user',
									data: {
										dis: App.dis
									}
								})
								App.shows = table_data(Localdate.year, App.dis)
								that.shows_data()
							})()
						}
					}
				})
			};
		})()


	},

	// 渲染显示 先添加今天标记 之后绑定数据 最后再做日历滚动和下划线位置更改
	// 正常加载 处理分享 选择日期 三处需要调用
	shows_data: function () {
		for (let item of App.shows) {
			for (let i of item[Localdate.month - 1]) {
				if (i.sDay == Localdate.day && this.data.year == Localdate.year) {
					i.now_day = true
				}
			}
		}
		this.setData({
			dis: App.dis,
			show: App.shows[App.no],
			sss: App.sss,
		})
		this.setData({
			idd: 's' + this.data.year + this.data.month,
		})
		this.funLine()
		wx.hideLoading()
	},

	// 选择标签 获取点击序号 更改数据显示和下划线位置
	click_tab: function (event) {
		App.no = Number(event.currentTarget.dataset.pid)
		this.setData({
			no: App.no,
			show: App.shows[App.no]
		})
		this.funLine()
	},

	// 下划线 必须等到页面渲染完成在调用
	// 通过获取页面类名line元素 动态设置下划线
	funLine: function (event) {
		let query = wx.createSelectorQuery()
		query.select('.line').boundingClientRect((rect) => {
			if (App.dis.length > 1 && rect) {
				const line = {
					width: rect.width,
					left: rect.left
				}
				this.setData({
					line
				})
			}
		}).exec()
	},

	// 更改日期 获取用户选择的年月
	// 判断是否是当前显示的年 是则只滚动日历 不是则重新生成日历数据并渲染
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
			// wx.setStorageSync('sss', App.sss);
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
	// 生命周期函数--监听页面显示
	onShow: function () {
		this.setData({
			sss: App.sss
		})
	}

})