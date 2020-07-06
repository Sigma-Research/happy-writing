Page({
  data: {
    tab: 'revise'
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
  changeTab (e) {
    this.setData({
      tab: e.currentTarget.dataset.tab
    })
  },
  toRevisalDetail () {
    wx.navigateTo({
      url: '../revisalDetail/revisalDetail'
    })
  }
})
