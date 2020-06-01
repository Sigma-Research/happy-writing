// courseDetail.js
const app = getApp()
const db = wx.cloud.database()

Page({
  data: {
    disableShowModelState: false,
    disableShowModelData: null,
    courseData: null,
    startDate: null,
    endDate: null
  },
  onShow: async function (options) {
    await this.onCommunication()
    this.refactorDate()
    await this.refactorLecturerData()
  },
  // 页面传递数据
  onCommunication: async function () {
    const eventChannel = this.getOpenerEventChannel()
    await eventChannel.on('getCourseData', this.getCourseData)
    app.eventHub.on('updateCourseLearnData', this.getCourseData)
  },
  // 获取课程数据
  getCourseData: function (e) {
    const {courseData} = e
    console.log('获取页面通信数据')
    this.setData({
      courseData
    })
    console.log(`设置课程数据为`, courseData)
  },
  // 重构课程日期
  refactorDate: function () {
    const startDate = this.data.courseData.create_date.toLocaleDateString()
    const endDate = this.addDurationAndDateToString(this.data.courseData.create_date, parseInt(this.data.courseData.course_duration))
    this.setData({
      startDate,
      endDate
    })
  },
  // 重构讲师信息
  refactorLecturerData: async function () {
    let course_lecturer = this.data.courseData.course_lecturer
    course_lecturer = await Promise.all(course_lecturer.map(async id => {
      const data = await this.getLecturerDataById(id)
      return data
    }))
    this.setData({
      courseData: Object.assign(this.data.courseData, {course_lecturer})
    })
    console.log('重构讲师数据', course_lecturer)
  },
  // 查询讲师信息
  getLecturerDataById: async function (id) {
    let data
    await db.collection('t_lecturer').doc(id).get().then(res => {
      data = res.data
      console.log(`查询得到id为${id}的讲师数据`, data)
    })
    return data
  },
  // 跳转课程学习页面
  toCourseLearn: function (e) {
    const courseData = this.data.courseData
    const index = e.currentTarget.dataset.index
    wx.navigateTo({
      url: '../courseLearn/courseLearn',
      success: (res) => {
        res.eventChannel.emit('getCourseLearnData', {
          courseData,
          index
        })
      }
    })
  },
  // 显示提示组件
  showTips() {
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
  // 隐藏提示组件
  hiddenDisableShowModel () {
    this.setData({
      disableShowModelState: false
    })
  },
  // 返回格式化后的增加天数的日期
  addDurationAndDateToString: function (date, day) {
    const newdate = new Date(date.valueOf())
    return new Date(newdate.setDate(newdate.getDate() + day)).toLocaleDateString()
  }
})
