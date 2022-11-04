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
    imgsrc: img.logosrc(),
    blanksrc: img.blanksrc(),
    title: '本月'
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
    console.log(options)
    that.showLoading('正在整理器械...')
    const db = wx.cloud.database()
    // let coatchInfo = await db.collection('Coatch').where({
    //   _openid: app.globalData.openid
    // }).get()
    // console.log('coatchInfo', coatchInfo)
    let iscooperation = options.iscooperation
    if (iscooperation == 1) {
      this.setData({
        title:'合作'
      })
    }
    const MAX_LIMIT = 500;
    wx.cloud.callFunction({
      name: 'getCoatchMoney',
      data: {
        'openid': app.globalData.openid,
        'sellerId': app.globalData.sallerinfo._id,
        'pageIndex': 1,
        'MAX_LIMIT': MAX_LIMIT,
        'iscooperation': iscooperation
      },
      success: res => {
        console.log('[云函数] [getCoatchMoney] result: ', res.result);
        if (iscooperation == 1) {
          that.getcooperation(res)
        } else {
          that.getnormalcoatch(res)
        }

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

  getnormalcoatch(res) {
    let s = 0.3
    if (res.result.price < 10000) {
      s = 0.3
    } else if (res.result.price < 20000) {
      s = 0.31
    } else if (res.result.price < 30000) {
      s = 0.32
    } else if (res.result.price < 40000) {
      s = 0.33
    } else if (res.result.price < 50000) {
      s = 0.35
    } else {
      s = 0.36
    }
    this.data.price = res.result.price * s
    this.setData({
      list: res.result.result.data,
      price: this.data.price
    })
  },

  getcooperation(res) {
    this.data.price = res.result.price
    this.setData({
      list: res.result.result.data,
      price: this.data.price
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