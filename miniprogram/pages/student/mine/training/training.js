const app = getApp()
const img = require('../../../../util/getimagesrc.js')
const caculete = require('../../../../util/getCaculeteMoney.js')
const storage = require('../../../../util/storageControl.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgsrc: img.logosrc(),
    training: [],
    loadModal: false,
    loadingtext: ''
  },

  showLoading(text) {
    this.setData({
      loadModal: true,
      loadingtext: text
    })
  },

  hideLoading() {
    this.setData({
      loadModal: false
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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
    if (app.globalData.openid == null || app.globalData.openid == undefined) {
      wx.showToast({
        title: '请先登陆哦',
        icon: 'none'
      })
      wx.redirectTo({
        url: '../mine/mine',
      })
      return;
    }
    this.showLoading('正在整理数据')
    wx.cloud.callFunction({
      name: 'getSumTimeLog',
      data: {
        cilentId: app.globalData.openid,
      },
      success: res => {
        console.log('[云函数] [getSumTimeLog] result: ', res.result)
        this.setData({
          training: res.result
        })
      },
      fail: err => {
        console.error('[云函数] [getSumTimeLog] 调用失败', err)
      },
      complete: res => {
        this.hideLoading()
      }
    })
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

  },

  payfor:async function (e) {
    let item = e.currentTarget.dataset.item
    console.log(item)
    if(item.pay == 0){
      this.showLoading('正在核算金额')
      //款项未结清
      let sallerinfo = storage.getStorageSyncTime('currentSaller')
      let money = await caculete.caculete(item.begTime, item.endTime, sallerinfo._id)
      console.log(money)
      this.setData({
        twoHourMoney: money
      })
      this.hideLoading()
      // wx.setStorageSync('sportTime', item.id)
      //计算完成后重定向到指定页面
      wx.redirectTo({
        url: '/pages/student/payPage/payPage?money=' + money + '&title=种马波普健身房健身&foreignId=' + item.id + '&useType=0&payType=4&redirect=/pages/student/sporttime/sportTime',
      })
    }
  }
})