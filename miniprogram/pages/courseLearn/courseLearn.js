// courseLearn.js
// import createHanziWriterContext from 'hanzi-writer-miniprogram';
Page({
  data: {
    videoFullscreenState: false
  },
  onLoad: function (options) {
    const eventChannel = this.getOpenerEventChannel()
    eventChannel.on('getCourseData', (res) => {
      console.log(res.data)
    })
    // this.writerCtx1 = createHanziWriterContext({
    //   id: 'hz-writer1',
    //   character: '你',
    //   page: this,
    //   renderer: 'canvas'
    // });
    // this.writerCtx2 = createHanziWriterContext({
    //   id: 'hz-writer2',
    //   character: '好',
    //   page: this,
    // });
    // this.writerCtx3 = createHanziWriterContext({
    //   id: 'hz-writer3',
    //   character: '啊',
    //   page: this,
    // });
    // this.writerCtx4 = createHanziWriterContext({
    //   id: 'hz-writer4',
    //   character: '啊',
    //   page: this,
    // });
    // this.writerCtx5 = createHanziWriterContext({
    //   id: 'hz-writer5',
    //   character: '啊',
    //   page: this,
    // });
    // this.writerCtx6 = createHanziWriterContext({
    //   id: 'hz-writer6',
    //   character: '啊',
    //   page: this,
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
      url: '../homeworkDetail/homeworkDetail'
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
