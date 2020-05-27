//index.js
const app = getApp()
const db = wx.cloud.database()

Page({
  data: {
    homeworkListCount: 0,
    homeworkList: [],
    recommendCourse: null,
  },
  onLoad: async function () {
    // this.getRecommendCourse()
    // this.getHomeworkList()
  },

  onShow: function () {
  },
  // 插入用户表
  insertUser: async function () {
    // 判断用户是否已存在
    db.collection('t_user').where({
      _openid: app.globalData.openid
    }).count().then(async res => {
      if (!res.total) {
        console.log('用户不存在')
        // 不存在创建用户信息
        await db.collection('t_user').add({
          data: {
            create_date: new Date().toLocaleDateString(),
            course: {},
            tel: null,
            nickname: null,
            info: {}
          }
        })
      } else console.log('用户存在')
      // 用户信息存入全局
      await app.getUserData()
    })
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
        recommendCourse: res.data[0]
      })
      console.log('获取推荐课程数据: ',this.data.recommendCourse)
    })
  },
  // 监听上拉事件
  onReachBottom: function () {
    this.getHomeworkList()
  },
  // 跳转课程海报页
  toCoursePoster: function() {
    wx.navigateTo({
      url: '../coursePoster/coursePoster',
      success: (res) => {
        res.eventChannel.emit('getCourseData', {
          data: this.data.recommendCourse
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
