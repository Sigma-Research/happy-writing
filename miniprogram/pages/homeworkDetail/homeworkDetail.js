// homeworkDetail.js
const app = getApp()
const db = wx.cloud.database()

Page({
  data: {
    homework_id: null,
    course_id: null,
    index: null,
    homeworkData: null,
    lecturer_id: null,
  },
  onLoad: async function (options) {
    await this.onCommunication()
    await this.getHomeworkData()
  },
  // 获取传递数据
  onCommunication: async function () {
    console.log('获取页面通信数据')
    const eventChannel = this.getOpenerEventChannel()
    await eventChannel.on('getHomeworkDetailData', this.getHomeworkDetailData)
  },
  // 获取传递作业数据
  getHomeworkDetailData: function (data) {
    const { homework_id, course_id, index, user_id, lecturer_id } = data
    this.setData({
      homework_id,
      course_id,
      index,
      user_id,
      lecturer_id
    })
    console.log("获取作业数据",homework_id, course_id, index, user_id)
  },
  // 获取作业数据
  getHomeworkData: async function () {
    const {homework_id} = this.data
    let homeworkData
    if (homework_id) {
      console.log(homework_id)
      await db.collection('t_homework').doc(homework_id).get().then(res => {
        homeworkData = res.data
        console.log(homeworkData)
      })
    } else homeworkData = this.initHomeworkData()
    this.setData({
      homeworkData
    })
    console.log('获取作业数据', homeworkData)
  },
  // 作业初始化
  initHomeworkData: function () {
    console.log('作业初始化')
    const { course_id, user_id, lecturer_id, index } = this.data
    return {
      lecturer_id,
      user_id,
      course_id,
      review_audio: '',
      homework_image: '',
      review_data: {},
      liked_sum: 0,
      state: 'submitted',
      section_index: index,
      recommend: false,
      viewed: true
    }
  },
  // 选择图片
  chooseImage: function() {
    console.log('选择图片')
    wx.chooseImage({
      count: 9,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
    }).then(res => {
      console.log('图片成功')
      const tempFilePaths = res.tempFilePaths
      console.log(tempFilePaths)
      this.uploadHomework(tempFilePaths[0]).then(() => {
        console.log('上传成功')
      })
    }, error => {
      console.log(error)
    })
  },
  // 上传图片
  uploadImage: async function(userId, homeworkId, url) {
    let fileID
    console.log(userId, homeworkId, url)
    await wx.cloud.uploadFile({
      cloudPath: `${userId}-${homeworkId}`, // 上传至云端的路径
      filePath: url, // 小程序临时文件路径
    }).then(res => {
        fileID = res.fileID
        console.log(`图片上传至云存储,fileID为${fileID}`)
    }, error => console.log(error))
    return fileID
  },
  // 上传作业
  uploadHomework: async function(url) {
    const { homework_id, user_id, homeworkData} = this.data
    console.log(`homework_id: ${homework_id}`)
    if (!homework_id) {
      await db.collection('t_homework').add({
        data: homeworkData
      }).then( (res) => {
        console.log('数据库中初始化作业')
        this.setData({
          homework_id: res._id
        })
        this.updateUserData()
      },error => {
        console.log(error)})
    }
    const fileID = await this.uploadImage(user_id, this.data.homework_id, url)
    console.log(fileID)
    await db.collection('t_homework').doc(this.data.homework_id).update({
      data: {
        homework_image: fileID
      }
    }).then(() => {
      console.log(`更新id为${this.data.homework_id}的作业的fileID`)
    }, error => console.error(error))
  },
  // 更新全局用户数据,并更新数据库用户数据
  updateUserData: function () {
    const userData = app.globalData.userData
    userData.course[this.data.course_id].course_section[this.data.index].homework_id = this.data.homework_id
    console.log('更新全局用户数据', userData)
    app.globalData.userData = userData
    app.updateUserData()
  },
  onReady: function () {

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

  }
})
