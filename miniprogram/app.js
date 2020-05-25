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
    this.globalData = {}
  },
  // 获取用户信息并存入全局
  getUserData: async function () {
    await db.collection('t_user').where({
      _openid: this.globalData.openid
    }).get().then(res => {
      console.log("用户信息存入全局",res.data[0])
      this.globalData.userData = res.data[0]
    })
  },
})
