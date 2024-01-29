import {
	CalendarConverter
}
from './calendar-converter.js'

//颜色数据
const color = function (x) {
	switch (x) {
		case "休息":
			return 'xiuxi';
		case "全天":
			return 'quantian';
		case "白班":
			return 'baiban';
		case "夜班":
			return 'yeban';
		case "早班":
			return 'zaoban';
		case "中班":
			return 'zhongban';
		case "晚班":
			return 'wanban';
		case "大夜":
			return 'daye';
		case "小夜":
			return 'xiaoye';
		case "大白":
			return 'dabai';
		case "小白":
			return 'xiaobai';
		case "值班":
			return 'zhiban';
	}
}

//日历数据（以‘日’开始的满格的数据）
const data_m = function (year, month) {
	// 转换方法
	const calendarConverter = new CalendarConverter()
	// 转换后的数据集
	let days = new Date(year, month, 0).getDate()
	let arr = []
	for (let i = 1; i <= days; i++) {
		arr.push({
			...calendarConverter.solar2lunar(new Date(year, month - 1, i))
		})
	}
	// 补全前后空位
	let week = ['日', '一', '二', '三', '四', '五', '六']
	let start = week.findIndex(item => arr[0].week == item)
	let end = week.findIndex(item => arr[arr.length - 1].week == item)
	arr = [...week.slice(0, start), ...arr, ...week.slice(end + 1, )]
	return arr
}

//序列数据(倒序的)
const rule_m = function (year, month, l, ld) {
	let arr = []
	//序列反用
	const listre = l.slice(0).reverse()
	//含有序列的天数（当月的最后一天与序列开始日期之间相隔的天数）
	const as = (((new Date(year, month, 0)) - (new Date(ld))) / 1000 / 60 / 60 / 24) + 1
	//余数部分拼接（余下零散的）
	const as1 = parseInt(as % listre.length)
	if (as1 > 0) {
		for (let i of listre.slice(-as1)) {
			arr.push(i)
		}
	}
	//整数部分拼接（整倍数的个数）
	const as2 = parseInt(as / listre.length)
	for (let i = 0; i < as2; i++) {
		arr = arr.concat(listre)
		//只要当月的
		if (arr.length >= new Date(year, month, 0).getDate()) {
			break
		}
	}
	return arr
}

//日历数据与序列数据合并
const data_rule_m = function (year, month, item) {
	// 日历
	let arr1 = data_m(year, month)
	// 序列
	let arr2 = rule_m(year, month, item['listRule'], item['listDate'])
	//合并
	let n = 0
	for (let i = arr1.length - 1; i >= 0; i--) {
		if (arr1[i].sDay) {
			//添加序列属性
			arr1[i].li = arr2[n]
			//添加颜色属性
			arr1[i].color = color(arr2[n])
			n += 1
		}
	}
	return arr1
}

//获取一年的（根据需求）
const main = function (year, dis = []) {
	let arr = []
	// 有规则
	if (dis.length > 0) {
		for (let item of dis) {
			let temp = []
			for (let i = 0; i < 12; i++) {
				temp.push(data_rule_m(year, 1 + i, item))
			}
			arr.push(temp)
		}
	}
	// 无规则
	else {
		let temp = []
		for (let i = 0; i < 12; i++) {
			temp.push(data_m(year, 1 + i))
		}
		arr.push(temp)
	}
	return arr
}

export
const table_data = main