// miniprogram/pages/courseDetail/courseDetail.js
const app = getApp()
const db = wx.cloud.database()

Page({
  data: {
    courseId: null,                               // 课程 Id
    courseData: null,                             // 课程数据
    courseState: null,                            // 用户课程报名状态，true 为已报名，false 为未报名
    userTel: null,                               // 用户手机号
    userTelState: null,                          // 用户手机号合法状态，true 为合法，false 为不合法
    getCodeState: true,                          // 获取验证码状态，true 为可获取，false 为不可获取
    getCodeButtonValue: '获取验证码',              // 获取验证码按钮值
    formShowModelState: false,                    // 报名表单显示状态
    tipsShowModelState: false,                    // 表单提示显示状态
    tipsShowModelData: null,                      // 报名提示数据
    formShowModelData: null,                      // 报名表单数据

  },
  // 页面显示时
  onShow: async function (options) {
    if (!app.globalData.userData){
      app.eventHub.on('userDataInitSuccess', this.init)
    } else this.init()
  },
  init: async function () {
    await this.onCommunication()
    await this.getCourseData()
    this.getCourseState()
    this.initFormComponent()
    this.initTipComponent()
    this.getUserTel()
  },
  // 获取页面通信数据
  onCommunication: async function () {
    const eventChannel = this.getOpenerEventChannel()
    await eventChannel.on('getCourseId', this.getCourseId)
  },
  // 获取课程 Id
  getCourseId: function (e) {
    const courseId = e.courseId
    console.log('获取页面通信数据')
    this.setData({
      courseId
    })
    console.log(`设置课程海报页面课程id为${courseId}`)
  },
  // 获取课程数据
  getCourseData: async function () {
    await db.collection('t_course').where({
      _id: this.data.courseId
    }).get().then(res => {
      const courseData = res.data[0]
      this.setData({
        courseData
      })
      console.log(`查询得到id为${this.data.courseId}的课程数据`, courseData)
    })
  },
  // 获取用户课程报名状态
  getCourseState: function () {
    const courseState = this.data.courseId in app.globalData.userData.course
    this.setData({
      courseState
    })
    console.log('获取用户课程报名状态:', courseState)
  },
  // 初始化报名表单组件
  initFormComponent: function () {
    this.setData({
      formShowModelData: {
        type: 'single',
        title: '确认手机号',
        content: '',
        confirmText: '完成报名',
        openType: 'contact'
      }
    })
  },
  // 初始化提示组件
  initTipComponent: function () {
    this.setData({
      tipsShowModelData: {
        type: 'double',
        title: '温馨提示',
        content: '不确认手机号助教老师无法联系到您，导致享受不到优质助教服务',
        cancelText: '狠心放弃',
        confirmText: '继续填写'
      }
    })
  },
  // 显示报名表单
  showForm: function () {
    this.setData({
      formShowModelState: true,
    })
  },
  // 显示报名表单提示，关闭表明表单
  showTips: function () {
    this.setData({
      formShowModelState: false,
      tipsShowModelState: true,
    })
  },
  // 关闭报名表单
  closeForm: function () {
    this.setData({
      formShowModelState: false,
      tipsShowModelState: false,
    })
  },
  // 继续填写报名表单
  continueForm: function () {
    this.setData({
      formShowModelState: true,
      tipsShowModelState: false,
    })
  },
  // 获取用户手机号
  getUserTel: function () {
    const userTel = app.globalData.userData.tel
    this.setData({
      userTel,
      userTelState: this.phoneNumberRegular(userTel)
    })
  },
  // 获取手机号开放能力并获取手机号
  getPhoneNumberByOpenType: async function (e) {
    this.showForm()
    await wx.cloud.callFunction({
      name: 'getPhoneNumber',
      data: {
        phoneNumber: wx.cloud.CloudID(e.detail.cloudID)
      }
    }).then(res => {
      const userTel = parseInt(res.result.event.phoneNumber.data.purePhoneNumber)
      app.setUserTel(userTel)
      app.updateUserData()
      this.getUserTel()
    })
  },
  // 获取手机验证码
  getVerificationCode: function (e) {
    if (this.data.getCodeState) {
      //后台接口
      this.setData({
        getCodeState: false,
      })
      let time = 60
      let interval = setInterval(function () {
        time--
        if (time <= 0) {
          this.setData({
            getCodeState: true,
            getCodeButtonValue: '获取验证码',
          })
          clearInterval(interval)
          return
        }
        this.setData({
          getCodeButtonValue: time + 's'
        })
      }.bind(this), 1000)
    }
  },
  // 双向绑定手机输入框
  inputCellphoneNumber: function (e) {
    const userTel = e.detail.value
    this.setData({
      userTel,
      userTelState: this.phoneNumberRegular(userTel)
    })
  },
  // 手机号合法正则
  phoneNumberRegular: function (tel) {
    return /^[1](([3][0-9])|([4][5-9])|([5][0-3,5-9])|([6][5,6])|([7][0-8])|([8][0-9])|([9][1,8,9]))[0-9]{8}$/.test(tel)
  },
  // 清除手机号
  clearCellphoneNumber: function () {
    this.setData({
      userTel: null,
      userTelState: false
    })
  },
  // 初始化课程个人信息
  initCourseData: function () {
    const course_section = this.data.courseData.course_section.map(courseSection => {
      console.log(courseSection)
      console.log(courseSection.video)
      const video_schedule = courseSection.video.map(video => {
        return false
      })
      return {
        homework_id: '',
        video_schedule
      }
    })
    return {
      [this.data.courseId]: {
        course_schedule: 0,
        create_date: new Date(),
        course_section
      }
    }
  },
  // 报名课程
  registerCourse: function () {
    app.addUserCourse(this.initCourseData())
    app.updateUserData().then(() => console.log('报名成功'))
  },
  //
  toCourseDetail: function () {
    const courseData = this.data.courseData
    let {course_schedule,create_date} = app.globalData.userData.course[courseData._id]
    Object.assign(courseData, {
      course_section: courseData.course_section.map((section, index) => {
        return Object.assign(section, courseData.course_section[index])
      }),
      course_schedule,
      create_date
    })
    wx.navigateTo({
      url: '../courseDetail/courseDetail',
      success(res) {
        console.log('向课程详情页面传递课程数据', courseData)
        res.eventChannel.emit('getCourseData', {
          courseData
        })
      }
    })
  }

})
