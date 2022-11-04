const img = require('../../../../util/getimagesrc.js')
const app = getApp()
const db = wx.cloud.database()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    openid: app.globalData.openid,
    classList: [],
    loadModal: false,
    loadingtext: '',
    agoClassList: [],
    blanksrc: img.blanksrc(),
    selecttype: 1,
    showModel: false,
    selectitem: null,
    pageIndex: 1,
    totalPage: 0,
    MAX_LIMIT: 10
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

  tabSelect(e) {
    console.log(e)
    this.data.pageIndex = 1
    this.data.totalPage = 0
    this.setData({
      selecttype: e.currentTarget.dataset.id,
      classList: [],
      agoClassList: []
    })
    this.getSelectClass(e.currentTarget.dataset.id)
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getSelectClass(1)
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
    if (this.data.totalPage > (this.data.pageIndex * this.data.MAX_LIMIT)) {
      this.data.pageIndex += 1
      this.getSelectClass(this.data.selecttype)
    }
  },

  makephonecall(e) {
    console.log(e)
    wx.makePhoneCall({
      phoneNumber: e.currentTarget.dataset.item.coatchInfo.number,
    })
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

  getSelectClass(type) {
    let that = this
    this.showLoading('正在挑选课程...')
    wx.cloud.callFunction({
      name: 'getStudentSelectClass',
      data: {
        'openid': app.globalData.openid,
        'sellerId': app.globalData.sallerinfo._id,
        'pageIndex': this.data.pageIndex,
        'type': type
      },
      success: res => {
        console.log('[云函数] [getStudentSelectClass] result: ', res.result);
        this.data.totalPage = res.result.count
        if (type == 1) {
          res.result.result.forEach(function (element, index, array) {
            that.data.classList.push(element)
          })
          that.setData({
            classList: that.data.classList
          })
          console.log(that.data.classList)
        }
        else {
          res.result.result.forEach(function (element, index, array) {
            that.data.agoClassList.push(element)
          })
          console.log(that.data.agoClassList)
          that.setData({
            agoClassList: that.data.agoClassList
          })

        }
        return res.result;
      },
      fail: err => {
        console.error('[云函数] [getStudentSelectClass] 调用失败', err);
        return err;
      },
      complete(res) {
        that.hideLoading()
        return res
      }
    })
  },

  cancel(e) {
    console.log(e)
    this.data.selectitem = e.currentTarget.dataset.item
    this.setData({
      showModel: true
    })
  },

  hideModal() {
    this.setData({
      showModel: true
    })
  },

  confirm() {
    this.setData({
      showModel: true
    })
  },

})