const ENVDEV = 'mail-stg-oboxi'//'mallforgym-i8imy'
const ENVPROD =  'mail-stg-oboxi'
App({
  onLaunch: function () {

    //获取系统信息更改顶部样式
    wx.getSystemInfo({
      success: e => {
        this.globalData.StatusBar = e.statusBarHeight;
        let custom = wx.getMenuButtonBoundingClientRect();
        this.globalData.Custom = custom;
        this.globalData.CustomBar = custom.bottom + custom.top - e.statusBarHeight;
        let ENV = ENVDEV
        if (e.platform == "devtools") {
          this.globalData.systemInfo = 0
          ENV = ENVDEV
        } else if (e.platform == "ios") {
          this.globalData.systemInfo = 1
          ENV = ENVPROD
        } else if (e.platform == "android") {
          this.globalData.systemInfo = 2
          ENV = ENVPROD
        }
        //初始化云函数
        wx.cloud.init({
          env: ENV,
          traceUser: true,
        })
      }
    })
    //获取本地缓存的用户信息，过期时间为一个月
    const language = require('./util/storageControl.js')
    this.globalData.openid = language.getStorageSyncTime('openid')
    this.globalData.userInfo = language.getStorageSyncTime('userInfo')
  },
  globalData: {
    userInfo: null,
    openid: null,
    languageSet: 'zh-CN',
    sourceSite: 'PagingImage',
    sallerinfo: null,
    isSaller: 0,
    bannerList: [],
    activityList: [],
    systemInfo: 1
  },
})