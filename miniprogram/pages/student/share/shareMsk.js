const app = getApp()
const order = require('../../../util/getOrderNum.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    name: '',
    total: 0,
    count: 0,
    loadModal: false,
    loadingtext: '',
    coatchPackage: null,
    msks: ''
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
    console.log(options)
    wx.cloud.callFunction({
      name: 'getMskClientById',
      data: {
        'id': options.id,
        'clientId': options.clientid
      }
    }).then(res => {

      this.setData({
        msks: res.result.list[0]
      })
      console.log(this.data.msks)
    }).catch(err => {
      console.error(err)
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

  confirm: async function () {
    if (app.globalData.openid == null || app.globalData.openid == undefined) {
      wx.redirectTo({
        url: '../mine/mine',
      })
      return;
    }

    wx.cloud.callFunction({
      name: 'updateMskClient',
      data: {
        'id': this.data.msks._id,
        'clientId': app.globalData.openid
      }
    }).then(res => {
      wx.showToast({
        title: '领取成功'
      })
      wx.redirectTo({
        url: '../mine/msks/msks',
      })
      console.log(this.data.msks)
    }).catch(err => {
      console.error(err)
    })
  }
})