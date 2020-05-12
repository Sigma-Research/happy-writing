// miniprogram/pages/courseLearn/courseLearn.js
import createHanziWriterContext from 'hanzi-writer-miniprogram';
Page({

  /**
   * 页面的初始数据
   */
  data: {
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.writerCtx1 = createHanziWriterContext({
      id: 'hz-writer1',
      character: '你',
      page: this,
    });
    this.writerCtx2 = createHanziWriterContext({
      id: 'hz-writer2',
      character: '好',
      page: this,
    });
    this.writerCtx3 = createHanziWriterContext({
      id: 'hz-writer3',
      character: '啊',
      page: this,
    });
    this.writerCtx4 = createHanziWriterContext({
      id: 'hz-writer4',
      character: '啊',
      page: this,
    });
    this.writerCtx5 = createHanziWriterContext({
      id: 'hz-writer5',
      character: '啊',
      page: this,
    });
    this.writerCtx6 = createHanziWriterContext({
      id: 'hz-writer6',
      character: '啊',
      page: this,
    });


    // You can call any normal HanziWriter method here
    this.writerCtx1.loopCharacterAnimation();
    this.writerCtx2.loopCharacterAnimation();

    this.writerCtx3.loopCharacterAnimation();
    this.writerCtx4.loopCharacterAnimation();
    this.writerCtx5.loopCharacterAnimation();

    this.writerCtx6.loopCharacterAnimation();

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    // 使用 wx.createAudioContext 获取 audio 上下文 context
    this.audioCtx = wx.createAudioContext('myAudio')
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

  toHomeworkDetail: () => {
    wx.navigateTo({
      url: '../homeworkDetail/homeworkDetail'
    })
  }
})
