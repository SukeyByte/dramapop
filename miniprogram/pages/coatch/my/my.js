const footdata = require('../../coatch/coatchFootData.js')
const language = require('../../../util/getLanguageKeyByPage.js')
const app = getApp()
Component({
  options: {
    addGlobalClass: true,
  },

  /**
   * 组件的属性列表
   */
  properties: {
    pageCode: {
      type: [Array],
      default: []
    },
  },
  /**
   * Page initial data
   */
  data: {
    dataList: [],
    isLogin: false,
    avatarUrl: 'https://6d61-mallforgym-i8imy-1300202136.tcb.qcloud.la/unlogin.png?sign=452d413f0998dff27c0b923d5465f1fe&t=1568099666',
    nickName: '',
    userInfo: null,
    coatchInfo: null,
    loadModal: false,
    loadingtext: ''
  },


  /**
   * 组件的方法列表
   */
  methods: {
    onGetUserInfo: function (e) {
      if (!this.logged && e.detail.userInfo) {
        this.setData({
          logged: true,
          avatarUrl: e.detail.userInfo.avatarUrl,
          nickName: e.detail.userInfo.nickName,
          userInfo: e.detail.userInfo
        })
        console.log(this.data.userInfo)
      }
    },

    login: function () {
      wx.navigateTo({
        url: '/pages/student/login/login',
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

    startPackage: function () {
      wx.navigateTo({
        url: '../classPackage/package?coatchid=' + this.data.coatchInfo._openid + '&coatchname=' + this.data.coatchInfo.name,
      })
    },

    packageNeedKnow: function () {
      if (this.data.coatchInfo.seller == null) {
        wx.navigateTo({
          url: '/pages/coatch/bindingSeller/selectSeller?id=' + '',
        })
      } else {
        wx.navigateTo({
          url: '/pages/coatch/bindingSeller/selectSeller?id=' + this.data.coatchInfo.seller._id,
        })
      }
    },

    packageList: function () {
      wx.navigateTo({
        url: '../packageList/packageList'
      })
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
    }
  },

  lifetimes: {
    // 生命周期函数，可以为函数，或一个在methods段中定义的方法名
    attached: function () {

    },
    ready() {
      const db = wx.cloud.database()
      db.collection('Coatch').where({
        _openid: app.globalData.openid
      }).get().then(res => {
        console.log(res)
        this.setData({
          coatchInfo: res.data[0]
        })
      })
    },
    moved: function () {},
    detached: function () {},
  },

  pageLifetimes: {
    // 组件所在页面的生命周期函数
    show: function () {},
    hide: function () {},
    resize: function () {},
  },
})