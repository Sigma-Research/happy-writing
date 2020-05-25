//course.js
const app = getApp()
const db = wx.cloud.database()

Page({
  data: {
    registeredCourse: [],
    unregisteredCourse: [],
    userCourse: []
  },
  onLoad: async function (options) {
    if (!app.globalData.userData) {
      console.log('全局中未存储用户信息')
      await app.getUserData()
    }
    this.getCourse()
  },
  onReady: function () {
  },
  // 获取用户已报名课程 ID 列表
  getUserCourse: function () {
    const userCourse = Object.keys(app.globalData.userData.course)
    console.log('获取用户已报名课程ID数组', userCourse)
    this.setData({
      userCourse
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
      console.log('得到 registeredCourse 列表', registeredCourse)
      console.log('得到 unregisteredCourse 列表', unregisteredCourse)
    })
  },
  toCourseDetail: (index) => {
    wx.navigateTo({
      url: '../courseDetail/courseDetail',
      success: (res) => {
        res.eventChannel.emit('getCourseData', {
          data: this.data.registeredCourse[index]
        })
      }
    })
  },
  // 跳转课程海报页面(课程信息)
  toCoursePoster: function (e) {
    const that = this
    wx.navigateTo({
      url: '../coursePoster/coursePoster',
      success(res) {
        res.eventChannel.emit('getCourseData', {
          data: that.data.unregisteredCourse[e.currentTarget.dataset.index]
        })
      }
    })
  }
})
