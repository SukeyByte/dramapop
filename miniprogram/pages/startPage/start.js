const parama = require('../../util/getUsefulParama.js')
const img = require('../../util/getimagesrc.js')
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgsrc: img.logosrc()
  },

  /**
   * 生命周期函数--监听页面加载
   */
  async onLoad(options) {
    //初始化当前店铺信息
    app.globalData.sallerinfo = wx.getStorageSync('currentSaller')
    let isLogin = false
    if(app.globalData.openid){
      isLogin = true
    }
    //获取banner
    let startInfo = await wx.cloud.callFunction({
      name: 'getStartInfo',
      data: {
        isLogin:isLogin
      },
    }).then(res => {
      console.log(res.result)
      return res.result
    }).catch(err => {
      console.log(err)
      return null
    })

    app.globalData.bannerList = startInfo.banner
    let isCoatch = startInfo.isCoatch


    console.log(app.globalData.bannerList)
    if (isCoatch == 1) {
      wx.redirectTo({
        url: '/pages/coatch/index/index',
      })
    }
    else {
      wx.redirectTo({
        url: '/pages/student/newIndex/newIndex',
      })
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})