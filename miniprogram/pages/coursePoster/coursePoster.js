// miniprogram/pages/courseDetail/courseDetail.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    signUpButtonState: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

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
  toSignUp () {
    this.setData({
      signUpButtonState: !this.data.signUpButtonState
    })
  },
  closeSignUpForm () {
    let that = this
    wx.showModal({
      title: '温馨提示',
      content: '不填写验证码助教老师无法联系到您，会使您享受不到优质服务',
      cancelText: '狠心放弃',
      confirmText: '继续填写',
      confirmColor: '#192e4d',
      success(res) {
        if (res.confirm) {
          console.log('用户点击确定')
        } else if (res.cancel) {
          that.setData({
            signUpButtonState: true
          })
        }
      }
    })
  },
  getPhoneNumber (e) {
    console.log(e.detail.errMsg)
    console.log(e.detail.iv)
    console.log(e.detail.encryptedData)
  },
  handleContact (e) {
    console.log(e.detail.path)
    console.log(e.detail.query)
  }
})
