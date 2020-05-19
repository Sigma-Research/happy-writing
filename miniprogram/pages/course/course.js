// miniprogram/pages/course/course.js
Page({
  data: {

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
  toCourseDetail: () => {
    wx.navigateTo({
      url: '../courseDetail/courseDetail'
    })
  },
  toCoursePoster: () => {
    wx.navigateTo({
      url: '../coursePoster/coursePoster'
    })
  }
})
