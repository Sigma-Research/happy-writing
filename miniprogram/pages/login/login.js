Page({
  data: {
    schoolList: [
       '快乐小学',
       '悲伤小学'
    ],
    gradeList: [
      '六年级',
      '二年级'
    ],
    classList: [
      '一班',
      '二班'
    ],
    school: null,
    grade: null,
    class: null
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
  changeSchool (e) {
    this.setData({
      school: this.data.schoolList[e.detail.value]
    })
  },
  changeGrade (e) {
    this.setData({
      grade: this.data.gradeList[e.detail.value[0]],
      class: this.data.classList[e.detail.value[1]]
    })
  }
})
