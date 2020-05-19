// courseDetail.js
const app = getApp()
const db = wx.cloud.database()

Page({
  data: {
    disableShowModelState: false,
    disableShowModelData: null,
    coursePublicData: null,
    coursePrivateData: null,
  },
  onLoad: function (options) {
    const eventChannel = this.getOpenerEventChannel()
    eventChannel.on('getCourseData', (res) => {
      const coursePublicData = res.data
      db.collection('t_user').where({
        _openid: app.globalData.openid
      }).get().then(res => {
        const coursePrivateData = res.data[0].course[coursePublicData._id]
        this.setData({
          coursePublicData,
          coursePrivateData
        })
      })
    })
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
  toCourseLearn: (index) => {
    wx.navigateTo({
      url: '../courseLearn/courseLearn',
      success: (res) => {
        res.eventChannel.emit('getCourseData', {
          coursePrivateData: this.data.coursePrivateData,
          coursePublicData: this.data.coursePublicData,
          index
        })
      }
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
