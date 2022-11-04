const app = getApp()
const db = wx.cloud.database()
const _ = db.command
const img = require('../../../../util/getimagesrc.js')
const dateTimeUtil = require('../../../../util/getTime.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    loadModal: false,
    loadingtext: '',
    imgsrc: img.logosrc(),
    blanksrc: img.blanksrc(),
    cardlists: [],
    showModel: false,
    selectCard: '',
    stopTimes: 0,
    index: 0,
    current: ''
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
    let that = this
    console.log(app.globalData.openid)
    if (app.globalData.openid == null || app.globalData.openid == undefined) {
      wx.showToast({
        title: '请先登录哦',
        icon: 'none'
      })
      return;
    }
    db.collection('BuyCardByClient').where({
        userId: app.globalData.openid,
        status: _.neq(2)
      }).limit(20).skip(0).orderBy('createTime', 'asc')
      .get().then(res => {
        console.log(res)
        let data = []
        res.data.forEach(function (item, index) {
          item.overtime = false
          if (item.type == 1 && item.status == 1) {
            var d = new Date(item.createTime);
            d.setMonth(d.getMonth() + parseInt(item.totalCounts));
            if (new Date(d).getTime() < new Date().getTime()) {
              item.overtime = true
            }
          }
          console.log(item)
          data.push(item)
        })
        that.setData({
          cardlists: data
        })
      }).catch(err => {
        return err
      })
  },

  activation: function (e) {
    console.log(e)
    if (e.currentTarget.dataset.status != 0) {
      return
    }
    let that = this
    db.collection('BuyCardByClient')
      .doc(e.currentTarget.dataset.id)
      .update({
        data: {
          status: 1,
          lastupdateTime: dateTimeUtil.getYYYYMMDD(new Date())
        }
      }).then(res => {
        console.log(dateTimeUtil.getYYYYMMDD(new Date()))
        wx.showToast({
          title: '激活成功'
        })
        let index = "cardlists[" + e.currentTarget.dataset.index + "].status"
        that.setData({
          [index]: 1
        })
      }).catch(err => {
        console.log(err)
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

  stopCard(e) {
    if (e.currentTarget.dataset.status != 1) {
      return
    }
    console.log(e)
    this.data.selectCard = e.currentTarget.dataset.id
    this.data.stopTimes = e.currentTarget.dataset.stoptimes
    this.data.current = e.currentTarget.dataset.item
    this.data.index = e.currentTarget.dataset.index
    wx.vibrateShort({
      success: (res) => {
        console.log(res)
      },
    })
    if (e.currentTarget.dataset.item.useType == 1) {
      return;
    }
    if (e.currentTarget.dataset.item.type == 0) {
      return;
    }
    if (e.currentTarget.dataset.item.totalCounts < 6) {
      return;
    }
    this.setData({
      showModel: true
    })
  },

  hideModal() {
    this.setData({
      showModel: false
    })
  },

  saveStopCard() {
    let type = 5
    if (this.data.current.totalCounts > 6) {
      type = 10
    }
    wx.cloud.callFunction({
      name: 'updateStopCard',
      data: {
        id: this.data.selectCard,
        count: this.data.stopTimes,
        type: type
      }
    }).then(res => {
      console.log(res)
      let index = "cardlists[" + this.data.index + "].status"
      this.setData({
        [index]: 3
      })
    }).catch(err => {
      console.log('updateStopCard', err)
    })
    this.setData({
      showModel: false
    })
  }
})