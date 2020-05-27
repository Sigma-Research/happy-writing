//course.js
const app = getApp()
const db = wx.cloud.database()

Page({
  data: {
    registeredCourse: [],   // 已报名课程数组列表
    unregisteredCourse: [], // 未报名课程数组列表
    userCourse: []          // 用户已报名课程的 ID 数组
  },
  // 显示页面时判断是否已存储用户信息，然后获取课程
  onShow: async function (options) {
    if (!app.globalData.userData) {
      console.log('全局中未存储用户信息')
      await app.getUserData()
    }
    this.getCourse()
  },
  onReady: function () {
  },
  // 获取用户已报名课程的 ID 数组
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
        else unregisteredCourse.push(course)
      })
      this.setData({
        registeredCourse,
        unregisteredCourse
      })
      console.log('得到 registeredCourse 列表', registeredCourse)
      console.log('得到 unregisteredCourse 列表', unregisteredCourse)
    })
  },
  // 跳转课程详情页
  toCourseDetail: function(e) {
    const that = this
    wx.navigateTo({
      url: '../courseDetail/courseDetail',
      success(res) {
        console.log(that.data.registeredCourse[e.currentTarget.dataset.index])
        res.eventChannel.emit('getCourseData', {
          data: that.data.registeredCourse[e.currentTarget.dataset.index]
        })
      }
    })
  },
  // 跳转课程海报页
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
