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
Page({

  /**
   * 页面的初始数据
   */
  data: {

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
  toOut: function (x) {
    wx.navigateTo({
      url: '/pages/one_six_six/one_six_six',
    })
  },
  // 同步数据
  sync_data: function () {
    console.log('同步数据');
    wx.showLoading({
      title: '加载中',
      mask: true
    });
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
        wx.reLaunch({
          url: '/pages/index/index'
        })
      })()
    })()
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  // onShareAppMessage: function () {

  // }
})