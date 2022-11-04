// miniprogram/pages/login/login.js
const app = getApp()
Page({

  /**
   * Page initial data
   */
  data: {
    classid: '',
    coatchid: ''
  },

  /**
   * Lifecycle function--Called when page load
   */
  onLoad: function(options) {
    console.log(options)
    this.setData({
      classid: options.classid,
      coatchid: options.coatch
    })
    console.log(this.data.classid)
    console.log(this.data.coatchid)
  },

  /**
   * Lifecycle function--Called when page is initially rendered
   */
  onReady: function() {

  },

  /**
   * Lifecycle function--Called when page show
   */
  onShow: function() {

  },

  confirm: function() {
    this.finish(true)
  },
  cancel: function() {
    this.finish(false)
  },
  finish(e){
    wx.showLoading({
      title: '感谢您的反馈',
    })
    wx.cloud.callFunction({
      name: 'addPushInfo',
      data: {
        'classid': this.data.classid,
        'coatchid': this.data.coatchid,
        'isfinish': e
      },
      success: res => {
        console.log('[云函数] [addPushInfo] result: ', res.result)
        wx.hideLoading()
        wx.redirectTo({
          url: '/pages/student/index/Index',
        })
      },
      fail: err => {
        console.error('[云函数] [addPushInfo] 调用失败', err)
        wx.hideLoading()
      },
      complete: res => {
        wx.hideLoading()
      }
    })
  },
  /**
   * Lifecycle function--Called when page hide
   */
  onHide: function() {

  },

  /**
   * Lifecycle function--Called when page unload
   */
  onUnload: function() {

  },

  /**
   * Page event handler function--Called when user drop down
   */
  onPullDownRefresh: function() {

  },

  /**
   * Called when page reach bottom
   */
  onReachBottom: function() {

  },


  getUserInfo: function(e) {

  },

  /**
   * Called when user click on the top right corner to share
   */
  onShareAppMessage: function() {

  }
})