// courseLearn.js
// import createHanziWriterContext from 'hanzi-writer-miniprogram';
Page({
  data: {
    videoFullscreenState: false,
    courseSectionPublicData: null,
    video_schedule: null,
    lecturer: []
  },
  onShow: async function (options) {
    const eventChannel = this.getOpenerEventChannel()
    await eventChannel.on('getCourseData', async (res) => {
      const {courseSectionPublicData, video_schedule, lecturer, date} = res
      console.log('获取课程详情页面传来的数据',res)
      this.setData({
        courseSectionPublicData,
        video_schedule,
        lecturer,
        date
      })
    })
  },
  toHomeworkDetail: () => {
    wx.navigateTo({
      url: '../homeworkDetail/homeworkDetail',
      success: (res) => {
        res.eventChannel.emit('getHomeworkDetail', {
          id: this.data.coursePrivateData[homework_id]
        })
      }
    })
  },
  changeFullscreen: function () {
    this.setData({
      videoFullscreenState: !this.data.videoFullscreenState
    })
  },
  createVideo: function () {
    wx.createVideoContext('testV').play()
    wx.createVideoContext('testV').requestFullScreen()
  },
  videoEnd: function () {
    wx.createVideoContext('testV').exitFullScreen()
  }
})
