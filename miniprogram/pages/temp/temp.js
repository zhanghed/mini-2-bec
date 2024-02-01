//全局变量
const App = getApp().globalData
Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		arr: []
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad(options) {
		let sss = JSON.parse(JSON.stringify(App.sss))
		let arr = new Set()
		for (let key in sss) {
			const date = key.split("z")
			arr.add({
				year: String(date[0])
			})
		}
		// for (let key in sss) {
			// const date = key.split("z")
			// console.log(arr[String(date[0])])
			// arr[String(date[0])][String(date[0])]=1
		// }
		console.log(arr)
		// this.setData({
		// 	arr: arr
		// })
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