// homeworkDetail.js
const app = getApp()
const db = wx.cloud.database()

Page({
  data: {

  },
  onLoad: function (options) {
    const eventChannel = this.getOpenerEventChannel()
    eventChannel.on('getHomeworkDetail', (res) => {
      db.collection('t_homework').where({
        _id: res.id
      }).get().then(res => {

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
  test() {
    wx.chooseImage({
      count: 9,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success (res) {
      }
    })
  }
})
