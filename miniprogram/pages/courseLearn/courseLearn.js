// courseLearn.js
// import createHanziWriterContext from 'hanzi-writer-miniprogram';
Page({
  data: {
    videoFullscreenState: false,
    coursePublicData: null,
    coursePrivateData: null,
    index: null
  },
  onLoad: function (options) {
    const eventChannel = this.getOpenerEventChannel()
    eventChannel.on('getCourseData', (res) => {
      const [coursePublicData, coursePrivateData, index] = res.data
      this.setData({
        coursePublicData,
        coursePrivateData,
        index
      })
    })
    // this.writerCtx1 = createHanziWriterContext({
    //   id: 'hz-writer1',
    //   character: '你',
    //   page: this,
    //   renderer: 'canvas'
    // });
  },
  onReady: function () {
  },
  onShow: function () {
    // You can call any normal HanziWriter method here
    // this.writerCtx1.loopCharacterAnimation();
  },
  onHide: function () {
  },
  onUnload: function () {
  },
  onPullDownRefresh: function () {
  },
  onReachBottom: function () {
  },
  onShareAppMessage: function () {
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
