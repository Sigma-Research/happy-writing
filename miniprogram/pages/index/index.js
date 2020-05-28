//index.js
const app = getApp()
const db = wx.cloud.database()

Page({
  data: {
    homeworkListCount: 0,
    homeworkList: [],
    recommendCourse: null,
  },
  onShow: function () {
    if (!app.globalData.userData){
      app.eventHub.on('userDataInitSuccess', this.init)
    } else{
      this.init()
    }
  },
  init: function () {
    this.getRecommendCourse()
  },
  // 获取作业广场数据
  getHomeworkList: function () {
    db.collection('t_homework')
        .limit(10)
        .skip(this.data.homeworkListCount)
        .get()
        .then(res => {
          this.setData({
            homeworkListCount: this.data.homeworkListCount + 10,
            homeworkList: [...this.data.homeworkList, ...res.data]
          })
          console.log('获取作业广场数据: ',this.data.homeworkList)
        })
  },
  // 获取推荐课程数据
  getRecommendCourse: function () {
    db.collection('t_course').where({
      recommend: true
    }).get().then(res => {
      this.setData({
        recommendCourse: res.data[0]._id
      })
      console.log('获取推荐课程数据: ',this.data.recommendCourse)
    })
  },
  // 监听上拉事件
  onReachBottom: function () {
    this.getHomeworkList()
  },
  // 跳转课程海报页
  toCoursePoster: function (e) {
    const courseId = this.data.recommendCourse
    wx.navigateTo({
      url: '../coursePoster/coursePoster',
      success(res) {
        console.log('向课程海报页面传递课程ID', courseId)
        res.eventChannel.emit('getCourseId', {
          courseId
        })
      }
    })
  },
  // 跳转课程详情页g
  toHomeworkDetail: () => {
    wx.navigateTo({
      url: '../homeworkDetail/homeworkDetail'
    })
  },
})
