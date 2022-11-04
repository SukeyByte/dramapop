const app = getApp()
const util = require('../../../util/util.js')
const footdata = require('../../student/studentFootData.js')
Page({
  data: {
    StatusBar: app.globalData.StatusBar,
    CustomBar: app.globalData.CustomBar,
    Custom: app.globalData.Custom,
    TabCur: 0,
    MainCur: 0,
    VerticalNavTop: 0,
    pageCode: null,
    hasUserInfo: false,
    dataList: [],
    list: [],
    pageIndex: 1,
    bannerImageList: [{
      id: 1,
      imgsrc: 'cloud://mallforgym-i8imy.6d61-mallforgym-i8imy-1300202136/banner/1.jpg'
    }, {
      id: 2,
      imgsrc: 'cloud://mallforgym-i8imy.6d61-mallforgym-i8imy-1300202136/banner/2.jpg'
    }, {
      id: 3,
      imgsrc: 'cloud://mallforgym-i8imy.6d61-mallforgym-i8imy-1300202136/banner/3.jpg'
    }],
    load: true,
    iconList: [{
      icon: 'present',
      color: 'blue',
      badge: 120,
      name: '我发布的团购',
      ncu: true
    }, {
      icon: 'remind',
      color: 'olive',
      badge: 1,
      name: '我参与的团购',
      ncu: true
    }, {
      icon: 'share',
      color: 'pink',
      badge: 2,
      name: '我要发布团购',
      ncu: true
    }]
  },

  onLoad() {
    // if (app.globalData.userInfo == null) {
    //   wx.redirectTo({
    //     url: '../mine/mine',
    //   })
    //   wx.showToast({
    //     icon: "none",
    //     title: '请登陆哦~',
    //   })

    //   return
    // }
    wx.cloud.callFunction({
      name: 'login',
      data: {},
      success: res => {
        console.log('[云函数] [login] user openid: ', res.result.openid)
        app.globalData.openid = res.result.openid
      },
      fail: err => {
        console.error('[云函数] [login] 调用失败', err)
      }
    })
    wx.showLoading({
      title: '加载中...',
      mask: true
    });
    footdata.footDataList('saleInfo').then(res => {
      this.setData({
        dataList: res
      })
      console.log(this.data.dataList)
    })
    let that = this
    this.getDatas()



  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {
    console.log("1111111");
    wx.showNavigationBarLoading() //在标题栏中显示加载 
    setTimeout(() => {
      console.log("222222");
      wx.hideNavigationBarLoading() //完成停止加载 
      console.log("33333");
      wx.stopPullDownRefresh() //停止下拉刷新 
    }, 2000)
  },
  scrollToLower: function() {
    this.getDatas()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    this.getDatas()
    setTimeout(() => {

    }, 2000)
  },

  onReady() {
    wx.hideLoading()
  },
  redictway(e) {
    console.log(e)
    console.log(e.currentTarget.dataset.badge)
    let badge = e.currentTarget.dataset.badge
    if (badge == 120) {
      wx.navigateTo({
        url: '../mySended/mySended',
      })
    } else if (badge == 1) {
      wx.navigateTo({
        url: '../myJoin/myJoin',
      })
    } else if (badge == 2) {
      wx.navigateTo({
        url: '/pages/student/push/push',
      })
    }
  },
  tabSelect(e) {
    this.setData({
      TabCur: e.currentTarget.dataset.id,
      MainCur: e.currentTarget.dataset.id,
      VerticalNavTop: (e.currentTarget.dataset.id - 1) * 50
    })
  },

  VerticalMain(e) {
    let that = this;
    let list = this.data.list;
    let tabHeight = 0;
    if (this.data.load) {
      for (let i = 0; i < list.length; i++) {
        let view = wx.createSelectorQuery().select("#main-" + list[i].id);
        view.fields({
          size: true
        }, data => {
          list[i].top = tabHeight;
          tabHeight = tabHeight;
          list[i].bottom = tabHeight;
        }).exec();
      }
      that.setData({
        load: false,
        list: list
      })
    }
    let scrollTop = e.detail.scrollTop + 20;
    for (let i = 0; i < list.length; i++) {
      if (scrollTop > list[i].top && scrollTop < list[i].bottom) {
        that.setData({
          VerticalNavTop: (list[i].id - 1) * 50,
          TabCur: list[i].id
        })
        return false
      }
    }
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

  showDetails(e) {
    console.log(e.currentTarget.dataset.id)
    wx.navigateTo({
      url: '../detail/detail?id=' + e.currentTarget.dataset.id,
    })
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },

  tobanner(e) {
    console.log(e.currentTarget.dataset.id)
    if (e.currentTarget.dataset.id == 1 || 2 || 3) {
      wx.navigateTo({
        url: '../banner/banner?id=' + e.currentTarget.dataset.id,
      })
    }

  },


  async getDatas() {
    const MAX_LIMIT = 15;
    let that = this
    var index = that.data.pageIndex
    if (index < 0) return
    const db = wx.cloud.database()
    const _ = db.command
    const data = that.data.list
    var date = new Date()
    let coatchInfo = await db.collection('ItemDetails').where({
      startTime: _.lte(date),
      endTime: _.gte(date),
      examineType: 0,
      status: 1
    }).orderBy('createDate', 'asc').skip((index - 1) * MAX_LIMIT).limit(MAX_LIMIT).get()
    if (coatchInfo.length < 1) {
      this.setData({
        pageIndex: 0
      })
      return
    }
    index++
    for (let i = 0; i < coatchInfo.data.length; i++) {
      data.push(coatchInfo.data[i])
    }
    this.setData({
      list: data,
      pageIndex: index
    })

  },

})