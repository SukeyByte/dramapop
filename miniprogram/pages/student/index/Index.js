const language = require('../../../util/getLanguageKeyByPage.js')
const parama = require('../../../util/getUsefulParama.js')
const footdata = require('../../student/studentFootData.js')
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    pageCode: null,
    resourceList: null,
    StatusBar: app.globalData.StatusBar,
    CustomBar: app.globalData.CustomBar,
    Custom: app.globalData.Custom,
    TabCur: 0,
    MainCur: 0,
    VerticalNavTop: 0,
    dataList: [],
    bannerList: [],
    activityList: []
  },

  async navToCoatch() {

  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    footdata.footDataList('index').then(res => {
      this.setData({
        dataList: res
      })
    })

    this.setData({
      bannerList: app.globalData.bannerList
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

  NavChange(e) {
    wx.redirectTo({
      url: e.currentTarget.dataset.cur,
    })
  },

  tobanner(e) {
    if (e.currentTarget.dataset.type == 0) {
      wx.navigateTo({
        url: e.currentTarget.dataset.url,
      })
    } else if (e.currentTarget.dataset.type == 1) {
      wx.navigateTo({
        url: e.currentTarget.dataset.url,
      })
    } else {
      wx.navigateTo({
        url: '../webview/webview?url=' + e.currentTarget.dataset.url,
      })
    }
  },

  toClass() {
    wx.redirectTo({
      url: '/pages/student/class/mainclass',
    })
  },

  toChild(e) {
    console.log(e.currentTarget.dataset.type)
    console.log(e.currentTarget.dataset.url)
    if (e.currentTarget.dataset.type == 0) {
      wx.navigateTo({
        url: e.currentTarget.dataset.url,
      })
    } else if (e.currentTarget.dataset.type == 1) {
      wx.navigateTo({
        url: e.currentTarget.dataset.url,
      })
    } else {
      wx.navigateTo({
        url: '../webview/webview?url=' + e.currentTarget.dataset.url,
      })
    }
  },

  navLocation: function () {
    wx.navigateTo({
      url: '/pages/student/sporttime/sportTime',
    })
  },

  getLocation: function () {
    console.log(app.globalData.sallerinfo)
    var that = this
    wx.showLoading({
      title: '正在规划路径..',
    })
    let lati = parseFloat(app.globalData.sallerinfo.x)
    let longi = parseFloat(app.globalData.sallerinfo.y)
    wx.getLocation({
      type: 'wgs84',
      success: function (res) {
        console.log(res)
        wx.openLocation({ //​使用微信内置地图查看位置。
          latitude: parseFloat(app.globalData.sallerinfo.x), //要去的纬度-地址
          longitude: parseFloat(app.globalData.sallerinfo.y), //要去的经度-地址
          name: app.globalData.sallerinfo.name,
          address: app.globalData.sallerinfo.addressName,
          success: function (res) {
            wx.hideLoading()
          },
          fail: function (res) {
            console.log(res)
          }
        })
      }
    })
  },
})