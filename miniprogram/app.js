App({
	// 全局变量
	globalData: {
		dis: wx.getStorageSync('dis') ? wx.getStorageSync('dis') : [],
		shows: wx.getStorageSync('shows') ? wx.getStorageSync('shows') : [],
		no: wx.getStorageSync('no') ? wx.getStorageSync('no') : 0,
		sss: wx.getStorageSync('sss') ? wx.getStorageSync('sss') : {},
		//信息 用来判断是否更新等
		information: wx.getStorageSync('information') ? wx.getStorageSync('information') : {},
		tabw: 0,
		tabh: 0,
		weekh: 0,
		mainh: 0,
		buth: 0
	},
	// 初始化
	onLaunch: function (options) {
		let windowHeight = wx.getSystemInfoSync().windowHeight
		//获取系统信息
		wx.getSystemInfo({
			success: res => {
				let sysh = res.statusBarHeight
				//获取胶囊信息
				let menu = wx.getMenuButtonBoundingClientRect()
				let tabh = (menu.top - sysh) * 2 + menu.height + sysh
				let tabw = menu.left
				let h = windowHeight - tabh
				let weekh = (h / 100) * 4
				let mainh = (h / 100) * 89
				let buth = (h / 100) * 7
				this.globalData.tabw = tabw
				this.globalData.tabh = tabh
				this.globalData.weekh = weekh
				this.globalData.mainh = mainh
				this.globalData.buth = buth
			}
		})
		// 初始化云开发
		wx.cloud.init({
			traceUser: true,
			env: 'bec2-bec-5gakzu4b27a62a34'
		})
		// 小程序更新
		const updateManager = wx.getUpdateManager()
		updateManager.onUpdateReady(function () {
			wx.showModal({
				title: '更新提示',
				content: '新版本已准备好,是否重启小程序?',
				success: function (res) {
					if (res.confirm) {
						updateManager.applyUpdate()
					}
				}
			})
		})
	}
})