const img = require('../../../util/getimagesrc.js')
const storage = require('../../../util/storageControl.js')
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    CustomBar: app.globalData.CustomBar,
    imgsrc: img.logosrc(),
    loadModal: false,
    cardDetail: null,
    showpay: false,
    cardcost: 0,
    locatename: '',
  },

  hideModal() {
    this.setData({
      showpay: false
    })
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
    console.log(options)
    this.showLoading('绘制会员卡')
    try{
      let sallerinfo = storage.getStorageSyncTime('currentSaller')
      this.setData({
        locatename: sallerinfo.addressName
      })
    }catch{
      this.setData({
        locatename: '当前健身房'
      })
    }

    await wx.cloud.callFunction({
      name: 'getCardWithID',
      data: {
        _id: options.id,
      },
      success: res => {
        console.log('[云函数] [getCardWithID] result: ', res.result)
        this.setData({
          cardDetail: res.result.data
        })
      },
      fail: err => {
        console.error('[云函数] [confirmPush] 调用失败', err)
      },
      complete: res => {
        this.hideLoading()
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

  },

  buy() {
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
    this.setData({
      cardcost: parseInt(this.data.cardDetail.money).toFixed(2),
      showpay: true
    })
    const component = this.selectComponent("#payc"); //组件的id
    component.setBuyAndMsk(component.properties)
  },

  ViewImage(e) {
    let urls = []
    urls.push(e.currentTarget.dataset.url)
    wx.previewImage({
      urls: urls,
      current: e.currentTarget.dataset.url
    });
  },

  paymevent(e) {
    wx.showToast({
      title: '支付成功'
    })
    this.setData({
      showpay: false
    })
    wx.cloud.callFunction({
      name: 'addClientCard',
      data: {
        card: this.data.cardDetail,
        seller: app.globalData.sallerinfo
      },
      success: res => {
        console.log('[云函数] [addClientCard]', res.result)
        wx.redirectTo({
          url: '/pages/student/mine/card/card',
        })
      },
      fail: err => {
        console.error('[云函数] [addClientCard]', err)
      }
    })
  }
})