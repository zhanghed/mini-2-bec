Page({

  data: {
    array: ['美国', '中国', '巴西', '日本'],
    no: 0,
    dis: [{
      listName: '',
      listDate: '',
      listRule: []
    }]
  },
  // 输入
  bindKeyInput: function (e) {
    console.log(e.detail.value)
  },
  // 日期
  bindDateChange: function (e) {
    console.log(e.detail.value)
  },
  // 规则
  bindPickerChange: function (e) {
    console.log(e.detail.value)
    // let dis = this.data.dis
    // dis[this.data.no].listRule.push(this.data.array[e.detail.value])
    // this.setData({
    //   dis: dis
    // })
  },

})