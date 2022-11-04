const app = getApp()
const db = wx.cloud.database()
const _ = db.command
const img = require('../../../util/getimagesrc.js')
const dateTimeUtil = require('../../../util/getTime.js')
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
    showModel: false,
    selectItem: null,
    confirmText: '',
    confirmConetnt: '',
    bindingid: ''
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
    console.log(options)
    this.setData({
      bindingid: options.id
    })
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

  bindSeller: function (e) {
    console.log(e)
    this.data.selectItem = e.currentTarget.dataset.item
    this.setData({
      showModel: true,
      confirmText: '确认绑定',
      confirmConetnt: '您即将绑定' + this.data.selectItem.name + '作为你的主营场地，是否绑定？'
    })
  },

  hideModal: function () {
    this.setData({
      showModel: false
    })
  },

  save: function () {
    this.showLoading('绑定中..')
    console.log(this.data.selectItem)
    this.setData({
      showModel: false
    })
    wx.cloud.callFunction({
      name: 'updateCoatchBinding',
      data: {
        seller: this.data.selectItem
      },
    }).then(res => {
      console.log(this.data.selectItem)
      if (this.data.selectItem != null) {
        this.setData({
          bindingid: this.data.selectItem._id
        })
      } else {
        this.setData({
          bindingid: null
        })
      }

      this.hideLoading()
    }).catch(err => {
      console.log(err)
    })
  },

  unbindSeller: function (e) {
    console.log(e)
    wx.vibrateShort({
      success: (res) => {
        console.log(res)
      },
    })
    if (this.data.bindingid == e.currentTarget.dataset.item._id) {
      this.setData({
        showModel: true,
        confirmText: '取消绑定',
        confirmConetnt: '您即将取消绑定' + e.currentTarget.dataset.item.name + '，是否取消？'
      })
      this.data.selectItem = null
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

  },
})