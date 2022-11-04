const drawQrcode = require("../../../util/weapp-qrcode.js")
const storage = require('../../../util/storageControl.js')
const parama = require('../../../util/getUsefulParama.js')
const time = require('../../../util/getTime.js')
const img = require('../../../util/getimagesrc.js')
const caculete = require('../../../util/getCaculeteMoney.js')


const app = getApp()
const db = wx.cloud.database()
const _ = db.command
let watcher = null

var init;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgsrc: img.logosrc(),
    startTime: '',
    isStarted: false,
    text: "",
    //小程序计时器
    hour: 0,
    minute: 0,
    second: 0,
    millisecond: 0,
    timecount: '00:00:00',
    cost: 0,
    flag: 1,
    endtime: "",
    docid: '',
    loadModal: false,
    twoHourMoney: 0,
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

  async caculatemoney(begTime, endTime, dataid) {
    this.showLoading('正在核算金额')
    //款项未结清
    let sallerinfo = storage.getStorageSyncTime('currentSaller')
    let money = await caculete.caculete(begTime, endTime, sallerinfo._id)
    console.log(money)
    this.setData({
      twoHourMoney: money
    })
    this.hideLoading()
    //计算完成后重定向到指定页面
    wx.redirectTo({
      url: '/pages/student/payPage/payPage?money=' + money + '&title=种马波普健身房健身&foreignId=' + dataid + '&useType=0&payType=4&redirect=/pages/student/sporttime/sportTime',
    })

  },

  //监听数据更改
  async startWatcher(dataid) {
    var that = this
    if (dataid != null && dataid != undefined) {
      watcher = db.collection('SumTimelog').doc(dataid).watch({
        onChange: function (snapshot) {
          console.log('snapshot', snapshot)
          //如果有变化，取第一条
          if (snapshot.docChanges.length > 0) {
            let currentdata = snapshot.docChanges[0].doc
            if (currentdata.status == 1) {
              return;
            }
            if (currentdata.begTime != null && currentdata.endTime == null) {
              console.log('customer has start soprt')
              //结束时间为空，则开始计时
              that.setData({
                isStarted: true,
              })
              that.startwithtime(currentdata.begTime, currentdata._id)
              that.starttimer()
            } else if (currentdata.begTime != null && currentdata.endTime != null) {
              console.log('customer has end soprt')
              that.setData({
                isStarted: false,
              })
              that.Reset();
              //结束计时后，如果时间大于10分钟
              if (currentdata.status == 0) {
                that.caculatemoney(currentdata.begTime, currentdata.endTime, currentdata._id)
              }
              else {
                wx.reLaunch({
                  url: '/pages/student/index/Index',
                })
              }
            }
          }
        },
        onError: function (err) {
          console.error('the watch closed because of error', err)
        }
      })
    }
  },

  async startnew(dataid) {
    let QrCodeMsg = 'drostart~' + dataid + '~willstart~droend';
    console.log(QrCodeMsg)
    //结束时间戳加关键字符
    this.data.text = QrCodeMsg
    this.ewmChange()
  },

  async startwithtime(beginT, dataid) {
    let phone = storage.getStorageSyncTime('phoneNumber')
    console.log(phone)
    let QrCodeMsg = 'drostart~' + dataid + '~' + beginT + '~droend';
    console.log(QrCodeMsg)
    //结束时间戳加关键字符
    this.setData({
      text: QrCodeMsg
    })
    this.ewmChange()
  },

  //二维码
  ewmChange() {
    let size = {}
    size.w = wx.getSystemInfoSync().windowWidth / 750 * 600
    size.h = size.w
    var that = this

    drawQrcode({
      width: size.w,
      height: size.h,
      canvasId: 'myQrcode',
      // ctx: wx.createCanvasContext('myQrcode'),
      text: that.data.text,
      // v1.0.0+版本支持在二维码上绘制图片
    })
  },

  ewmText(e) {
    this.setData({
      text: e.detail.value
    })
  },

  searchFn() {
    this.ewmChange()
  },
  //秒表
  starttimer: function () {
    clearInterval(init);
    var that = this;
    init = setInterval(function () {
      that.timer()
    }, 50);
  },

  setStartTime(millisecond) {
    that.setData({
      millisecond: 0
    })
  },

  stop: function () {
    clearInterval(init);
  },
  Reset: function () {
    var that = this;
    clearInterval(init);
    this.data.hour = 0
    this.data.minute = 0
    this.data.second = 0
    this.data.millisecond = 0
    that.setData({
      timecount: '00:00:00'
    })
  },
  timer: function () {
    var that = this;
    //console.log(that.data.millisecond)
    that.setData({
      millisecond: that.data.millisecond + 5
    })
    if (that.data.millisecond >= 100) {
      that.setData({
        millisecond: 0,
        second: that.data.second + 1
      })
    }
    if (that.data.second >= 60) {
      that.setData({
        second: 0,
        minute: that.data.minute + 1
      })
    }
    if (that.data.minute >= 60) {
      that.setData({
        minute: 0,
        hour: that.data.hour + 1
      })
    }

    let sec = that.data.second
    if (sec < 10) {
      sec = '0' + sec
    }

    let min = that.data.minute
    if (min < 10) {
      min = '0' + min
    }

    that.setData({
      timecount: that.data.hour + ":" + min + ":" + sec
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  async onLoad(options) {
    //判断登录
    if (app.globalData.openid == null) {
      wx.showToast({
        title: '请先登录哦',
        icon: 'none'
      })
      wx.redirectTo({
        url: '/pages/student/mine/mine',
      })
      return;
    }
    let sallerinfo = storage.getStorageSyncTime('currentSaller')
    //计算金额
    this.showLoading('正在整理文件')
    let timestamp = new Date().getTime();
    let twohour_timetamp = timestamp + 2 * 60 * 60 * 1000;
    let money = await caculete.caculete(timestamp, twohour_timetamp, sallerinfo._id)
    money = parseFloat(money).toFixed(2)
    console.log(money)
    this.setData({
      twoHourMoney: money
    })

    //载入时判断，如果已经开始运动则自动计时
    let that = this
    this.showLoading('正在调试秒表')
    let phone = storage.getStorageSyncTime('phoneNumber')

    let status = await caculete.caculetestatus(app.globalData.openid, sallerinfo._id, phone)
    console.log('statusinfo', status)

    if (status.status == 0) {
      //为空数据，尚未开始,扫码开始
      that.startnew(status.dataid)
      that.startWatcher(status.dataid)
    } else if (status.status == 1) {
      //尚未结束,设置二维码，设置开始时间并开始计时
      that.getStartTime(status.begTime)
      this.setData({
        isStarted: true,
      })
      that.startwithtime(status.begTime, status.dataid)
      that.starttimer()
      that.startWatcher(status.dataid)
    } else if (status.status == 2) {
      //计算金额，跳转支付
      that.caculatemoney(status.begTime, status.endTime, status.dataid)
    } else {
      //报错
      that.showLoading('可能遇到点问题')
      setTimeout(function () {
        that.hideLoading()
        wx.reLaunch({
          url: '…/index/index'
        })
      }, 2000)
    }
    this.hideLoading()
  },
  //获取当前的秒表计时
  getStartTime(begTime) {
    let sportTime = new Date().getTime() - begTime
    console.log(sportTime)
    let sec = sportTime / 1000
    let min = sec / 60
    sec = sec % 3600
    console.log(Math.floor(sec))
    let hour = min / 60
    min = min % 60
    console.log(Math.floor(min))
    console.log(Math.floor(hour))
    this.setData({
      hour: Math.floor(hour),
      minute: Math.floor(min),
      second: Math.floor(sec),
      millisecond: sportTime
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
    this.Reset();
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