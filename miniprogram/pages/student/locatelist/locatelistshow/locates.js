const app = getApp()
const db = wx.cloud.database()
const _ = db.command
const img = require('../../../../util/getimagesrc.js')
const dateTimeUtil = require('../../../../util/getTime.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    loadModal: false,
    loadingtext: '',
    imgsrc: img.logosrc(),
    blanksrc: img.blanksrc(),
    sellerList: [],
    showModel: false
  },

  showLoading(text) {
    this.setData({
      loadModal: true,
      loadingtext: text.title
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
    let that = this
    this.showLoading('')
    wx.getLocation({
      type: 'wgs84',
      success: function (res) {
        console.log(res)
        wx.cloud.callFunction({
          name: 'getNearLocate',
          data: {
            longitude: res.longitude,
            latitude: res.latitude
          },
        }).then(res => {
          console.log(res.result)
          that.setData({
            sellerList: res.result.list
          })
          that.hideLoading()
        }).catch(err => {
          console.log(err)
        })
      }
    })
  },

  toDetail: function (e) {
    console.log(e)
    wx.navigateTo({
      url: '../../sellerDetail/seller?id=' + e.currentTarget.dataset.id,
    })
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

  },
})