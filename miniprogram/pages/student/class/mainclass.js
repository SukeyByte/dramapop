const footdata = require('../../student/studentFootData.js')
const language = require('../../../util/getLanguageKeyByPage.js')
var HB = require('../../../util/getDates.js');
const img = require('../../../util/getimagesrc.js')
const app = getApp()
const db = wx.cloud.database()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    blanksrc: img.blanksrc(),
    pageCode: null,
    resourceList: null,
    dataList: [],
    StatusBar: app.globalData.StatusBar,
    CustomBar: app.globalData.CustomBar,
    Custom: app.globalData.Custom,
    openid: app.globalData.openid,
    TabCur: 0,
    scrollLeft: 0,
    currentPage: 'single',
    dateArray: [],
    StartClinicDate: '',
    EndClinicDate: '',
    coatchArray: [],
    currentSelectDate: '',
    sourceList: [{
        "NoonName": "10:00-10:30",
        "Noon": 1,
      },
      {
        "NoonName": "10:30-11:00",
        "Noon": 2,
      },
      {
        "NoonName": "11:00-11:30",
        "Noon": 3,
      },
      {
        "NoonName": "11:30-12:00",
        "Noon": 4,
      },
      {
        "NoonName": "12:00-12:30",
        "Noon": 5,
      },
      {
        "NoonName": "12:30-13:00",
        "Noon": 6,
      },
      {
        "NoonName": "13:30-14:00",
        "Noon": 7,
      },
      {
        "NoonName": "14:00-14:30",
        "Noon": 8,
      },
      {
        "NoonName": "14:30-15:00",
        "Noon": 9,
      },
      {
        "NoonName": "15:30-16:00",
        "Noon": 10,
      },
      {
        "NoonName": "16:00-16:30",
        "Noon": 11,
      },
      {
        "NoonName": "16:30-17:00",
        "Noon": 12,
      },
      {
        "NoonName": "17:00-17:30",
        "Noon": 13,
      },
      {
        "NoonName": "17:30-18:00",
        "Noon": 14,
      },
      {
        "NoonName": "18:00-18:30",
        "Noon": 15,
      },
      {
        "NoonName": "18:30-19:00",
        "Noon": 16,
      },
      {
        "NoonName": "19:00-19:30",
        "Noon": 17,
      },
      {
        "NoonName": "19:30-20:00",
        "Noon": 18,
      },
      {
        "NoonName": "20:00-20:30",
        "Noon": 19,
      },
      {
        "NoonName": "20:30-21:00",
        "Noon": 20,
      },
      {
        "NoonName": "21:00-21:30",
        "Noon": 21,
      },
      {
        "NoonName": "21:30-22:00",
        "Noon": 22,
      },
      {
        "NoonName": "22:00-22:30",
        "Noon": 23,
      },
      {
        "NoonName": "22:30-23:00",
        "Noon": 24,
      },
      {
        "NoonName": "23:00-23:30",
        "Noon": 25,
      },
      {
        "NoonName": "23:30-00:00",
        "Noon": 26,
      }
    ],
    showDetail: false,
    selectItem: '',
    systemInfo: null,
    tmplIds: ['W9D9SN8cRFojxolRaKgcqkdMJ7Oqs3oFisUVOuZS9Vg'],
    loadModal: false,
    loadingtext: '',
    pageIndex: 1,
    total: 0,
    sellerId: null,
    type: 0,
    selectDate: null,
    MAX_LIMIT: 10
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

  getCurrentDate: function (e) {
    var timestamp = Date.parse(e);
    var date = new Date(timestamp);
    //获取年份  
    var Y = date.getFullYear();
    //获取月份  
    var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1);
    //获取当日日期 
    var D = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
    console.log(Y + '-' + M + '-' + D)
    return Y + '-' + M + '-' + D
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    footdata.footDataList('class').then(res => {
      this.setData({
        dataList: res
      })
    })

    this.isIOSOrAndroid()
    let seller = wx.getStorageSync('currentSaller')
    this.setData({
      sellerId: seller._id,
      sallerName: seller.addressName
    })
  },

  tabSelect(e) {
    this.setData({
      currentSelectDate: e.currentTarget.dataset.item.date,
      TabCur: e.currentTarget.dataset.id,
      scrollLeft: (e.currentTarget.dataset.id - 1) * 60,
      coatchArray: [],
      pageIndex: 1
    })
    this.selectData(e.currentTarget.dataset.item.date)
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    var that = this;
    language.getLanguage('class').then(res => {
      console.log(res)
      this.setData({
        pageCode: res
      })
    })

    wx.getSystemInfo({
      success: function (res) {
        let systemInfo = 0
        if (res.platform == "devtools") {
          that.data.StartClinicDate = that.getCurrentDate(new Date())
          that.data.EndClinicDate = that.getCurrentDate(new Date())
          systemInfo = 0

        } else if (res.platform == "ios") {
          that.data.StartClinicDate = that.getCurrentDate(new Date()).replace(/\-/g, "/")
          that.data.EndClinicDate = that.getCurrentDate(new Date()).replace(/\-/g, "/")
          systemInfo = 1
        } else if (res.platform == "android") {
          that.data.StartClinicDate = that.getCurrentDate(new Date())
          that.data.EndClinicDate = that.getCurrentDate(new Date())
          systemInfo = 2
        }
        that.data.systemInfo = systemInfo
        console.log('onload', that.data.StartClinicDate)
        that.data.currentSelectDate = that.data.StartClinicDate
        that.getSevenDays();
        console.log("system Type", res)
      }
    })

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
    console.log(this.data)
    if (this.data.total > (this.data.pageIndex * this.data.MAX_LIMIT)) {
      this.showLoading('正在整理器械...')
      this.data.pageIndex += 1
      this.loadData()
    }
  },

  compare: function compare(property) {
    return function (a, b) {
      var value1 = a[property];
      var value2 = b[property];
      return value1 - value2;
    }
  },
  getSevenDays: function () {
    var that = this;
    var daysArray = [];
    var dayDict = {};
    var weekNum = '';
    let dateArr = []
    dateArr = HB.getdatearr(this.data.StartClinicDate)
    this.data.StartClinicDate = dateArr[0]
    this.selectData(that.data.StartClinicDate)

    for (var i = 0; i < dateArr.length; i++) {
      weekNum = this.getWeekNum(this.getWeekByDay(dateArr[i]));
      dayDict = {
        "date": dateArr[i],
        "date_text": dateArr[i].substring(5, 10),
        "weekName": this.getWeekByDay(dateArr[i]),
        "weekNum": weekNum
      };
      daysArray.push(dayDict);
    }

    this.setData({
      dateArray: daysArray
    });
  },
  isIOSOrAndroid: function () {

  },
  getWeekNum: function (ele) {
    var num;
    switch (ele) {
      case '一':
        num = 0;
        break;
      case '二':
        num = 1;
        break;
      case '三':
        num = 2;
        break;
      case '四':
        num = 3;
        break;
      case '五':
        num = 4;
        break;
      case '六':
        num = 5;
        break;
      case '日':
        num = 6;
        break;
    }
    return num;
  },
  getWeekByDay: function (value) {
    var day = new Date(Date.parse(value.replace(/-/g, '/'))); //将日期值格式化  
    var today = new Array("日", "一", "二", "三", "四", "五", "六"); //创建星期数组  
    return today[day.getDay()];
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

  navTobatch: function (e) {

    this.setData({
      TabCur: 0,
      currentSelectDate: this.data.StartClinicDate,
      currentPage: e.currentTarget.dataset.name,
      coatchInfo: [],
      pageIndex: 1,
      coatchArray: []
    })
    this.selectData(this.data.StartClinicDate)
  },

  async selectData(e) {
    let that = this
    that.showLoading('正在整理器械...')

    //一次取出所有数据
    let type = 0;
    switch (that.data.currentPage) {
      case 'single':
        type = 1
        break;
      case 'batch':
        type = 2
        break;
      case 'spell':
        type = 3
        break;
      default:
        type = 0
    }
    this.data.type = type
    this.data.selectDate = e
    //先取出集合的总数
    let countResult = await db.collection('ClassInfo').where({
      type: type,
      date: e,
      sellerId: this.data.sellerId
    }).count()
    this.data.total = countResult.total
    this.loadData()
  },

  loadData() {
    let that = this
    wx.cloud.callFunction({
      name: 'getClassByClient',
      data: {
        'type': this.data.type,
        'date': this.data.selectDate,
        'sellerId': this.data.sellerId,
        'pageIndex': this.data.pageIndex
      },
      success: res => {
        console.log('[云函数] [getClassByClient] result: ', res.result);
        that.toDateClass(res.result);
      },
      fail: err => {
        console.error('[云函数] [getClassByClient] 调用失败', err);
        that.hideLoading()
        wx.navigateBack({
          delta: 0,
        })
        return err;
      },
      complete(res) {
        return res
      }
    })
  },

  coatchDetail: function (e) {
    console.log(e.currentTarget.dataset.item)
    this.setData({
      showDetail: true,
      selectItem: e.currentTarget.dataset.item
    })
  },

  hideModal: function (e) {
    this.setData({
      showDetail: false
    })
  },
  async toOrderDetails(e) {
    //判断登陆
    wx.getSetting({
      success: res => {
        if (!res.authSetting['scope.userInfo']) {
          wx.redirectTo({
            url: '/pages/student/mine/mine',
          })
          return
        }
      },
      fail: res => {
        return
      }
    })
    let that = this

    const db = wx.cloud.database()
    const _ = db.command
    const coatchInfoList = await db.collection('ClientByClass').where({
      classId: e.currentTarget.dataset.classid,
      status: _.neq(2)
    }).get().then(res => {
      return res
    })
    if (coatchInfoList.data.length >= e.currentTarget.dataset.total && coatchInfoList.data.length > 0) {
      wx.showToast({
        title: '已经被预约满',
        icon: 'none'
      })
      return false;
    }
    let coatchInfoStatsList = await db.collection('ClientByClass').where({
      classId: e.currentTarget.dataset.classid,
      status: 2
    }).get().then(res => {
      return res
    })
    if (coatchInfoStatsList.data.length >= e.currentTarget.dataset.total && coatchInfoStatsList.data.length > 0) {
      wx.showToast({
        title: '已经被教练取消',
        icon: 'none'
      })
      return false;
    }

    let isStatus = false;
    for (let j = 0; j < coatchInfoList.data.length; j++) {
      if (coatchInfoList.data[j].openId == app.globalData.openid) { //判断是否预定
        isStatus = true;
        break;
      }
    }
    if (isStatus) {
      wx.showToast({
        title: '你已经预定',
        icon: 'none'
      })
      return false;
    }
    wx.requestSubscribeMessage({
      tmplIds: ['K42vDO5R4i72tcmUlWFsUC_3Qelgq66cEp2Z7UQFJ9Y'],
      success(res) {
        if (res.confirm) {
          //调用订阅消息
          console.log('用户点击确定');
        } else if (res.cancel) {
          console.log('用户点击取消');
        }
      },
      fail(res) {
        console.log('用户点击取消');
        console.log(that.tmplIds + res.errMsg + "   /n" + res.errCode)
      },
      complete: (errMsg) => {
        wx.navigateTo({
          url: '/pages/student/classOrderDetails/classOrderDetails?classId=' + e.currentTarget.dataset.classid,
        })
      }
    })

  },
  async toDateClass(opents) {
    const tasks = this.data.coatchArray
    //单条数据处理，过滤过期的单次循环信息
    const classList = opents.list
    for (let i = 0; i < classList.length; i++) {
      const item = classList[i]
      item.coatchTime = item.noonTime
      let makeStatus = 1 //预约按钮状态   1  可以预约  2  预约过了   3 已经满人了
      let userList = item.userList
      if (userList.length >= item.total) { //判断是否满员
        makeStatus = 3
      } else {
        for (let j = 0; j < userList.length; j++) {
          if (userList[j].openid == app.globalData.openid) { //判断是否预定
            makeStatus = 2
            break;
          }
        }
      }
      item.makeStatus = makeStatus
      tasks.push(item)
    }
    this.setData({
      coatchArray: tasks
    })
    this.hideLoading()
  },
  ViewImage(e) {
    console.log(e)
    wx.previewImage({
      urls: this.data.selectItem.coatchInfo.image,
      current: e.currentTarget.dataset.url
    });
  },

  search() {
    wx.navigateTo({
      url: '../searchClassPage/search',
    })
  }
})