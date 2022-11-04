const app = getApp()
const language = require('../../../util/getLanguageKeyByPage.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    item: "",
    paymentOrder: '',
    payment: 0,
    title: '',
    pageCode: null,
    useType: 0,
    payType: 0,
    foreignId: null,
    redircetUrl: null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (app.globalData.userInfo == null) {
      wx.navigateBack()
      wx.showToast({
        icon: "none",
        title: '购买需要登陆哦~',
      })
      return
    }
    var that = this
    language.getLanguage('payPage').then(res => {
      console.log(res)
      this.setData({
        pageCode: res
      })
    })
    console.log(options)
    this.setData({
      payment: options.money,
      title: options.title,
      useType: options.useType,
      payType: options.payType,
      redircetUrl: options.redirect,
      foreignId: options.foreignId
    })
  },
  //支付成功响应事件
  paymevent(e) {
    console.log(e)
    let db = wx.cloud.database()
    if (this.data.redircetUrl == null) {
      wx.navigateBack({
        delta: 0,
      })
    } else {
      let sportdata = wx.getStorageSync('sportTime')
      if (sportdata.length != null) {
        wx.redirectTo({
          url: this.data.redircetUrl,
        })
        //更新支付完成状态，防止支付延时
        db.collection('SumTimelog').doc(this.data.foreignId).update({
          data: {
            'status': 1
          }
        }).then(res => {

        }).catch(err => {
          return err
        })
      }

    }

  }

})