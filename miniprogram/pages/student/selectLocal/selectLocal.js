const app = getApp()
var time = require('../../../util/now.js')
const language = require('../../../util/getLanguageKeyByPage.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    pageCode: null,
    data: '',
    locate: [],
    selectItem: '',
    itemId: '',
    itemName: '',
    pageIndex: 1,
    price :0
  },
  /** 
   * 生命周期函数--监听页面加载 
   */
  onLoad: function (options) {
    this.data.itemId = options.itemId
    this.data.itemName = options.itemName
    this.data.price = options.price
    var that = this
    const db = wx.cloud.database().collection('UserLocate')
    db.get().then(res => {
      that.setData({
        locate: res.data
      })
    })
    language.getLanguage('selectLocal').then(res => {
      console.log(res)
      this.setData({
        pageCode: res
      })
    })

  },
  ChangeSelect: function(e) {
    console.log(e.currentTarget.dataset.item)
    this.setData({
      selectItem: e.currentTarget.dataset.item
    })
    
  },

  Confirm() {
    var that = this
    if (!that.data.selectItem) {
      wx.showModal({
        title: ' ',
        content: that.data.pageCode.index005,
        cancelText: that.data.pageCode.index006,
        confirmText: that.data.pageCode.index007,
      })
      return;
    }
    let moeny = that.data.price * 100;
    var order = app.globalData.openid.substring(3, 10) + new Date().getTime()
    wx.cloud.callFunction({
      name: "wechat_pay",
      data: {
        orderid: order,
        money: moeny,
        name: that.data.itemName + that.data.pageCode.index008
      },
      success(res) {
        console.log(that.data.pageCode.index009, res.result)
        that.pay(res.result, order, moeny)
      },
      fail(res) {
        wx.showToast({
          icon: 'none',
          title: that.data.pageCode.index010,
        })
        console.log("提交失败", res)
      },
      complete: res => {
        wx.hideLoading()
      }
    })
  },
  pay(payData, order, moeny) {
    var that = this
    wx.requestPayment({
      timeStamp: payData.timeStamp,
      nonceStr: payData.nonceStr,
      package: payData.package,
      signType: 'MD5',
      paySign: payData.paySign, //签名
      success(res) {
        console.log(that.data.pageCode.index011, res)
        const db = wx.cloud.database().collection('ItemOrder')
        var date = new Date()
        var year = date.getFullYear()
        var month = date.getMonth() + 1
        var day = date.getDate()
        var hour = date.getHours()
        var minute = date.getMinutes()
        var second = date.getSeconds()
        let now = year + '-' + month + '-' + day + ' ' + hour + ':' + minute
        db.add({
          data: {
            userId: app.globalData.openId,
            itemId: that.data.itemId,
            createTime: now,
            order: order,
            money: moeny,
            title: that.data.itemName
          },
          success: function (res) {
            that.addselect(order)
            console.log(res)
            wx.showToast({
              title: that.data.pageCode.index012,
            })
            wx.redirectTo({
              url: '../index/Index',
            })
          }
        })

      },
      fail(res) {
        console.log(that.data.pageCode.index013, res)
      },
      complete(res) {
        console.log(that.data.pageCode.index014, res)
      }
    })
  }, addselect(orderId){
    let that = this 
    const db = wx.cloud.database().collection('JoinItems')
    db.add({
      data: {
        userId: app.globalData.openid,
        itemId: that.data.itemId,
        createTime: time.now,
        itemName: that.data.itemName,
        userInfo: app.globalData.userInfo,
        locateid: that.data.selectItem,
        orderId: orderId,
        price: that.data.price,//定价
        payment:0,//尾款
        paymentOrderId:"",//尾款的支付单号
        payStatus:1     // 1 支付定价  2 等待支付尾款 3 已经付尾款  
      },
      success: function (res) {
        that.setData({
          joincount: that.data.joincount + 1,
        })
        wx.showToast({
          title: that.data.pageCode.index015,
        })
        wx.redirectTo({
          url: '../saleInfo/saleInfo',
        })
      },
      fail: err => {
        wx.showToast({
          icon: 'none',
          title: that.data.pageCode.index016,
        })
      }
    })
  },

  addNewLocal() {
    wx.navigateTo({
      url: '../addLocal/addLocal?itemId=' + this.data.itemId + '&itemName=' + this.data.itemName+'&price='+this.data.price,
    })
  },
  deleteItem: function(e) {
    var that = this
    console.log(e.currentTarget.dataset.item)
    wx.showLoading({
      title: that.data.pageCode.index017,
    })
    const db = wx.cloud.database()
    db.collection('UserLocate').doc(e.currentTarget.dataset.item._id).remove({
      success: res => {
        console.log(res)
        wx.showToast({
          title: that.data.pageCode.index018,
        })
        const db = wx.cloud.database().collection('UserLocate')
        db.get().then(res => {
          that.setData({
            locate: res.data
          })
        })
      },
      fail: err => {
        wx.showToast({
          icon: 'none',
          title: that.data.pageCode.index019,
        })
        console.error('[数据库] [删除记录] 失败：', err)
      },
      complete: res => {
        wx.hideLoading()
      }

    })

  }

})