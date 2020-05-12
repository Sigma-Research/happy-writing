// miniprogram/pages/courseDetail/courseDetail.js
Page({
  data: {
    disableShowModelState: false,
    disableShowModelData: null
  },
  onLoad: function (options) {

  },
  onReady: function () {

  },
  onShow: function () {

  },
  onHide: function () {

  },
  onUnload: function () {

  },
  onPullDownRefresh: function () {

  },
  onReachBottom: function () {

  },
  onShareAppMessage: function () {

  },
  toCourseLearn: () => {
    wx.navigateTo({
      url: '../courseLearn/courseLearn'
    })
  },
  learnDisable() {
    this.setData({
      disableShowModelState: true,
      disableShowModelData: {
        type: 'single',
        title: '温馨提示',
        content: '完成上一节课程的学习才能继续本节课成的学习',
        confirmText: '知道了'
      }
    })
  },
  hiddenDisableShowModel () {
    this.setData({
      disableShowModelState: false
    })
  }
})
