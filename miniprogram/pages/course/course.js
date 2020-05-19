//course.js
const app = getApp()
const db = wx.cloud.database()

Page({
  data: {
    registeredCourse: [],
    unregisteredCourse: [],
    userCourse: []
  },
  onLoad: function (options) {
    this.getCourse()
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
  // 获取用户已报名课程 ID 列表
  getUserCourse: async function () {
    await db.collection('t_user').where({
      _openid: app.globalData.openid
    }).get().then(res => {
      const userCourse = []
      res.data[0].map(obj => {
        userCourse.push(obj.course_id)
      })
      this.setData({
        userCourse
      })
    })
  },
  // 获取课程并根据是否报名分类
  getCourse: function () {
    this.getUserCourse()
    db.collection('t_course').get().then(res => {
      const registeredCourse = []
      const unregisteredCourse = []
      res.data.map(course => {
        if (this.data.userCourse.includes(course._id)) registeredCourse.push(course)
        unregisteredCourse.push(course)
      })
      this.setData({
        registeredCourse,
        unregisteredCourse
      })
    })
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
