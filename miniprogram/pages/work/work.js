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

const colors = { //配色
  '休息': 'xiuxi',
  '全天': 'quantian',
  '白班': 'baiban',
  '夜班': 'yeban',
  '早班': 'zaoban',
  '中班': 'zhongban',
  '晚班': 'wanban',
  '大夜': 'daye',
  '小夜': 'xiaoye',
  '大白': 'dabai',
  '小白': 'xiaobai',
  '值班': 'zhiban',
}

//渲染
const showFun = function (x) {
  let d = x ? x['listDate'].split("/") : null
  let c = x ? x['listRule'].map(item => ({
    name: item,
    color: colors[item] ? colors[item] : 'zidingyi'
  })) : null
  return [d, c]
};

Page({
  data: {
    zi,
    no: no,
    dis: dis,
    show: []
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
          App.dis = dis = dis.filter(item => {
            return item.listRule.length > 0
          });
          App.no = 0;
          // App.shows = table_data(Localdate.year, dis)
          // wx.setStorageSync('no', App.no)
          // wx.setStorageSync('dis', App.dis)
          // wx.setStorageSync('shows', App.shows)
          wx.reLaunch({
            url: '/pages/index/index?id=1'
          })
          wx.cloud.callFunction({
            name: 'user',
            data: {
              dis: dis
            }
          })
        }
      }
    })
  }
})