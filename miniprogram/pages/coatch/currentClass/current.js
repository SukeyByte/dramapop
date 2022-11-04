const parama = require('../../../util/getUsefulParama.js')
const img = require('../../../util/getimagesrc.js')
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: [],
    price: 0,
    loadModal: false,
    loadingtext: '',
    imgsrc:img.logosrc(),
    blanksrc: img.blanksrc(),
    sallerName:'种马波普'
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
  onLoad: async function (options) {
    let that = this
    that.showLoading('正在整理器械...')
    if (app.globalData.sallerinfo == null) {
      app.globalData.sallerinfo = await parama.getSaller().then(res => {
        console.log(res)
        return res
      })
    }
    const db = wx.cloud.database()
    const MAX_LIMIT = 500;
    wx.cloud.callFunction({
      name: 'getCoatchMoney',
      data: {
        'openid': app.globalData.openid,
        'sellerId': app.globalData.sallerinfo._id,
        'pageIndex': 1,
        'MAX_LIMIT': MAX_LIMIT
      },
      success: res => {
        console.log('[云函数] [getCoatchMoney] result: ', res.result);
        this.setData({
          list: res.result.result.data,
          price: res.result.price
        })
        return res.result;
      },
      fail: err => {
        console.error('[云函数] [getCoatchMoney] 调用失败', err);
        return err;
      },
      complete(res) {
        that.hideLoading()
        return res
      }
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

  }
})