//index.js
const app = getApp()

Page({
  data: {
    userInfo: {},
    logged: false,
    takeSession: false,
    requestResult: ''
  },

  onLoad: function() {

  },

  toCoursePoster: () => {
    wx.navigateTo({
      url: '../coursePoster/coursePoster'
    })
  },
})
