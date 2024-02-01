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
    let arr = []
    // !--__--! 统计每个月的记录条数
    for (let key in sss) {
      const date = key.split("z")
      const y = String(date[0])
      const m = String(date[1])
      let ty = arr.find(i => i.year === y)
      if (ty) {
        let tm = ty.arr.find(i => i.month === m)
        if (tm) {
          tm.count += 1
        } else {
          ty.arr.push({
            month: m,
            count: 1
          })
        }
      } else {
        arr.push({
          year: y,
          arr: [{
            month: m,
            count: 1
          }]
        })
      }
    }
    this.setData({
      arr: arr
    })
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