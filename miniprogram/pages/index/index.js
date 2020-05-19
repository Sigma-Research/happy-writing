//index.js
const app = getApp()
const db = wx.cloud.database()

Page({
  data: {
    userInfo: {},
    logged: false,
    takeSession: false,
    requestResult: '',
    homeworkListIndex: 0,
    homeworkList: [],
    recommendCourse: null,
  },
  onLoad: function () {
    this.onGetOpenid(this.insertUser)
    this.getRecommendCourse()
  },
  //插入用户表
  insertUser: () => {
    //判断用户是否已存在
    db.collection('t_user').where({
      _openid: app.globalData.openid
    }).count().then(res => {
      if (!res.total) {
        db.collection('t_user').add({
          data: {
            create_date: new Date().toLocaleDateString()
          }
        })
      }
    })
  },
  // 调用云函数获取用户 openID
  onGetOpenid: (callback) => {
    wx.cloud.callFunction({
      name: 'login',
      data: {},
      success: res => {
        console.log('[云函数] [login] user openid: ', res.result.openid)
        app.globalData.openid = res.result.openid
        callback()
      },
      fail: err => {
        console.error('[云函数] [login] 调用失败', err)
      }
    })
  },
  // 获取作业广场数据
  getHomeworkList: function (callback) {
    db.collection('t_homework')
        .limit(10)
        .skip(this.data.homeworkListIndex)
        .get()
        .then(res => {
          this.setData({
            homeworkListIndex: this.data.homeworkListIndex + 10,
            homeworkList: [...this.data.homeworkList, ...res.data]
          })
          console.log(this.data.homeworkList)
        })
  },
  // 获取推荐课程数据
  getRecommendCourse: function () {
    db.collection('t_course').where({
      recommend: true
    }).get().then(res => {
      this.setData({
        recommendCourse: res.data[0]
      })
    })
  },
  // 监听上拉事件
  onReachBottom: function () {
    this.getHomeworkList()
  },
  toCoursePoster: function() {
    wx.navigateTo({
      url: '../coursePoster/coursePoster',
      success: (res) => {
        res.eventChannel.emit('getRecommendCourseData', {
          data: this.data.recommendCourse
        })
      }
    })
  },
  toHomeworkDetail: () => {
    wx.navigateTo({
      url: '../homeworkDetail/homeworkDetail'
    })
  },
})
