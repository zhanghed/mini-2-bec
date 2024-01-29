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
//局部变量
let zi = false //显示隐藏输入框
let a = '' //输入框状态
let no = 0 //规则序号
let dis = [] //规则集

// const colors = { //配色
//   '休息': 'xiuxi',
//   '全天': 'quantian',
//   '白班': 'baiban',
//   '夜班': '',
//   '早班': '',
//   '中班': '',
//   '晚班': '',
//   '大夜': '',
//   '小夜': '',
//   '大白': '',
//   '小白': '',
//   '值班': '',
// }
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

//渲染
const showFun = function (x) {
  let d = x ? x['listDate'].split("/") : null
  let c = x ? x['listRule'].map(item => {
    let temp = colors.find(i => i.name === item)
    return temp || {
      name: item,
      color: 'zidingyi'
    }
  }) : null
  return [d, c]
};

Page({
  data: {
    zi,
    no: no,
    dis: dis,
    show: [],
    range: colors.map(i => i.name) //规则选择器使用
  },

  // 加载
  onLoad: function (options) {
    no = 0
    dis = App.dis.length > 0 ? JSON.parse(JSON.stringify(App.dis)) : []
    this.setData({
      no: no,
      dis: dis,
      show: showFun(dis[no])
    })
  },

  //添加标签
  funTian: function (event) {
    if (dis.length < 5) {
      dis.push({
        listName: '未命名',
        listDate: Localdate.year + '/' + Localdate.month + '/' + Localdate.day,
        listRule: []
      })
      no = dis.length - 1
      this.setData({
        no: no,
        dis: dis,
        show: showFun(dis[no]),
      })
    } else {
      wx.showToast({
        title: '需要更多请联系作者！',
        icon: 'none',
        duration: 2000
      })
    }
  },

  //选择标签
  funPa: function (event) {
    no = Number(event.currentTarget.dataset.pid)
    this.setData({
      no: no,
      show: showFun(dis[no])
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
          dis.splice(x, 1)
          no = dis[x] || x == 0 ? x : x - 1
          that.setData({
            no: no,
            dis: dis,
            show: showFun(dis[no]),
          })
        }
      }
    })
  },

  //选择时间
  funDate: function (event) {
    let x = event.detail.value.split('-')
    dis[no]['listDate'] = Number(x[0]) + '/' + Number(x[1]) + '/' + Number(x[2])
    this.setData({
      show: showFun(dis[no])
    })
  },
  // 规则选择器
  bindPickerChange: function (e) {
    console.log(e.detail.value)
  },
  //顺序
  funList: function (event) {
    let x = event.currentTarget.dataset.pid
    if (dis[no]['listRule'].length < 50) {
      dis[no]['listRule'].push(x)
      this.setData({
        show: showFun(dis[no])
      })
    } else {
      wx.showToast({
        title: '需要更多请联系作者！',
        icon: 'none',
        duration: 2000
      })
    }
  },

  //清空or退格
  funBac: function (event) {
    let x = event.currentTarget.dataset.pid
    if (x) {
      dis[no]['listRule'] = []
    } else {
      dis[no]['listRule'].pop()
    }
    this.setData({
      show: showFun(dis[no])
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
    if (a[0] == 1) { //自定义按钮
      if (dis[no]['listRule'].length < 31) {
        dis[no]['listRule'].push(x)
        this.setData({
          show: showFun(dis[no])
        })
      } else {
        wx.showToast({
          title: '更多请联系作者！',
          icon: 'none',
          duration: 2000
        })
      }
    } else if (a[0] == 2) { //自定义彩格
      dis[no]['listRule'][a[1]] = x
      this.setData({
        show: showFun(dis[no])
      })
    } else if (a[0] == 3) { //规则名
      dis[no]['listName'] = x
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
                dis: dis.filter(item => {
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