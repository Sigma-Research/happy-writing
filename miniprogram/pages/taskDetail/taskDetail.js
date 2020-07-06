Page({
  data: {

  },
  onLoad (options) {

  },
  onReady () {

  },
  onShow () {

  },
  onHide () {

  },
  onUnload () {

  },
  onPullDownRefresh () {

  },
  onReachBottom () {

  },
  onShareAppMessage () {

  },
  showTips () {
    wx.showModal({
      title: '温馨提示',
      content: '1. 将写好的字帖平铺在桌子上\n2.拍照时保证手机和字帖平行\n',
    })
  },
  toMytask () {
    wx.navigateTo({
      url: '../myTask/myTask'
    })
  },
  uploadTask () {
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success (res) {
        // tempFilePath可以作为img标签的src属性显示图片
        const tempFilePaths = res.tempFilePaths
        wx.navigateTo({
          url: '../myTask/myTask'
        })
      }
    })
  }
})
