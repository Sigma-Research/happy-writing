// components/showModel.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    showModelData: Object
  },

  /**
   * 组件的初始数据
   */
  data: {},
  /**
   * 组件的方法列表
   */
  methods: {
    preventTouchMove: function(e) {},
    onCancel: function () {
      this.triggerEvent('cancel')
    },
    onConfirm: function () {
      this.triggerEvent('confirm')
    },
    onHidden: function () {
      this.triggerEvent('hidden')
    }
  }

})
