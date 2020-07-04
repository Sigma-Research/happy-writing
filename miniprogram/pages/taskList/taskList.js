Page({
  data: {
    taskList: [
      {
        time: '7月6日 星期五',
        title: '字帖练习任务1',
        state: '正在进行',
      },
      {
        time: '7月7日 星期六',
        title: '字帖练习任务2',
        state: '正在进行',
      },
      {
        time: '7月8日 星期一',
        title: '字帖练习任务3',
        state: '正在进行',
      }
    ]
  },
  onLoad (options) {

  },
  onReady () {

  },
  onShow () {

  },
  onHide () {

  },
  onUnload () {

  },
  onPullDownRefresh () {

  },
  onReachBottom () {

  },
  onShareAppMessage () {

  },
  toLogin () {
    wx.navigateTo({
      url: '../login/login'
    })
  }
})
