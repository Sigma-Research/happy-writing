// miniprogram/pages/courseDetail/courseDetail.js
Page({
  data: {
    formShowModelState: false,
    tipsShowModelState: false,
    tipsShowModelData: null,
    formShowModelData: null,
    getCodeButtonState: false
  },
  onLoad: function (options) {

  },
  onReady: function () {

  },
  onShow: function () {

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
  toForm (e) {
    this.setData({
      formShowModelState: true,
      formShowModelData: {
        type: 'single',
        title: '确认手机号',
        content: '',
        confirmText: '完成报名'
      }
    })
  },
  toTips () {
    console.log(1)
    this.setData({
      formShowModelState: false,
      tipsShowModelState: true,
      tipsShowModelData: {
        type: 'double',
        title: '温馨提示',
        content: '不确认手机号助教老师无法联系到您，导致享受不到优质助教服务',
        cancelText: '狠心放弃',
        confirmText: '继续填写'
      }
    })
  },
  closeForm () {
    this.setData({
      formShowModelState: false,
      tipsShowModelState: false,
    })
  },
  continueForm () {
    this.setData({
      formShowModelState: true,
      tipsShowModelState: false,
    })
  },
  getVerificationCode () {
    if (this.data.getCodeButtonState) {

    }
  },
  inputEdit (e) {
    const regExp = /^[1](([3][0-9])|([4][5-9])|([5][0-3,5-9])|([6][5,6])|([7][0-8])|([8][0-9])|([9][1,8,9]))[0-9]{8}$/
    this.setData({
      getCodeButtonState: regExp.test(e.detail.value)
    })
  }
})
