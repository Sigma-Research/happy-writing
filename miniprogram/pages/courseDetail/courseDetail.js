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
    this.refactorLecturerData()
  },
  onCommunication: async function () {
    const eventChannel = this.getOpenerEventChannel()
    await eventChannel.on('getCourseData', this.getCourseData)
  },
  getCourseData: function (e) {
    const courseData = e.courseData
    console.log('获取页面通信数据')
    this.setData({
      courseData
    })
    console.log(`设置课程课程数据为`, courseData)
  },
  refactorLecturerData: async function () {
    let course_lecturer = this.data.courseData.course_lecturer
    console.log('refactor')
    course_lecturer = await Promise.all(course_lecturer.map(async id => {
      const data = await this.getLecturerDataById(id)
      console.log(1)
      return data
    }))
    this.setData({
      courseData: Object.assign(this.data.courseData, {course_lecturer})
    })
    console.log(this.data.courseData)
  },
  getLecturerDataById: async function (id) {
    let data
    await db.collection('t_lecturer').doc(id).get().then(res => {
      data = res.data
      console.log(`查询得到id为${id}的讲师数据`, data)
    })
    return data
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
