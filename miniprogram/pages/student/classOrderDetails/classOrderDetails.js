const img = require('../../../util/getimagesrc.js')
const getorder = require('../../../util/getOrderNum.js')
const app = getApp()
const db = wx.cloud.database()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgsrc: img.logosrc(),
    coatchInfo: null,
    classId: null,
    tmplIds: ['W9D9SN8cRFojxolRaKgcqkdMJ7Oqs3oFisUVOuZS9Vg'],
    loadModal: false,
    loadingtext: ''
  },

  showLoading(text) {
    this.setData({
      loadModal: true,
      loadingtext: text.title
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
    console.log("订单支付", options)

    db.collection('ClassInfo').where({
      _id: options.classId
    }).get().then(res => {
      console.log('[云函数]ClassInfo: ', res)
      if (res.data[0] == undefined) {
        wx.redirectTo({
          url: '/pages/student/class/mainclass',
        })
        return false;
      }
      const coatchInfo = res.data[0]
      this.setData({
        coatchInfo: coatchInfo,
        classId: options.classId
      })
      console.log(this.data.coatchInfo)
      return res
    }
    )
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

  async order(options) {
    let that = this
    this.showLoading({
      title: "正在约课",
    })
    const db = wx.cloud.database()
    let classInfo = await db.collection('ClassInfo').where({
      _id: that.data.classId
    }).get().then(res => {
      console.log('[云函数]ClassInfo: ', res)
      if (res.data[0] == undefined) {
        wx.redirectTo({
          url: '/pages/student/class/mainclass',
        })
        return false;
      }
      let coatchInfo = res.data[0]
      return coatchInfo
    })
    let resclientByClass = await db.collection('ClientByClass').where({
      classId: that.data.classId
    }).get().then(res => {
      return res
    }
    )
    if (resclientByClass.data.length >= classInfo.total) {
      console.log('[云函数]已经满员')
      wx.showToast({
        title: "已经满员",
        icon: 'none'
      })
      return false
    }
    var noonNameTiem = that.data.coatchInfo.noonTime

    var clientInfo = await db.collection('Client').where({
      openid: app.globalData.openid
    }).get().then(res => {
      return res
    })
    let coatchbenefits = 0
    if (that.data.coatchInfo.coatchInfo.iscooperation == 1) {
      if (that.data.coatchInfo.coatchbenefits != null) {
        coatchbenefits = that.data.coatchInfo.coatchbenefits
      }
    }
    let clientByClass = {
      'classId': that.data.classId,
      'sellerId': app.globalData.sallerinfo._id,
      'openid': app.globalData.openid,
      'className': that.data.coatchInfo.name + ' ' + that.data.coatchInfo.date + ' ' + noonNameTiem,
      'classTime': that.data.coatchInfo.date + ' ' + noonNameTiem,
      'begTime': that.data.coatchInfo.date + ' ' + noonNameTiem.split("-")[0] + ':00',
      'engTime': that.data.coatchInfo.date + ' ' + noonNameTiem.split("-")[1] + ':00',
      'classType': that.data.coatchInfo.type,
      'clientInfo': clientInfo.data[0],
      'orderId': options.detail.orderNo,
      'createTime': new Date().getTime(),
      'coatchInfo': that.data.coatchInfo.coatchInfo,
      'coatchName': that.data.coatchInfo.coatchInfo.name,
      'price': that.data.coatchInfo.price,
      'coatchbenefits': coatchbenefits,
      'status': 0   //状态
    }

    db.collection('ClientByClass').add({
      data:clientByClass
    }).then(res=>{
      console.info(res)
      this.hideLoading()
      wx.redirectTo({
        url: '/pages/student/mine/selectClass/selectClass',
      })
    }).catch(err=>{
      console.error(err)
      this.hideLoading()
      wx.redirectTo({
        url: '/pages/student/index/Index',
      })
    })
  },
  async setAccount() {

  },

  confirmevent: function (e) {
    console.log('event', e)
    this.order(e)
  }
})