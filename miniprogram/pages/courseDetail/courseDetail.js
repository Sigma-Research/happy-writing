// courseDetail.js
const app = getApp()
const db = wx.cloud.database()

Page({
  data: {
    disableShowModelState: false,
    disableShowModelData: null,
    courseData: null
  },
  onShow: async function (options) {
    await this.onCommunication()
    console.log(this.data.courseData)
  },
  onCommunication: async function () {
    const eventChannel = this.getOpenerEventChannel()
    await eventChannel.on('getCourseData', this.getCourseData)
  },
  getCourseData: function (e) {
    const courseData = e.courseId
    console.log('获取页面通信数据')
    this.setData({
      courseData
    })
    console.log(`设置课程课程数据为`, courseData)
  },
  toCourseLearn: function (e) {
    // const index = e.currentTarget.dataset.index
    // const coursePublicData = this.data.coursePublicData
    // const coursePrivateData = this.data.coursePrivateData
    // const lecturer = coursePublicData.course_lecturer
    // const courseSectionPublicData = coursePublicData.course_section[index]
    // const video_schedule = coursePrivateData.video_schedule[index]
    // const date = coursePrivateData.course_date
    wx.navigateTo({
      url: '../courseLearn/courseLearn',
      success: (res) => {
        res.eventChannel.emit('getCourseData', {
          // courseSectionPublicData,
          // video_schedule,
          // lecturer,
          // date
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
