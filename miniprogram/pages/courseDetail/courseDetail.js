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
  onShow: async function (options) {
    const eventChannel = this.getOpenerEventChannel()
    await eventChannel.on('getCourseData', async (res) => {
      const coursePublicData = res.data
      console.log(res)
      const coursePrivateData = app.globalData.userData.course[coursePublicData._id]
      await db.collection('t_lecturer').where({
        _id: coursePublicData.course_lecturer[0]
      }).get().then(res => {
        coursePublicData.course_lecturer[0] = res.data[0].lecturer_name
      })
      await db.collection('t_lecturer').where({
        _id: coursePublicData.course_lecturer[1]
      }).get().then(res => {
        coursePublicData.course_lecturer[1] = res.data[0].lecturer_name
      })
      this.setData({
        coursePublicData,
        coursePrivateData
      })
      console.log('获取课程公共数据', this.data.coursePublicData)
      console.log('获取课程个人数据', this.data.coursePrivateData)
    })
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
