const app = getApp()
const order = require('../../../util/getOrderNum.js')

const db = wx.cloud.database()
const _ = db.command
let watcher = null

Page({

  /**
   * 页面的初始数据
   */
  data: {
    selected: 0,
    amount: 0.00
  },

  selectCharge(e) {
    console.log(e)
    this.setData({
      selected: e.currentTarget.dataset.id
    })
  },

  async charge() {
    if (app.globalData.openid == null || app.globalData.openid == undefined) {
      wx.redirectTo({
        url: '../mine/mine',
      })
      return;
    }
    let that = this

    let orderNo = order.getOrderNumber(app.globalData.openid, 'SCZ')//订单号
    let money = (that.data.selected + 1) * 50 * 100
    let orderName = "种马波普-健身房充值" + money / 100 + "元"

    let orderinfo = await wx.cloud.callFunction({
      name: 'addOrderByPay',
      data: {
        'buyInfo': null,
        'mskInfo': null,
        'price': money/100,
        'totalMoney': money/100,
        'payMoney': money/100,
        'classInfo': null,
        'sellerId': app.globalData.sallerinfo._id,
        'counts': 1,
        'order': orderNo,
        'title': orderName,
        'payType': 1,
        'type': 3,
        'balanceMoney': 0,
        'orderStatus': 0
      },
    }).then(res => {
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
        money: (that.data.selected + 1) * 50 * 100
      }
    }).then(res => { return res }).catch(err => { return err })

    const pay = payment.result.payment
    wx.requestPayment({
      ...pay,
      success(res) {
        console.log('pay success', res)
        wx.showToast({
          title: '将从微信确认收款结果，您的余额展示可能有延时',
          icon: null
        })
        wx.redirectTo({
          url: '../mine/mine',
        })
      },
      fail(res) {
        console.error('pay fail', res)
      }
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
      wx.redirectTo({
        url: '../mine/mine',
      })
      return;
    }
    let that = this
    //开始监听余额变更
    db.collection('Client').where({
      openid: app.globalData.openid
    }).get().then(res => {
      console.log(res)
      that.setData({
        amount: res.data[0].amount
      })
      that.startWatcher(res.data[0]._id)
      console.log(res.data[0].amount)
      //return res.data
    }).catch(err => {
      return err
    })
  },
  async startWatcher(dataid) {
    console.log(dataid)
    let that = this
    watcher = db.collection('Client').doc(dataid).watch({
      onChange: function (snapshot) {
        console.log('snapshot', snapshot)
        that.setData({
          amount: snapshot.docChanges[0].doc.amount
        })
      },
      onError: function (err) {
        console.error('the watch closed because of error', err)
      }
    })
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    //结束监听余额变更
    watcher.close()
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