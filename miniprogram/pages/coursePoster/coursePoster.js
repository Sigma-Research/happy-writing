// miniprogram/pages/courseDetail/courseDetail.js
const app = getApp()
const db = wx.cloud.database()

Page({
  data: {
    formShowModelState: false,                    // 报名表单显示状态
    tipsShowModelState: false,                    // 表单提示显示状态
    tipsShowModelData: null,                      // 报名提示数据
    formShowModelData: null,                      // 报名表单数据
    getCodeButtonState: false,                    // 获取验证码按钮状态
    cellphoneValue: null,                         // 手机号值
    verificationCodePlaceholder: '请先获取验证码',   // 验证码输入框占位符
    verificationButtonValue: '获取验证码',          // 验证码按钮值
    verified: false,                              // 是否获取了验证码
    coursePublicData: null,                       // 课程公共数据
    coursePrivateData: null,                      // 课程个人数据
    registerState: undefined                      // 注册状态
  },
  // 页面显示时
  onShow: async function (options) {
    // 若全局未存储用户信息，获取用户信息并存入全局
    if (!app.globalData.userData) {
      console.log('全局中未存储用户信息')
      await app.getUserData()
    }
    // 获取页面的课程公共数据
    await this.onGetCourseData()
    // 获取页面的课程报名状态
    this.getRegisterState()
  },
  onReady: function () {

  },
  //监听 getCourseData | 触发得到页面的课程公共数据
  onGetCourseData: async function () {
    const eventChannel = this.getOpenerEventChannel()
    await eventChannel.on('getCourseData', this.setCoursePublicData)
  },
  // 获取页面的课程公共数据
  setCoursePublicData: function (res) {
    this.setData({
      coursePublicData: res.data
    })
    console.log('触发 getCourseData()')
    console.log('页面课程公共数据:', res.data)
  },
  // 获取页面的课程报名状态
  getRegisterState: function () {
    this.setData({
      registerState: this.data.coursePublicData._id in app.globalData.userData.course
    })
    console.log('课程报名状态:', this.data.registerState)
  },
  // 获取用户手机号
  getPhoneNumber: async function (e) {
    await wx.cloud.callFunction({
      name: 'getPhoneNumber',
      data: {
        phoneNumber: wx.cloud.CloudID(e.detail.cloudID)
      }
    }).then(res => {
      console.log('获取用户手机号：',res.result.event.phoneNumber.data.purePhoneNumber)
      this.setData({
        cellphoneValue: parseInt(res.result.event.phoneNumber.data.purePhoneNumber),
        getCodeButtonState : !this.data.verified
      })
    })
    // 显示报名表单
    this.toForm()
  },
  // 显示报名表单
  toForm () {
    this.setData({
      formShowModelState: true,
      formShowModelData: {
        type: 'single',
        title: '确认手机号',
        content: '',
        confirmText: '完成报名',
        /*openType: 'contact'*/
      }
    })
  },
  // 显示报名表单提示，关闭表明表单
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
  // 初始化课程个人信息
  initCourseData () {
    return {
      [this.data.coursePublicData._id]: {
        course_state: true,
        sub_course: {}
      }
    }
  },
  // 报名课程
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
  // 关闭报名表单
  closeForm () {
    this.setData({
      formShowModelState: false,
      tipsShowModelState: false,
    })
  },
  // 继续填写报名表单
  continueForm () {
    this.setData({
      formShowModelState: true,
      tipsShowModelState: false,
    })
  },
  // 获取手机验证码
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
          return
        }
        this.setData({
          verificationButtonValue: time + 's'
        })
      }.bind(this), 1000)
    }
  },
  // 双向绑定手机输入框
  inputCellphoneNumber (e) {
    const regExp = /^[1](([3][0-9])|([4][5-9])|([5][0-3,5-9])|([6][5,6])|([7][0-8])|([8][0-9])|([9][1,8,9]))[0-9]{8}$/
    this.setData({
      cellphoneValue: e.detail.value,
      getCodeButtonState: regExp.test(e.detail.value) && !this.data.verified,
      verificationCodePlaceholder: regExp.test(e.detail.value) ? '请先获取验证码' : '请填写正确的手机号'
    })
  },
  // 清除手机号
  clearCellphoneNumber () {
    this.setData({
      cellphoneValue: null,
      verificationCodePlaceholder: '验证码'
    })
  }
})
