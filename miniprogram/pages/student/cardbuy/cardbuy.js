// miniprogram/pages/banner/banner.js
const app = getApp()
const language = require('../../../util/getLanguageKeyByPage.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    pageCode: null,
    showModel: false,
    payed: false,
    imgid: '',
    cardType: '',
    detailimg:'',
    conNum: 1,
    cardmoney: 1999,
    swiperList: [{
      id: 0,
      type: 'image',
      url: 'cloud://mallforgym-i8imy.6d61-mallforgym-i8imy-1300202136/Crowd-funding/015_1 - Photo.jpg'
    }, {
      id: 1,
      type: 'image',
      url: 'cloud://mallforgym-i8imy.6d61-mallforgym-i8imy-1300202136/Crowd-funding/015_2 - Photo.jpg'
    }, {
      id: 2,
      type: 'image',
      url: 'cloud://mallforgym-i8imy.6d61-mallforgym-i8imy-1300202136/Crowd-funding/015_3 - Photo.jpg'
    }, {
      id: 3,
      type: 'image',
      url: 'cloud://mallforgym-i8imy.6d61-mallforgym-i8imy-1300202136/Crowd-funding/015_4 - Photo.jpg'
    }, {
      id: 4,
      type: 'image',
      url: 'cloud://mallforgym-i8imy.6d61-mallforgym-i8imy-1300202136/Crowd-funding/015_5 - Photo.jpg'
    }, {
      id: 5,
      type: 'image',
      url: 'cloud://mallforgym-i8imy.6d61-mallforgym-i8imy-1300202136/Crowd-funding/015_6 - Photo.jpg'
    }],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let id = options.id;
    let money = options.money;
    console.log(options.id)
    language.getLanguage('cardbuy').then(res => {
      this.setData({
        pageCode: res,
        cardmoney: money
      })
    })
    let that = this;
    const db = wx.cloud.database()
    const _ = db.command
    var date = new Date()
    db.collection('BuyCard').where({
      _id: id
    }).get({
      success: res => {
        console.log(res)
        that.setData({
          detailimg: res.data[0].detailImg,
          cardType: res.data[0].type,
          imgid: 'card' + options.id
        })
      },
      fail: err => {
        console.log(err)
      }
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

  order: function () {
    let that = this
    that.setData({
      showModel: !that.data.showModel
    })
  },

  ChooseCheckbox: function (e) {
    // let values = e.currentTarget.dataset.value;
    // console.log(values)
    let that = this;
    if (app.globalData.userInfo == null) {
      wx.redirectTo({
        url: '../mine/mine',
      })
      wx.showToast({
        icon: 'none',
        title: that.data.pageCode.index011,
      })
      return;
    }
    wx.navigateTo({
      url: '../contactInfo/contactInfo?money=' + this.data.cardmoney + "&itemName=种马波普" + this.data.cardType + "&itemId=" + this.data.imgid + "&conNum=" + this.data.conNum,
    })

  }
})