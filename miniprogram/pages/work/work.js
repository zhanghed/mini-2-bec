// 系统日期
const Localdate = {
  year: new Date().getFullYear(),
  month: new Date().getMonth() + 1,
  day: new Date().getDate(),
}
// 全局变量
const App = getApp().globalData
//局部变量
// let zi = false //显示隐藏输入框
let a = '' //输入框状态 修改规则名 日期 规则等
// let no = 0 //规则序号
// let dis = [] //规则集

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
    zi: false, //显示隐藏输入框
    no: 0,
    dis: App.dis,
    show: [],
    range: range() //规则选择器使用
  },

  // 加载
  onLoad: function (options) {
    // no = 0
    // let dis = App.dis.length > 0 ? JSON.parse(JSON.stringify(App.dis)) : []
    this.setData({
      // no: no,
      // dis: dis,
      show: this.showFun()
    })
  },

  //渲染 日期和规则
  showFun: function (x) {
    let d = this.data.dis[this.data.no] ? this.data.dis[this.data.no]['listDate'].split("/") : null
    let c = this.data.dis[this.data.no] ? this.data.dis[this.data.no]['listRule'].map(item => {
      let temp = colors.find(i => i.name === item)
      return temp || {
        name: item,
        color: 'zidingyi'
      }
    }) : null
    return [d, c]
  },

  //添加标签
  funTian: function (event) {
    if (this.data.dis.length < 50) {
      let dis = this.data.dis
      dis.push({
        listName: '未命名',
        listDate: Localdate.year + '/' + Localdate.month + '/' + Localdate.day,
        listRule: []
      })
      // no = dis.length - 1
      this.setData({
        no: dis.length - 1,
        dis: dis,
        show: showFun(dis[dis.length - 1]),
      })
    } else {
      wx.showToast({
        title: '需要更多请联系作者！',
        icon: 'none',
        duration: 2000
      })
    }
  },

  //切换标签
  funPa: function (event) {
    // no = Number(event.currentTarget.dataset.pid)
    this.setData({
      no: Number(event.currentTarget.dataset.pid),
      show: showFun(this.data.dis[Number(event.currentTarget.dataset.pid)])
    })
  },

  //删除标签
  funDle: function (event) {
    let that = this
    let x = Number(event.currentTarget.dataset.pid)
    wx.showModal({
      title: '确认删除？',
      success: function (res) {
        if (res.confirm) {
          let dis = that.data.dis
          dis.splice(x, 1)
          let n = dis[x] || x == 0 ? x : x - 1
          that.setData({
            no: n,
            dis: dis,
            show: showFun(dis[n]),
          })
        }
      }
    })
  },

  //选择时间
  funDate: function (event) {
    let x = event.detail.value.split('-')
    this.data.dis[this.data.no]['listDate'] = Number(x[0]) + '/' + Number(x[1]) + '/' + Number(x[2])
    this.setData({
      show: showFun(this.data.dis[this.data.no])
    })
  },

  // 规则选择器
  bindPickerChange: function (e) {
    if (this.data.dis[this.data.no]['listRule'].length < 50) {
      this.data.dis[this.data.no]['listRule'].push(this.data.range[e.detail.value])
      this.setData({
        show: showFun(this.data.dis[this.data.no])
      })
    } else {
      wx.showToast({
        title: '需要更多请联系作者！',
        icon: 'none',
        duration: 2000
      })
    }
  },
  // //顺序
  // funList: function (event) {
  //   let x = event.currentTarget.dataset.pid
  //   if (dis[no]['listRule'].length < 50) {
  //     dis[no]['listRule'].push(x)
  //     this.setData({
  //       show: showFun(dis[no])
  //     })
  //   } else {
  //     wx.showToast({
  //       title: '需要更多请联系作者！',
  //       icon: 'none',
  //       duration: 2000
  //     })
  //   }
  // },

  //清空or退格
  funBac: function (event) {
    let x = event.currentTarget.dataset.pid
    if (x) {
      this.data.dis[this.data.no]['listRule'] = []
    } else {
      this.data.dis[this.data.no]['listRule'].pop()
    }
    this.setData({
      show: showFun(this.data.dis[this.data.no])
    })
  },

  //输入框-显示or隐藏
  fun_Zii: function (event) {
    a = event.currentTarget.dataset.pid
    this.setData({
      zi: !this.data.zi
    })
  },

  //刷新数据
  bind_zii: function (x) {
    if (a[0] == 1) { //自定义 当前位置
      // if (dis[no]['listRule'].length < 50) {
      let dis = this.data.dis
      dis[this.data.no]['listRule'].push(x)
      this.setData({
        show: showFun(dis[this.data.no])
      })
      // } else {
      // 	wx.showToast({
      // 		title: '更多请联系作者！',
      // 		icon: 'none',
      // 		duration: 2000
      // 	})
      // }
    } else if (a[0] == 2) { //自定义 其他位置
      let dis = this.data.dis
      dis[this.data.no]['listRule'][a[1]] = x
      this.setData({
        show: showFun(dis[this.data.no])
      })
    } else if (a[0] == 3) { //规则名
      let dis = this.data.dis
      dis[this.data.no]['listName'] = x
      this.setData({
        dis: dis
      })
    }
  },

  //输入框失去焦点
  funZii: function (event) {
    this.setData({
      zi: !this.data.zi
    })
  },

  //输入完成
  bindconfirm: function (event) {
    let x = event.detail.value.trim() ? event.detail.value.trim().slice(0, 3) : '未命名'
    this.bind_zii(x)
  },

  //生效
  funQue: function () {
    const that = this
    wx.showModal({
      title: '确认生效？',
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
                dis: that.data.dis.filter(item => {
                  return item.listRule.length > 0
                })
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
  }
})