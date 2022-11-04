const footdata = require('../../student/studentFootData.js')
const storage = require('../../../util/storageControl.js')
const parama = require('../../../util/getUsefulParama.js')

const app = getApp()
const db = wx.cloud.database()
Page({

  /**
   * Page initial data
   */
  data: {
    isLogin: false,
    avatarUrl: 'https://6d61-mallforgym-i8imy-1300202136.tcb.qcloud.la/unlogin.png?sign=452d413f0998dff27c0b923d5465f1fe&t=1568099666',
    dataList: [],
    user: null,
    count: 0,
    cardNo: 0,
    qrCodeFlag: true,
    scantxt: '我是店员'
  },

  /**
   * Lifecycle function--Called when page load
   */
  onLoad: function (options) {
    footdata.footDataList('mine').then(res => {
      this.setData({
        dataList: res
      })
    })
    if (app.globalData.isSaller == 1) {
      this.setData({
        scantxt: '扫码结算'
      })
    }

  },

  onGetUserInfo: function (e) {
    if (!this.logged && e.detail.userInfo) {
      this.setData({
        logged: true,
        avatarUrl: e.detail.userInfo.avatarUrl,
        user: e.detail.userInfo,
        userInfo: e.detail.userInfo
      })
    }
  },

  login: function () {
    wx.navigateTo({
      url: '../login/login',
    })
  },

  async getAmount() {
    let that = this
    //开始监听余额变更
    db.collection('Client').where({
      openid: app.globalData.openid
    }).get().then(res => {
      console.log(res)
      that.setData({
        count: res.data[0].amount
      })
      console.log(res.data[0].amount)
      //return res.data
    }).catch(err => {
      return err
    })

    db.collection('BuyCardByClient').where({
      userId: app.globalData.openid,
    }).count().then(res => {
      console.log(res)
      that.setData({
        cardNo: res.total
      })
      console.log(res.total)
      //return res.data
    }).catch(err => {
      return err
    })
  },
  /**
   * Lifecycle function--Called when page is initially rendered
   */
  onReady: function () {

  },

  /**
   * Lifecycle function--Called when page show
   */
  onShow: function () {
    var isLogin = storage.getStorageSyncTime("loginStatus", null)
    this.setData({
      isLogin: isLogin,
      user: app.globalData.userInfo,
    })
    if (app.globalData.userInfo != null) {
      this.setData({
        avatarUrl: app.globalData.userInfo.avatarUrl
      })
      //初始化余额信息
      this.getAmount()
    }

    //初始化当前店铺信息
    parama.getSaller().then(res => {
      console.log(res)
      app.globalData.sallerinfo = res
    }).catch(err=>{
      console.log(err)
    })

    //初始化店员信息
    parama.getSellerUser().then(res => {
      console.log(res)
      app.globalData.isSaller = res
      if (res == 1) {
        this.setData({
          scantxt: '扫码结算'
        })
      }
      return res
    })

  },

  /**
   * Lifecycle function--Called when page hide
   */
  onHide: function () {

  },

  /**
   * Lifecycle function--Called when page unload
   */
  onUnload: function () {

  },

  /**
   * Page event handler function--Called when user drop down
   */
  onPullDownRefresh: function () {

  },

  /**
   * Called when page reach bottom
   */
  onReachBottom: function () {

  },

  /**
   * Called when user click on the top right corner to share
   */
  onShareAppMessage: function () {

  },

  gotohome() {
    wx.redirectTo({
      url: '../index/index',
    })
  },

  gotopush() {
    wx.redirectTo({
      url: '../push/push',
    })
  },

  gotomine() {
    wx.redirectTo({
      url: '../mine/mine',
    })
  },

  async navToCoatch() {
    if (app.globalData.userInfo == null) {
      wx.redirectTo({
        url: '../mine/mine',
      })
      wx.showToast({
        icon: "none",
        title: '请登陆哦~',
      })

      return
    }

    console.log(app.globalData.openid)
    let data = await db.collection('Coatch')
      .where({
        _openid: app.globalData.openid
      })
      .get().then(res => {
        return res
      })
    console.log(data)
    if (data != null && data.data.length > 0) {
      wx.navigateTo({
        url: '/pages/coatch/index/index',
      })
    } else {
      let dataapply = await db.collection('CoatchApply')
        .where({
          _openid: app.globalData.openid
        })
        .get().then(res => {
          return res
        })
      console.log(dataapply)
      if (dataapply.data.length > 0) {
        wx.showToast({
          icon: 'none',
          title: '您已经成功申请，请等待人工审核',
        })
      } else {
        wx.navigateTo({
          url: '/pages/coatch/apply/apply',
        })
      }
    }

  },

  scanQrCode() {
    if (app.globalData.userInfo == null) {
      wx.showToast({
        icon: "none",
        title: '请登陆哦~',
      })
      return
    }
    if (app.globalData.isSaller == 1) {
      wx.scanCode({
        onlyFromCamera: true,
      }).then(res => {
        let result = res.result.split('~')
        console.log(result)
        if (result[2] == 'willstart') {
          db.collection('SumTimelog').doc(result[1]).update({
            data: {
              'begTime': new Date().getTime()
            },
          }).then(res => {
            wx.showToast({
              title: '开始成功',
            })
            return res
          }).catch(err => {
            return err
          })
          return
        }
        let maketime = new Date().getTime() - result[2]
        let status = 0
        console.log(maketime / 1000 / 60)
        if ((maketime / 1000 / 60) <= 10) {
          status = 1//只运动了10分钟则不计费
        }
        db.collection('SumTimelog').doc(result[1]).update({
          data: {
            'endTime': new Date().getTime(),
            'makeTime': maketime / 1000 / 60,
            'status': status
          },
        }).then(res => {
          wx.showToast({
            title: '结算完成',
          })
          return res
        }).catch(err => {
          return err
        })
      })
    }
    else {
      let phonenumber = storage.getStorageSyncTime('phoneNumber')
      wx.cloud.callFunction({
        name: 'addUserBySeller',
        data: {
          'userId': app.globalData.openid,
          'sellerId': app.globalData.sallerinfo._id,
          'phonenumber': phonenumber
        },
        success: res => {
          console.log('[云函数] [addUserBySeller] result: ', res.result)
          wx.showToast({
            title: '请等待审核',
          })
        },
        fail: err => {
          console.error('[云函数] [updateClassStatus] 调用失败', err)
        },
        complete: res => {
        }
      })
    }
  },

  charge() {
    if (app.globalData.openid == null) {
      wx.showToast({
        title: '请先登录哦',
        icon: null
      })
      return
    }
    wx.navigateTo({
      url: "../recharge/recharge"
    })
  },

  logout() {
    wx.clearStorageSync()
    app.globalData.openid = null
    wx.showToast({
      title: '已退出'
    })
    this.setData({
      isLogin: false,
      avatarUrl: 'https://6d61-mallforgym-i8imy-1300202136.tcb.qcloud.la/unlogin.png?sign=452d413f0998dff27c0b923d5465f1fe&t=1568099666',
    })
  }
})