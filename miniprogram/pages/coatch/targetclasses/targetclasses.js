const img = require('../../../util/getimagesrc.js')
const dateTimeUtil = require('../../../util/getTime.js')
const caculete = require('../../../util/getCaculeteMoney.js')
const storage = require('../../../util/storageControl.js')

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
   * 组件的初始数据
   */
  data: {
    year: null,
    mounth: null,
    day: null,
    classList: [],
    hasTomorrow: true,
    lastday: false,
    imgsrc: img.logosrc(),
    showModel: false,
    className: '种马波普非凡私教',
    starttime: new Date().getHours() + ':' + new Date().getMinutes(),
    endtime: (new Date().getHours() + 2) + ':' + new Date().getMinutes(),
    pickerList: ['私教', '团体课', '拼团私教'],
    studentList: [],
    studentNameList: [],
    studentIndex: 0,
    sellerList: [],
    sellerIndex: 0,
    sellerNameList: [],
    pickerNameList: [{
        id: 1,
        name: '私教',
        color: 'line-cyan'
      },
      {
        id: 2,
        name: '团体课',
        color: 'line-orange'
      },
      {
        id: 3,
        name: '拼团私教',
        color: 'line-pink'
      }
    ],
    index: 0,
    maxNumber: 1,
    checkedSingle: false,
    checkedSpell: false,
    coatchInfo: null,
    price: 240,
    starttimespan: new Date().getTime(),
    endtimespan: new Date().getTime() + (2 * 60 * 60 * 1000),
    checkedTotalPrice: false,
    totalPrice: 1,
    localmoney: 49,
    minNumber: 240,
    hotMinNumber: 280,
    error: '',
    showTimerTips: false,
    currentTime: null, //  yyyy-mm-dd  格式的时间
    i: 0 //  加时间的日期
  },

  lifetimes: {
    ready: function () {
      var date = new Date();
      //获取年份  
      var Y = date.getFullYear();
      //获取月份  
      var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1);
      //获取当日日期 
      var D = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
      this.setData({
        index: 0,
        year: Y,
        mounth: M,
        day: D,
        currentTime: Y + "-" + M + "-" + D
      })
      this.loadData()
      wx.cloud.callFunction({
        name: 'getStudentRelationship',
        data: {
          'openid': app.globalData.openid
        }
      }).then(res => {

        if (res.result.data.length > 0) {
          var studentNameList = [];
          var studentList = [];
          studentList.push({
            "name": "无选择"
          })
          studentNameList.push("无选择")
          for (var i = 0; i < res.result.data.length; i++) {
            studentNameList.push(res.result.data[i].name)
            studentList.push(res.result.data[i])
          }
          this.setData({
            studentList: studentList,
            studentNameList: studentNameList
          })
        }
      })
    }
  },

  /**
   * 组件的方法列表
   */
  methods: {
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

    deleteClass(e) {
      this.showLoading('删除中......')
      var id = e.currentTarget.dataset.id
      const db = wx.cloud.database()
      const that = this
      db.collection('ClassInfo').doc(id).remove().then(res => {
        that.loadData()
        that.hideLoading()
      })
    },
    //新增课程安排按钮对应的事件
    addClass() {
      let datestr = null
      if (app.globalData.systemInfo == 1) {
        datestr = (this.data.year + '-' + this.data.mounth + '-' + this.data.day).replace(/-/g, "/")
      } else {
        datestr = (this.data.year + '-' + this.data.mounth + '-' + this.data.day)
      }

      let starttimespan = new Date(datestr + ' ' + this.data.starttime).getTime()
      let endtimespan = new Date(datestr + ' ' + this.data.endtime).getTime()
      this.loadSellerData()
      this.setData({
        starttimespan: starttimespan,
        endtimespan: endtimespan,
        showModel: true,
        showTimerTips: false, //
        className: this.data.coatchInfo.name + '教练的私教课'
      })
      this.caculate()
    },
    //添加定时课程
    addTimerClass() {
      let datestr = null
      if (app.globalData.systemInfo == 1) {
        datestr = (this.data.year + '-' + this.data.mounth + '-' + this.data.day).replace(/-/g, "/")
      } else {
        datestr = (this.data.year + '-' + this.data.mounth + '-' + this.data.day)
      }

      let starttimespan = new Date(datestr + ' ' + this.data.starttime).getTime()
      let endtimespan = new Date(datestr + ' ' + this.data.endtime).getTime()
      this.loadSellerData()
      this.setData({
        starttimespan: starttimespan,
        endtimespan: endtimespan,
        showModel: true,
        showTimerTips: true, //显示定时课程的提示
        className: this.data.coatchInfo.name + '教练的私教课'
      })
      this.caculate()
    },
    //获取新增课程时候的店铺列表,仅获取一次
    loadSellerData() {
      if (this.data.sellerList.length == 0) {
        wx.cloud.callFunction({
          name: 'getSeller'
        }).then(res => {
          console.log('loadSellerData', res)
          let sellerName = []
          res.result.data.forEach(function (item, index) {
            console.log(item)
            sellerName.push(item.name)
          })
          this.setData({
            sellerList: res.result.data,
            sellerNameList: sellerName
          })
        })
      }

    },

    hideModal() {
      this.setData({
        showModel: false
      })
    },
    async saveClass() {
      const that = this
      let currentHour = parseInt(this.data.starttime.split(':')[0])
      let currentMin = parseInt(this.data.starttime.split(':')[1])
      //高峰期判定
      if (currentHour == 12 || currentHour == 1) {
        if (this.data.price < this.data.hotMinNumber) {
          this.setData({
            error: '热门时间段排课金额不能小于280元'
          })
          return
        }
      }
      if (currentHour == 18 || currentHour == 21) {
        if (currentMin < 30) {
          if (this.data.price < this.data.hotMinNumber) {
            this.setData({
              error: '热门时间段排课金额不能小于280元'
            })
            return
          }
        }
      }
      if (this.data.price < this.data.minNumber) {
        this.setData({
          error: '热门时间段排课金额不能小于240元'
        })
        return
      }

      that.showLoading('新增中......')
      const db = wx.cloud.database()
      let pickerItem = that.data.pickerNameList[that.data.index]
      let calprice = that.data.price
      let coatchbenefits = 0
      if (that.data.coatchInfo.iscooperation == 1) {
        calprice = parseFloat(that.data.price * 1.1 + that.data.localmoney * 1).toFixed(2);
        coatchbenefits = that.data.price - that.data.localmoney / 2
      }

      let classData = {
        date: that.data.currentTime,
        showtype: pickerItem.name,
        type: pickerItem.id,
        color: pickerItem.color,
        total: that.data.maxNumber,
        price: calprice,
        coatchbenefits: coatchbenefits,
        starttimespan: that.data.starttimespan,
        endtimespan: that.data.endtimespan,
        name: that.data.className,
        createTime: new Date().getTime(),
        noonTime: that.data.starttime + '-' + that.data.endtime,
        totalPrice: that.data.totalPrice
      }

      classData.coatchInfo = this.data.coatchInfo
      classData.user = app.globalData.userInfo
      classData.openid = app.globalData.openid
      classData.sellerid = that.data.sellerList[that.data.sellerIndex]._id
      classData.seller = that.data.sellerList[that.data.sellerIndex]
      if (that.data.studentIndex != "0") {
        classData.studentOpenId = that.data.studentList[that.data.studentIndex].userid
      }
      if (this.data.showTimerTips) {
        db.collection('TimerClassInfo').add({
          data: classData
        }).then(res => {
          wx.showToast({
            title: '新增成功',
          })
          that.hideModal()
          that.hideLoading()
        }).catch(console.error)
      } else {
        db.collection('ClassInfo').add({
          data: classData
        }).then(res => {
          that.loadData()
          that.hideModal()
          that.hideLoading()
        }).catch(console.error)
      }

    },
    //指定学员变更
    openIdChange(e) {
      this.setData({
        studentIndex: e.detail.value
      })
    },
    //指定健身房变更
    openSellerChange(e) {
      this.setData({
        sellerIndex: e.detail.value
      })
    },

    startTimeChange(e) {
      this.setData({
        starttime: e.detail.value
      })
      console.log(e.detail.value)
      let date = null
      if (app.globalData.systemInfo == 1) {
        date = new Date((this.data.year + '-' + this.data.mounth + '-' + this.data.day + ' ' + e.detail.value).replace(/-/g, "/"))
      } else {
        date = new Date(this.data.year + '-' + this.data.mounth + '-' + this.data.day + ' ' + e.detail.value)
      }
      console.log(date)
      this.data.starttimespan = date.getTime()
      this.caculate()
    },
    endTimeChange(e) {
      this.setData({
        endtime: e.detail.value
      })
      let date = null
      if (app.globalData.systemInfo == 1) {
        date = new Date((this.data.year + '-' + this.data.mounth + '-' + this.data.day + ' ' + e.detail.value).replace(/-/g, "/"))
      } else {
        date = new Date(this.data.year + '-' + this.data.mounth + '-' + this.data.day + ' ' + e.detail.value)
      }
      console.log(date)
      this.data.endtimespan = date.getTime()
      this.caculate()
    },

    async caculate() {
      let sallerinfo = storage.getStorageSyncTime('currentSaller')
      let money = await caculete.caculete(this.data.starttimespan, this.data.endtimespan, sallerinfo._id)
      console.log(money)
      this.setData({
        localmoney: money
      })
    },

    PickerChange(e) {
      console.log(e);
      var type = parseInt(this.data.pickerNameList[e.detail.value].id)
      var checkedSingle = this.data.checkedSingle
      var maxNumber = this.data.maxNumber
      var checkedTotalPrice = this.data.checkedTotalPrice
      var studentIndex = this.data.studentIndex
      if (type == 2) {
        checkedTotalPrice = false
        checkedSingle = true
        studentIndex = 0 //不是私教就吧指定学员为 0
      } else if (type == 3) {
        checkedTotalPrice = true
        checkedSingle = true
        maxNumber = 1
        studentIndex = 0 //不是私教就吧指定学员为 0 
      } else {
        checkedTotalPrice = false
        checkedSingle = false
        maxNumber = 1
      }
      this.setData({
        index: e.detail.value,
        checkedSingle: checkedSingle,
        maxNumber: maxNumber,
        checkedTotalPrice: checkedTotalPrice,
        studentIndex: studentIndex
      })
      this.priceCounts()
    },
    // 最大人数限制
    maxPeopleInput: function (e) {
      let num = ""
      if (e.detail.value != "") {
        num = parseInt(e.detail.value)
        if (num <= 0) {
          num = 1
        }
        if (this.data.checkedTotalPrice) {
          if (num > 4) {
            num = 4
          }
        }
        this.setData({
          maxNumber: num
        })
      }
      if (this.data.checkedTotalPrice) {
        this.priceCounts()
      }
    },
    // 名称
    classNameInput: function (e) {
      if (e.detail.value != "") {
        this.setData({
          className: e.detail.value
        })
      }
    },
    async priceCounts() {
      const that = this
      if (that.data.checkedTotalPrice) {
        if (that.data.maxNumber != "" && that.data.totalPrice != "") {
          var number = parseInt(that.data.maxNumber)
          var totalPrice = parseFloat(that.data.totalPrice)
          var price = parseFloat(totalPrice / number).toFixed(2)
          this.setData({
            price: price
          })
        }
      }
    },
    totalPriceInput: function (e) {
      let totalPrice = ""
      if (e.detail.value != "") {
        totalPrice = parseInt(e.detail.value)
        if (totalPrice <= 0) {
          totalPrice = 1
        }
        this.setData({
          totalPrice: totalPrice
        })
      }
      if (this.data.checkedTotalPrice) {
        this.priceCounts()
      }

    },
    priceInput: function (e) {
      let price = ""
      if (e.detail.value != "") {
        price = parseInt(e.detail.value)
        if (price <= 0) {
          price = 1
        }
      }
      this.setData({
        price: price
      })
    },
    async loadData() {
      this.showLoading()
      const that = this
      const db = wx.cloud.database()
      let coatchInfo = await db.collection('Coatch').where({
        _openid: app.globalData.openid
      }).get()
      this.setData({
        coatchInfo: coatchInfo.data[0],
      })
      console.log('coatchInfo', this.data.coatchInfo)
      let res = await db.collection('ClassInfo').where({
        '_openid': app.globalData.openid,
        'date': that.data.currentTime
      }).orderBy('noonTime', 'asc').get()
      console.log(res)
      let classList = []
      for (let i = 0; i < res.data.length; i++) {
        var clsssItem = res.data[i]
        var item = {
          startTime: clsssItem.noonTime.split("-")[0],
          endTime: clsssItem.noonTime.split("-")[1],
          type: clsssItem.type,
          price: clsssItem.price,
          id: clsssItem._id
        }
        classList.push(item)
      }
      that.setData({
        classList: classList
      })
      this.hideLoading()
    },

    tomorrowClass() {
      let today = new Date(this.data.currentTime)
      today = today.setDate(today.getDate() + 1);
      today = new Date(today);
      var time = dateTimeUtil.getYYYYmmdd(today.getTime());
      //获取年份  
      var Y = today.getFullYear();
      //获取月份  
      var M = (today.getMonth() + 1 < 10 ? '0' + (today.getMonth() + 1) : today.getMonth() + 1);
      //获取当日日期 
      var D = today.getDate() < 10 ? '0' + today.getDate() : today.getDate();
      var i = parseInt(this.data.i) + 1
      this.setData({
        lastday: true,
        year: Y,
        mounth: M,
        day: D,
        i: i,
        currentTime: time
      })
      if (i == 2) {
        this.setData({
          hasTomorrow: false
        })
      }
      this.loadData()
    },

    lastdayClass() {
      let today = new Date(this.data.currentTime)
      today = today.setDate(today.getDate() - 1);
      today = new Date(today);
      var time = dateTimeUtil.getYYYYmmdd(today.getTime());
      //获取年份  
      var Y = today.getFullYear();
      //获取月份  
      var M = (today.getMonth() + 1 < 10 ? '0' + (today.getMonth() + 1) : today.getMonth() + 1);
      //获取当日日期 
      var D = today.getDate() < 10 ? '0' + today.getDate() : today.getDate();
      var i = parseInt(this.data.i) - 1
      if (i == 0) {
        this.setData({
          lastday: false,
          hasTomorrow: true,
          year: Y,
          mounth: M,
          day: D,
          i: i,
          currentTime: time
        })
      } else {
        this.setData({
          hasTomorrow: true,
          year: Y,
          mounth: M,
          day: D,
          i: i,
          currentTime: time
        })
      }
      this.loadData()
    }
  }
})