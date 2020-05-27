//course.js
const app = getApp()
const db = wx.cloud.database()

Page({
  data: {
    allCourseData: null,
    userCourseData: null,
    learningCourseData: [],
    unregisteredCourseData: [], // 未报名课程数组列表
    expiredCourseData: [],  //
  },
  //
  onShow: async function (options) {
    if (!app.globalData.userData){
      app.eventHub.on('userDataInitSuccess', this.init)
    } else this.init()
  },
  init: async function () {
    await this.getAllCourseData()
    this.getUserCourseData()
    this.refactorAllCourseData()
  },
  onReady: function () {
  },
  getAllCourseData: async function () {
    await db.collection('t_course').get().then(res => {
      const allCourseData = res.data
      this.setData({
        allCourseData
      })
      console.log('查询所有课程数据并存入allCourseData',this.data.allCourseData)
    })
  },
  getUserCourseData: function () {
    const userCourseData = app.globalData.userData.course
    this.setData({
      userCourseData
    })
    console.log('userCourseData',this.data.userCourseData)
  },
  DateMinus: function (createDate) {
    const date = new Date()
    return parseInt((date.getTime() - createDate.getTime()) / (1000 * 60 * 60 * 24))
  },
  refactorAllCourseData: function () {
    const unregisteredCourseData = []
    let learningCourseData = []
    const expiredCourseData = []
    this.data.allCourseData.map((course)=>{
      if (!this.data.userCourseData.hasOwnProperty(course._id)) unregisteredCourseData.push(course)
      else {
        if (this.DateMinus(this.userCourseData[course._id].create_date) >= course.course_duration )
          expiredCourseData.push(course)
        else learningCourseData.push(course)
      }
    })
    learningCourseData = learningCourseData.map(course => {
      return course.course_section.map((section, index) => {
        return Object.assign(section, this.data.userCourseData[course._id].course_section[index])
      })
    })
    this.setData({
      unregisteredCourseData,
      learningCourseData,
      expiredCourseData
    })
    console.log('重构unregisteredCourseData',unregisteredCourseData)
    console.log('重构learningCourseData',learningCourseData)
    console.log('重构expiredCourseData',expiredCourseData)
  },

  // 跳转课程详情页
  toCourseDetail: function(e) {
    const learningCourseData = this.data.learningCourseData[e.currentTarget.dataset.index]
    wx.navigateTo({
      url: '../courseDetail/courseDetail',
      success(res) {
        console.log('向课程详情页面传递课程数据',learningCourseData)
        res.eventChannel.emit('getLearningCourseData', {
          learningCourseData
        })
      }
    })
  },
  // 跳转课程海报页
  toCoursePoster: function (e) {
    const courseId = this.data.unregisteredCourseData[e.currentTarget.dataset.index]._id
    wx.navigateTo({
      url: '../coursePoster/coursePoster',
      success(res) {
        res.eventChannel.emit('getCourseId', {
          courseId
        })
      }
    })
  },
  // 跳转已完结课程页
  toCourseExpiredList: function () {
    const expiredCourseData = this.data.expiredCourseData
    wx.navigateTo({
      url: '../courseExpiredList/courseExpiredList',
      success(res) {
        res.eventChannel.emit('getExpiredCourseData', {
          expiredCourseData
        })
      }
    })
  }
})
