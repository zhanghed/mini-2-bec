// 全局变量
const App = getApp().globalData
// 系统日期
const Localdate = {
	year: new Date().getFullYear(),
	month: new Date().getMonth() + 1,
	day: new Date().getDate(),
}
// 颜色对象集合
const colors = [{
		name: '休息',
		color: 'xiuxi'
	},
	{
		name: '全天',
		color: 'quantian'
	},
	{
		name: '白班',
		color: 'baiban'
	},
	{
		name: '夜班',
		color: 'yeban'
	},
	{
		name: '早班',
		color: 'zaoban'
	},
	{
		name: '中班',
		color: 'zhongban'
	},
	{
		name: '晚班',
		color: 'wanban'
	},
	{
		name: '大夜',
		color: 'daye'
	},
	{
		name: '小夜',
		color: 'xiaoye'
	},
	{
		name: '大白',
		color: 'dabai'
	},
	{
		name: '小白',
		color: 'xiaobai'
	},
	{
		name: '值班',
		color: 'zhiban'
	},
]
// 规则选择器集合
const range = function () {
  let temp = colors.map(i => i.name)
  temp.push('自定义')
  return temp
}
Page({
	data: {
		range: range(),
		dis: [],
		show: []
	},
	// 修改规则名称
	listNameFun: function (event) {
		let no = event.target.dataset.pid
		let name = event.detail.value.trim() ? event.detail.value.trim().slice(0, 3) : '未命名'
		let dis = JSON.parse(JSON.stringify(this.data.dis))
		let show = JSON.parse(JSON.stringify(this.data.show))
		dis[no].listName = name
		show[no].listName = name
		this.setData({
			dis,
			show
		})
	},
	// 修改开始日期
	listDateFun: function (event) {
		let no = event.target.dataset.pid
		let date = event.detail.value.replaceAll("-", "/")
		let dis = JSON.parse(JSON.stringify(this.data.dis))
		let show = JSON.parse(JSON.stringify(this.data.show))
		dis[no].listDate = date
		show[no].listDate = date
		this.setData({
			dis,
			show
		})
	},
	// 修改标签名称
	rulesNameFun: function (event) {
		let no = event.target.dataset.pid
		let nor = event.target.dataset.pidr
		let oldname = this.data.show[no].listRule[nor].name
		let name = event.detail.value.trim() ? event.detail.value.trim().slice(0, 3) : oldname
		let dis = JSON.parse(JSON.stringify(this.data.dis))
		let show = JSON.parse(JSON.stringify(this.data.show))
		dis[no].listRule[nor] = name
		show[no].listRule[nor] = this.showFun(name)
		this.setData({
			dis,
			show
		})
	},
	// 追加规则标签
	listRuleFun: function (event) {
		let no = event.target.dataset.pid
		let rangeNo = event.detail.value
		let dis = JSON.parse(JSON.stringify(this.data.dis))
		let show = JSON.parse(JSON.stringify(this.data.show))
		dis[no].listRule.push(this.data.range[rangeNo])
		show[no].listRule.push(this.showFun(this.data.range[rangeNo]))
		this.setData({
			dis,
			show
		})
	},
	// 删除规则标签
	listRulePopFun: function (event) {
		let no = event.target.dataset.pid
		let dis = JSON.parse(JSON.stringify(this.data.dis))
		let show = JSON.parse(JSON.stringify(this.data.show))
		dis[no].listRule.pop()
		show[no].listRule.pop()
		this.setData({
			dis,
			show
		})
	},
	// 添加规则dis
	disAddFun: function () {
		let itemNew = {
			listName: '未命名',
			listDate: Localdate.year + '/' + Localdate.month + '/' + Localdate.day,
			listRule: []
		}
		let dis = JSON.parse(JSON.stringify(this.data.dis))
		let show = JSON.parse(JSON.stringify(this.data.show))
		dis.push(itemNew)
		show.push(itemNew)
		this.setData({
			dis,
			show
		})
	},
	// 删除规则dis
	disCloseFun: function (event) {
		let that = this
		let no = Number(event.currentTarget.dataset.pid)
		let dis = JSON.parse(JSON.stringify(this.data.dis))
		let show = JSON.parse(JSON.stringify(this.data.show))
		wx.showModal({
			title: '确认删除？',
			success: function (res) {
				if (res.confirm) {
					dis.splice(no, 1)
					show.splice(no, 1)
					that.setData({
						dis,
						show
					})
				}
			}
		})
	},
	// 提交
	formSubmit: function () {
		const dis = this.data.dis
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
							name: 'user',
							data: {
								dis: dis
							}
						})
						App.no = 0;
						wx.hideLoading()
						wx.reLaunch({
							url: '/pages/index/index'
						})
					})()
				}
			}
		})
	},
	// 显示元素结构
	showFun: function (item) {
		let temp = colors.find(i => i.name === item)
		return temp || {
			name: item,
			color: 'zidingyi'
		}
	},
	// 加载
	onLoad: function () {
		const dis = App.dis
		// 深拷贝
		let show = JSON.parse(JSON.stringify(dis))
		// 构建显示数据
		for (let index = 0; index < show.length; index++) {
			show[index].listRule = show[index].listRule.map(item => {
				return JSON.parse(JSON.stringify(this.showFun(item)))
			})
		}
		this.setData({
			dis: dis,
			show: show
		})
	},
})