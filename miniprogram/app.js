//app.js
let db
App({
  onLaunch: function () {
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力')
    } else {
      wx.cloud.init({
        traceUser: true,
      })
      db = wx.cloud.database()
    }
    this.init()
    this.initUser().then(r => this.eventHub.emit('userDataInitSuccess'))
  },
  //
  init: function () {
    this.globalData = {}
    this.eventHub = {
      events:{
      },
      emit(eventName,data){
        for (let key in this.events){
          if (key === eventName){
            let fnList = this.events[key];
            fnList.map((fn)=>{
              fn.call(undefined,data)
            })
          }
        }
      },
      on(eventName,fn){
        if (this.events[eventName] === undefined)
          this.events[eventName] = []
        this.events[eventName].push(fn)
      },
    }
  },
  //
  initUser: async function () {
    await this.getOpenid()
    const res = await this.getUserData(this.globalData.openid)
    if (res.length) {
      console.log('用户存在')
      this.setUserData(res[0])
    } else {
      console.log('用户不存在')
      console.log('创建用户并进行初始化')
      this.createUser(this.initUserData())
    }
  },
   // 创建用户
  createUser: function (userData) {
    db.collection('t_user').add({
      data: userData
    })
  },
  // 用户信息初始化
  initUserData: function () {
    return {
      create_date: new Date(),
      course: {},
      tel: '',
      nickname: '',
      info: {}
    }
  },
  // 获取数据库用户id为 openid 的用户信息
  getUserData: async function (openid) {
    console.log(`查询数据库用户id为${openid}的用户信息`)
    let returnData
    await db.collection('t_user').where({
      _openid: openid
    }).get().then(res => {
      returnData = res.data
    })
    return returnData
  },
  // 设置全局用户信息
  setUserData: function (userData) {
    console.log(`设置全局用户信息为`,userData)
    this.globalData.userData = userData
  },
  // 设置全局openid
  setOpenid: function (openid) {
    console.log('设置全局openid', openid)
    this.globalData.openid = openid
  },
  // 调用云函数获取用户 openID
  getOpenid: async function () {
    await wx.cloud.callFunction({
      name: 'login',
    }).then(res => {
      console.log('[云函数] [login] 调用成功')
      this.setOpenid(res.result.openid)
    }, err => {
      console.error('[云函数] [login] 调用失败', err)
    } )
  },
  setUserTel: function (tel) {
    console.log(`设置用户tel为${tel}`)
    this.globalData.userData.tel = tel
  },
  setUserCourse: function (course) {
    console.log(`设置用户Course为`, course)
    this.globalData.userData.course = course
  },
  updateUserData: async function () {
    let {create_date, course, tel, nickname, info} = this.globalData.userData
    await db.collection('t_user').doc(this.globalData.userData._id).update({
        data: {create_date, course, tel, nickname, info}
    }).then( res => console.log('更新用户数据成功'), error => console.log('更新用户数据成功', error) )
  }
})
