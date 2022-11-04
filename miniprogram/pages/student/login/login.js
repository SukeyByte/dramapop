const storage = require('../../../util/storageControl.js')
const img = require('../../../util/getimagesrc.js')
const app = getApp()
Page({

  /**
   * Page initial data
   */
  data: {
    imgsrc: img.logosrc(),
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    userInfo: null,
    hasUserInfo: false,
    needNumber: true,
    mobile: null,
    inputnumber: true,
    openid: null,
    loadModal: false,
    loadingtext: ''
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
   * Lifecycle function--Called when page load
   */
  onLoad: function (options) {

  },

  inputnumber: function (e) {
    console.log(e)
    this.setData({
      mobile: e.detail.value
    })
  },

  confirm: function (e) {
    if (this.data.mobile == null || this.data.mobile == undefined) {
      wx.showToast({
        title: '请填写电话号码哦',
      })
    } else {
      storage.setStorageSyncHour('phoneNumber', this.data.mobile)
      this.saveData()
    }
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

  },
  cancel: function () {
    wx.navigateBack()
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


  async getUserInfo(e) {
    console.log(e)
    this.showLoading('获取基本信息...')
    let that = this
    this.data.userInfo = await wx.getUserProfile({
      desc: '用于完善会员资料信息', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
      success: (res) => {
        console.log(res)
        that.getOpenId()
        this.setData({
          needNumber: false
        })
        app.globalData.userInfo = res.userInfo
        that.data.hasUserInfo = true
        storage.setStorageSyncHour('userInfo', res.userInfo, 730)
        that.data.userInfo = res.userInfo
        return res.userInfo
      },
      fail: err => {
        console.log(err)
      },
      complete(res) {
        that.hideLoading()
      }
    })
  },

  async getOpenId() {
    this.data.openid = await wx.cloud.callFunction({
      name: 'getOpenId',
      data: {},
    }).then(res => {
      console.log(res)
      console.log('[云函数] [login] user openid: ', res.result.openid)
      app.globalData.openid = res.result.openid
      //设置一个月的过期时间
      storage.setStorageSyncHour('openid', res.result.openid, 730)
      return res.result.openid

    }).catch(err => {
      console.log(err)
      return err
    })
    console.log(this.data.openid)
    this.hideLoading()
  },

  async getPhoneNumber(e) {
    console.log(e)
    if (e.detail.errMsg == 'getPhoneNumber:fail user deny') {
      this.setData({
        inputnumber: false
      })
    }
    else {
      var that = this;
      this.showLoading('获取手机号...')
      this.data.mobile = await wx.cloud.callFunction({
        name: 'getMobile',
        data: {
          weRunData: wx.cloud.CloudID(e.detail.cloudID),
        }
      }).then(res => {
        return res.result
      }).catch(err => {
        console.error(err);
      });
      storage.setStorageSyncHour('phoneNumber', this.data.mobile, 730)
      this.hideLoading()
      this.saveData()
    }
  },

  saveData() {
    this.showLoading('正记录数据')
    let that = this
    console.log(that.data)
    wx.cloud.callFunction({
      name: 'addUserInfo',
      data: {
        userInfo: that.data.userInfo,
        phonenumber: that.data.mobile,
        openid: that.data.openid
      }
    }).then(res => {
      console.log(res)
      storage.setStorageSyncHour("loginStatus", true, 730)
      this.hideLoading()
      wx.navigateBack()
      that.setBuy(app.globalData.sallerinfo._id, that.data.openid, that.data.mobile)
    }).catch(err => {
      console.error(err);
      this.hideLoading()
      wx.navigateBack()
    });
  },
  async setBuy(sellerId, openid, phone) {
    wx.cloud.callFunction({
      name: 'setBuyByClient',
      data: {
        sellerId: sellerId,
        phone: phone,
        openId: openid
      }
    }).then(res => {
      console.log('云函数setBuyByClient 成功' + res)
    }).catch(err => {
      console.log('云函数setBuyByClient 失败' + err)
    });
  }
})