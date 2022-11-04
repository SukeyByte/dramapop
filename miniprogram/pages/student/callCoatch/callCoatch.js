const app = getApp()
const footdata = require('../../student/studentFootData.js')
const caculete = require('../../../util/getCaculeteMoney.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    sellerList: null,
    centerX: 114.0214,
    centerY: 22.53076,
    year: null,
    mounth: null,
    day: null,
    markers: [],
    shop_image: "",
    shop_name: "",
    searchKeyWord: "",
    pagenumber: 1,
    searchCount: 0,
    StatusBar: app.globalData.StatusBar,
    CustomBar: app.globalData.CustomBar,
    Custom: app.globalData.Custom,
    starttime: (new Date().getHours() + 1) + ':' + new Date().getMinutes(),
    endtime: (new Date().getHours() + 2) + ':' + new Date().getMinutes(),
    starttimespan: new Date().getTime() + (1 * 60 * 60 * 1000),
    endtimespan: new Date().getTime() + (2 * 60 * 60 * 1000),
    dataList: [],
    sellerIndex: 0,
    sellerNameList: [],
    defaultSeller: null,
    needmoeny: 0,
    isFinding: false,
    showpay: false,
    classname: '',
    itemId: ''
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
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    footdata.footDataList('callCoatch').then(res => {
      this.setData({
        dataList: res
      })
    })

    //判断登陆
    if (app.globalData.openid == null || app.globalData.openid == undefined) {
      wx.redirectTo({
        url: '/pages/student/mine/mine',
      })
      return
    }

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
      currentTime: Y + "-" + M + "-" + D,
      classname: app.globalData.userInfo.nickName + '预定的私教课',
      itemId: app.globalData.openid + '--' + Y + "-" + M + "-" + D
    })
    wx.cloud.callFunction({
      name: 'getClientOrderClass'
    }).then(res => {
      console.log(res)
      if (res.result.length > 0) {
        this.setData({
          isFinding: true
        })
      }
    }).catch(err => {
      console.log(err)
    })
    let that = this
    wx.getLocation({
      type: 'wgs84',
      success: function (res) {
        console.log(res)
        that.setData({
          centerX: res.longitude,
          centerY: res.latitude
        })
        wx.cloud.callFunction({
          name: 'getNearLocate',
          data: {
            longitude: res.longitude,
            latitude: res.latitude
          },
        }).then(res => {
          console.log(res.result)
          let sellerName = []
          res.result.list.forEach(function (item, index) {
            console.log(item)
            sellerName.push(item.name)
          })
          that.setData({
            sellerList: res.result.list,
            defaultSeller: res.result.list[0],
            sellerNameList: sellerName
          })
          that.requestMaKers(res.result.list)
          that.caculate()
        }).catch(err => {
          console.log(err)
        })
      }
    })
  },

  /**
   * 获取门店列表数据
   */
  requestMaKers: function (event) {
    let that = this
    let markers = [];
    for (let i = 0; i < event.length; i++) {
      let marker = that.createMarker(event[i], i);
      markers.push(marker)
    }
    console.log(markers)
    that.setData({
      markers: markers
    })
  },
  /**
   * 创建marker对象
   */
  createMarker(point, id) {
    let marker = {
      id: id || 0,
      name: point.name || '',
      longitude: point.location[0],
      latitude: point.location[1],
      content: point.addressName || '',
      borderWidth: 15,
      borderRadius: 15,
      width: 18,
      height: 30,
    };
    return marker;
  },

  createCircle(point) {
    return circles = {
      latitude: 40.002607,
      longitude: 116.587847,
      color: '#ee7788aa',
      radius: 50,
      fillColor: '#7cb5ec88',
      strokeWidth: 1
    }
  },

  async caculate() {
    this.showLoading('正在核算金额')
    let sallerinfo = this.data.defaultSeller
    console.log(sallerinfo)
    let money = await caculete.caculete(this.data.starttimespan, this.data.endtimespan, sallerinfo._id)
    console.log(money)
    this.setData({
      needmoeny: 260 + parseFloat(money)
    })
    this.selectComponent("#payc").setData({
      payPrice: this.data.needmoeny
    })
    this.hideLoading()
  },

  /**
   * 点击marker
   */
  markertap: function (shopitem) {
    let index = shopitem.detail.markerId
    console.log(index)
    console.log(this.data.showData[index])
    let that = this
    that.setData({
      shop_image: that.data.showData[index].shop_image,
      shop_name: that.data.showData[index].shop_name,
    })
  },

  selectLocate(e) {
    let data = e.currentTarget.dataset.item
    this.mapCtx.moveToLocation({
      longitude: data.location[0],
      latitude: data.location[1],
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.mapCtx = wx.createMapContext('map', this)
  },

  selectItem: function (e) {
    console.log(e)
    wx.setStorageSync('currentSaller', e.currentTarget.dataset.item)
    wx.redirectTo({
      url: '/pages/student/newIndex/newIndex',
    })
  },

  //搜索
  bindSearchInput(e) {
    this.setData({
      searchKeyWord: e.detail.value
    })
  },

  searchData() {
    this.data.pagenumber = 1
    this.setData({
      sellerList: [],
      markers: []
    })
    this.search()
  },

  search() {
    let that = this
    this.showLoading('查找中...')
    wx.cloud.callFunction({
      name: 'getLocateByKey',
      data: {
        'pageIndex': this.data.pagenumber,
        'key': this.data.searchKeyWord
      }
    }).then(res => {
      console.log(res)
      res.result.data.forEach(function (element, index, array) {
        // console.info(element); //当前元素的值
        // console.info(index); //当前下标
        // console.info(array); //数组本身 
        that.data.sellerList.push(element)
      })
      this.setData({
        pagenumber: this.data.pagenumber,
        sellerList: this.data.sellerList
      })
      this.requestMaKers(this.data.sellerList)
      if (this.data.searchCount != res.result.count) {
        this.data.searchCount = res.result.count
      }
      this.hideLoading()
    }).catch(err => {
      console.log(err)
      this.hideLoading()
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
    console.log(this.data.starttimespan)
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

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

  hideModal() {
    this.setData({
      showpay: false
    })
  },

  order() {
    if (app.globalData.openid == null || app.globalData.openid == undefined) {
      wx.redirectTo({
        url: '../mine/mine',
      })
    }

    this.setData({
      showpay: true
    })


  },

  paymevent(e) {
    wx.showToast({
      title: '支付成功'
    })

    let that = this
    let time = new Date().getTime()
    let data = {
      openid: app.globalData.openid,
      starttime: this.data.starttime,
      endtime: this.data.endtime,
      starttimespan: this.data.starttimespan,
      endtimespan: this.data.endtimespan,
      seller: this.data.defaultSeller,
      sellerid: this.data.defaultSeller._id,
      name: app.globalData.userInfo.nickName + '预定的私教课',
      price: this.data.needmoeny,
      createTime: time,
      date: this.data.year + '-' + this.data.mounth + '-' + this.data.day,
      noonTime: this.data.starttime + '-' + this.data.endtime,
      showType: '私教',
      type: 1,
      total: 1,
      totalPrice: this.data.needmoeny,
      user: app.globalData.userInfo,
      itemId: this.data.itemId
    }

    wx.cloud.callFunction({
      name: 'addClientClassOrder',
      data: data
    }).then(res => {
      console.log(res)
      if (res.result._id) {
        that.setData({
          isFinding: true
        })
      }
    }).catch(err => {
      console.log(err)
    })

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

      }
    })
  },
  //指定健身房变更
  openSellerChange(e) {
    this.setData({
      sellerIndex: e.detail.value,
      defaultSeller: this.data.sellerList[e.detail.value]
    })
  },

})