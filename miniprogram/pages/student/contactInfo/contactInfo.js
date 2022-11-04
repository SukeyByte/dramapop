const app = getApp()
const language = require('../../../util/getLanguageKeyByPage.js')
var time = require('../../../util/now.js')

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
    conNum: '',
    money: ''
  },
  ChangeSelect: function(e) {
    console.log(e.currentTarget.dataset.item)
    this.setData({
      selectItem: e.currentTarget.dataset.item
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.data.itemId = options.itemId
    this.data.itemName = options.itemName
    this.data.conNum = options.conNum
    this.data.money = options.money
    language.getLanguage('contactInfo').then(res => {
      console.log(res)
      this.setData({
        pageCode: res
      })
    })
    
  },
  buy() {
    var that = this
    if (!that.data.selectItem) {
      wx.showModal({
        title: ' ',
        content: that.data.pageCode.index009,
        cancelText: '取消',
        confirmText: '确定',
      })
      return;
    }

    wx.showLoading({
      title: that.data.pageCode.index010,
    })

    let moeny = that.data.money * 100 * that.data.conNum;
    var order = app.globalData.openid.substring(3, 10) + new Date().getTime()
    wx.cloud.callFunction({
      name: "wechat_pay",
      data: {
        orderid: order,
        money: moeny,
        name: that.data.itemName
      },
      success(res) {
        console.log("提交成功", res.result)
        that.pay(res.result, order, moeny)
      },
      fail(res) {
        wx.showToast({
          icon: 'none',
          title: that.data.pageCode.index011,
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
        console.log("支付成功", res)
        const db = wx.cloud.database().collection('OrderInfo')
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
          success: function(res) {
            that.addData(order)
            if (that.data.itemId=='3'){
              that.addCardCount()
            }else{
              console.log(res)
              wx.showToast({
                title: that.data.pageCode.index012,
              })
              wx.redirectTo({
                url: '../index/Index',
              })
            }
          }
        })
      },
      fail(res) {
        console.log("支付失败", res)
      },
      complete(res) {
        console.log("支付完成", res)
      }
    })
  },
  addCardCount(){//新增卡片使用数量
    var that = this
    wx.cloud.callFunction({
      name: "addCardCount",
      data: {
        itemId: that.data.itemId,
        num: that.data.conNum
      },
      success(res) {
        wx.showToast({
          title: that.data.pageCode.index012,
        })
        wx.redirectTo({
          url: '../index/Index',
        })
        console.log("插入卡片数据成功", res)
      },
      fail(res) {
        console.log("插入卡片数据失败", res)
      }
    })
  },
  addData(order) {
    var that = this
    const db = wx.cloud.database().collection('CardOrder')
    const dbItem = wx.cloud.database().collection('CardDetail')
    let amount = that.data.conNum
    db.add({
      data: {
        userId: app.globalData.openid,
        itemId: that.data.itemId,
        createTime: time.now,
        itemName: that.data.itemName,
        amount: amount,
        totalMoney: amount * that.data.money,
        money: that.data.money,
        userInfo: app.globalData.userInfo,
        locateid: that.data.selectItem
      },
      success: function(res) {
        for (var i = 0; i < amount; i++) {
          dbItem.add({
            data: {
              itemId: that.data.itemId,
              userId: app.globalData.openid,
              order: order
            }
          })
        }
        wx.showToast({
          title: that.data.pageCode.index013,
        })
        //wx.redirectTo({
        // url: '../index/index',
        //}) 
        console.log('更新成功', res)
      },
      fail: err => {
        wx.showToast({
          icon: 'none',
          title: that.data.pageCode.index014,
        })
      }
    })
  },
  addNewLocal() {
    wx.navigateTo({
      url: '../contactInfo/add?itemId=' + this.data.itemId + '&itemName=' + this.data.itemName + "&conNum=" +
        this.data.conNum + "&money=" + this.data.money,
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    var that = this
    const db = wx.cloud.database().collection('ContactInfo')
    db.get().then(res => {
      that.setData({
        locate: res.data
      })
    })
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },

  deleteItem: function(e) {
    var that = this
    console.log(e.currentTarget.dataset.item)
    wx.showLoading({
      title: that.data.pageCode.index015,
    })
    const db = wx.cloud.database()
    db.collection('ContactInfo').doc(e.currentTarget.dataset.item._id).remove({
      success: res => {
        console.log(res)
        wx.showToast({
          title: that.data.pageCode.index016,
        })
        const db = wx.cloud.database().collection('ContactInfo')
        db.get().then(res => {
          that.setData({
            locate: res.data
          })
        })
      },
      fail: err => {
        wx.showToast({
          icon: 'none',
          title: that.data.pageCode.index017,
        })
        console.error('[数据库] [删除记录] 失败：', err)
      },
      complete: res => {
        wx.hideLoading()
      }

    })

  }

})