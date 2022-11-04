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
    coatchPackage:null
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
      name: 'getCoatchPackage',
      data: {
        'id': options.id
      }
    }).then(res => {
      console.log(res)
      this.setData({
        name: res.result.data.name,
        total: res.result.data.total,
        count: res.result.data.number,
        coatchPackage : res.result.data
      })
    }).catch(err => {
      console.err(err)
    })

    wx.cloud.callFunction({
      name: 'updatePackageStatus',
      data: {
        'id': options.id,
        'status': 1
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

  confirm: async function () {
    if (app.globalData.openid == null || app.globalData.openid == undefined) {
      wx.redirectTo({
        url: '../mine/mine',
      })
      return;
    }
    let that = this
    let money = this.data.total * 100
    let orderNo = order.getOrderNumber(app.globalData.openid, 'LKB')//订单号
    let orderName = that.data.name + money / 100 + "元"

    if(app.globalData.sallerinfo == null){
      app.globalData.sallerinfo = wx.getStorageInfoSync('currentSaller')
    }
    console.log('coatchPackage--->', that.data.coatchPackage)
    that.showLoading('订单生成中..')
    let orderinfo = await wx.cloud.callFunction({
      name: 'addOrderByPay',
      data: {
        'buyInfo': that.data.coatchPackage,
        'mskInfo': null,
        'price': money / 100,
        'totalMoney': money / 100,
        'payMoney': money / 100,
        'classInfo': null,
        'sellerId': app.globalData.sallerinfo._id,
        'counts': 1,
        'order': orderNo,
        'title': orderName,
        'payType': 1,
        'type': 4,//支付类型  购买类型  1 约课  2 会员卡 3 充值 4 按时计费
        'balanceMoney': 0,
        'orderStatus': 0
      },
    }).then(res => {
      this.hideLoading()
      return res
    }).catch(err => {
      return err
    })

    console.log(orderinfo)

    let payment = await wx.cloud.callFunction({
      name: 'getwxpayment',
      data: {
        body: orderName,
        order: orderNo,
        money: money
      }
    }).then(res => {
      console.log(res)
      return res
    }).catch(err => { return err })

    let pay = payment.result.payment
    wx.requestPayment({
      ...pay,
      success(res) {
        console.log('pay success', res)
        wx.showToast({
          title: '将从微信确认收款结果，您的余额展示可能有延时',
          icon: null
        })
        wx.cloud.callFunction({
          name: 'updatePackageStatus',
          data: {
            'id': that.data.coatchPackage._id,
            'status': 2,
            'userid':app.globalData.openid
          }
        })
        
        wx.redirectTo({
          url: '../mine/card/card',
        })

      },
      fail(res) {
        console.error('pay fail', res)
      }
    })
  }
})