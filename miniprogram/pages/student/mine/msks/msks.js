const app = getApp()
const img = require('../../../../util/getimagesrc.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgsrc: img.logosrc(),
    blanksrc: img.blanksrc(),
    msklist: [],
    loadModal: false,
    loadingtext: '',
    selectItem: ''
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
    this.showLoading('正在收集优惠券')
    wx.cloud.callFunction({
      name: 'getmskCilent',
      data: {
        cilentId: app.globalData.openid,
      },
      success: res => {
        console.log('[云函数] [getmskCilent] result: ', res.result)
        this.setData({
          msklist: res.result
        })
      },
      fail: err => {
        console.error('[云函数] [getmskCilent] 调用失败', err)
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
  onShareAppMessage: function (e) {
    console.log(e)
    this.data.selectItem = e.target.dataset.item
    console.log(this.data.selectItem)
    let that = this
    let paths = '/pages/student/share/shareMsk?id=' + that.data.selectItem._id + '&clientid=' + app.globalData.openid
    console.log(paths)
    var shareObj = {
      title: app.globalData.userInfo.nickName + '送你一张' + that.data.selectItem.name,
      path: paths,
      imageUrl: 'https://6d61-mallforgym-i8imy-1300202136.tcb.qcloud.la/share.jpg',
    }
    return shareObj;
  }
})