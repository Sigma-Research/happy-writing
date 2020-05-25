// miniprogram/pages/courseDetail/courseDetail.js
const app = getApp()
const db = wx.cloud.database()

Page({
  data: {
    formShowModelState: false,
    tipsShowModelState: false,
    tipsShowModelData: null,
    formShowModelData: null,
    getCodeButtonState: false,
    cellphoneValue: null,
    verificationCodePlaceholder: '验证码',
    verificationButtonValue: '获取验证码',
    verified: false,
    coursePublicData: null,
    coursePrivateData: null,
    registerState: undefined
  },
  onLoad: async function (options) {
    if (!app.globalData.userData) {
      console.log('全局中未存储用户信息')
      await app.getUserData()
    }
    await this.onGetCourseData()
    this.getRegisterState()
  },
  onReady: function () {

  },
  onShow: function () {

  },
  //监听 getCourseData | 触发设置页面的课程公共数据
  onGetCourseData: async function () {
    const eventChannel = this.getOpenerEventChannel()
    await eventChannel.on('getCourseData', this.setCoursePublicData)
  },
  //设置页面的课程公共数据
  setCoursePublicData: function (res) {
    this.setData({
      coursePublicData: res.data
    })
    console.log('触发 getCourseData()')
    console.log('页面课程公共数据:', res.data)
  },
  //设置页面的课程报名状态
  getRegisterState: function () {
    this.setData({
      registerState: this.data.coursePublicData._id in app.globalData.userData.course
    })
    console.log('课程报名状态:', this.data.registerState)
  },
  //获取用户手机号
  getPhoneNumber: async function (e) {
    await wx.cloud.callFunction({
      name: 'getPhoneNumber',
      data: {
        phoneNumber: wx.cloud.CloudID(e.detail.cloudID)
      }
    }).then(res => {
      console.log('获取用户手机号：',res.result.event.phoneNumber.data.purePhoneNumber)
      this.setData({
        cellphoneValue: parseInt(res.result.event.phoneNumber.data.purePhoneNumber)
      })
    })
    this.toForm()
  },
  toForm () {
    this.setData({
      formShowModelState: true,
      formShowModelData: {
        type: 'single',
        title: '确认手机号',
        content: '',
        confirmText: '完成报名',
        openType: 'contact'
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
  initCourseData () {
    return {
      [this.data.coursePublicData._id]: {
        course_state: true,
        sub_course: {}
      }
    }
  },
  registerCourse () {
    db.collection('t_user').doc(app.globalData.userData._id).update({
      data: {
        course: Object.assign( app.globalData.userData.course, this.initCourseData())
      },
      success: function(res) {
        console.log(`报名ID为${this.data.coursePublicData._id}的课程`, res.data)
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
      //后台接口
      this.setData({
        getCodeButtonState: false,
        verified: true
      })
      let time = 60
      let interval = setInterval(function () {
        time--
        if (time <= 0) {
          this.setData({
            getCodeButtonState: true,
            verificationButtonValue: '获取验证码',
            verified: false
          })
          clearInterval(interval)
        }
        this.setData({
          verificationButtonValue: time + 's'
        })
      }.bind(this), 1000)
    }
  },
  inputCellphoneNumber (e) {
    const regExp = /^[1](([3][0-9])|([4][5-9])|([5][0-3,5-9])|([6][5,6])|([7][0-8])|([8][0-9])|([9][1,8,9]))[0-9]{8}$/
    this.setData({
      cellphoneValue: e.detail.value,
      getCodeButtonState: regExp.test(e.detail.value) && !this.data.verified,
      verificationCodePlaceholder: regExp.test(e.detail.value) ? '请获取验证码' : '请填写正确的手机号'
    })
  },
  clearCellphoneNumber () {
    this.setData({
      cellphoneValue: null,
      verificationCodePlaceholder: '验证码'
    })
  }
})
