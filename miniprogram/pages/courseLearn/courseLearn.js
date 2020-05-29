// courseLearn.js
const app = getApp()
const db = wx.cloud.database()
const videoContext = wx.createVideoContext('fakeVideo')
Page({
  data: {
    videoFullscreenState: false,
    courseData: null,
    index: null,
    courseAllDuration: null,
    startDate: null,
    endDate: null,
    watchedVideoCount: null,
    homeworkState: null,
    videoUrl: null,
    showFakeVideo: 'none',
    videoIndex: null
  },
  onShow: async function (options) {
    await this.onCommunication()
    this.getCourseAllDuration()
    this.refactorDate()
    this.getWatchedVideoCount()
    await this.getHomeworkState()
  },
  onUnload: function () {
    const {courseData} = this.data
    app.eventHub.emit('updateCourseLearnData', {
      courseData,
    })
  },
  // 获取传递数据
  onCommunication: async function () {
    const eventChannel = this.getOpenerEventChannel()
    console.log('获取页面通信数据')
    await eventChannel.on('getCourseLearnData', this.getCourseLearnData)
  },
  // 获取课程数据
  getCourseLearnData: function (e) {
    const {courseData, index} = e
    this.setData({
      courseData,
      index
    })
    console.log(`设置课程数据为`, courseData)
    console.log(`设置课程索引为`, index)
  },
  // 获取课程视频总时长
  getCourseAllDuration: function () {
    let courseAllDuration = 0
    this.data.courseData.course_section[this.data.index].video.forEach(video => {
      courseAllDuration += video.duration - 0
    })
    this.setData({
      courseAllDuration
    })
    console.log('获取课程视频总时长',courseAllDuration)
  },
  // 重构课程日期
  refactorDate: function () {
    const courseData = this.data.courseData
    const startDate = this.addDurationAndDateToString(courseData.create_date, 0)
    const endDate = this.addDurationAndDateToString(courseData.create_date, parseInt(courseData.course_duration))
    this.setData({
      startDate,
      endDate
    })
    console.log('重构课程日期', startDate, endDate)
  },
  // 获取已读视频个数
  getWatchedVideoCount: function () {
    let watchedVideoCount = 0
    this.data.courseData.course_section[this.data.index].video_schedule.forEach(function (item) {
      watchedVideoCount += item ? 1 : 0
    })
    this.setData({
      watchedVideoCount
    })
    console.log('获取已读视频个数', watchedVideoCount)
  },
  // 获取作业状态
  getHomeworkState: async function () {
    const homeworkId = this.data.courseData.course_section[this.data.index].homework_id
    let homeworkState = null
    if (homeworkId){
      await db.collection('t_homework').doc(homeworkId).get().then(res => {
        homeworkState = res.data.state
        console.log(`查询得到id为${id}的作业数据`)
      })
    }
    this.setData({
      homeworkState
    })
    console.log('获取作业状态', homeworkState)
  },
  // 播放视频
  playVideo: function (e) {
    const videoContext = wx.createVideoContext('fakeVideo')
    const videoUrl = e.currentTarget.dataset.url
    const videoIndex = e.currentTarget.dataset.index
    this.setData({
      videoUrl,
      videoIndex
    })
    videoContext.requestFullScreen()
    videoContext.play()
  },
  toHomeworkDetail: function () {
    const homework_id = this.data.courseData.course_section[this.data.index].homework_id
    const course_id = this.data.courseData._id
    const index = this.data.index
    wx.navigateTo({
      url: '../homeworkDetail/homeworkDetail',
      success: (res) => {
        res.eventChannel.emit('getHomeworkDetail', {
          homework_id,
          course_id,
          index
        })
      }
    })
  },
  // 播放完成
  finishPlay: function () {
    console.log('播放完成')
    wx.createVideoContext('fakeVideo').exitFullScreen()
    const courseData = this.data.courseData
    courseData.course_section[this.data.index].video_schedule[this.data.videoIndex] = true
    if (this.data.watchedVideoCount == courseData.course_section[this.data.index].video.length)
      courseData.course_schedule = this.data.index + 1
    app.globalData.userData.course[courseData._id].course_schedule = courseData.course_schedule

    app.globalData.userData.course[courseData._id].course_section[this.data.index].video_schedule[this.data.videoIndex] = true
    app.updateUserData()
  },
  // 返回格式化后的增加天数的日期
  addDurationAndDateToString: function (date, day) {
    return new Date(date.setDate(date.getDate() + day)).toLocaleDateString()
  }
})
