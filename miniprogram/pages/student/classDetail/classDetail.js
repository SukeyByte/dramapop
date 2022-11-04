const app = getApp()
const language = require('../../../util/getLanguageKeyByPage.js')
const parama = require('../../../util/getUsefulParama.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: [],
    pageIndex: 1,
    pageCode: null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    language.getLanguage('classdetail').then(res => {
      this.setData({
        pageCode: res,
        title: res.index005,
      })
      this.getDatas();
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
    console.log('hi')
    this.getDatas();
    setTimeout(() => {
      wx.hideLoading()
    }, 2000)
  },
  async getDatas() {
    const MAX_LIMIT = 40;
    let that = this
    var index = that.data.pageIndex
    if (index < 0) return

    const db = wx.cloud.database()
    const _ = db.command
    const data = that.data.list
    let coatchInfo = await db.collection('orderClass').where({
      userid: app.globalData.openid
    }).orderBy('createTime', 'desc').skip((index - 1) * MAX_LIMIT).limit(MAX_LIMIT).get()
    if (coatchInfo.length < 1) {
      wx.hideLoading()
      this.setData({
        pageIndex: 0
      })
      return
    }
    index++
    for (let i = 0; i < coatchInfo.data.length; i++) {
      data.push(coatchInfo.data[i])
    }
    console.log(data)
    this.setData({
      list: data,
      pageIndex: index
    })
    wx.hideLoading()
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

  call(e){
    console.log(e)
    wx.makePhoneCall({
      phoneNumber: e.currentTarget.dataset.number
    })
  }
})