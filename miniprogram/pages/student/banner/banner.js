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
    conNum: 1,
    cardmoney: 1999,
    checkbox: [{
      value: 1999,
      name: '年卡会员',
      checked: false,
      hot: false,
    }, {
      value: 1999,
      name: '十节私教',
      checked: false,
      hot: false,
    }, {
      value: 50000,
      name: '至尊会员',
      checked: false,
      hot: false,
    }],
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
    let that = this;
    let cardtypes = '';
    let cardmoneys = '';
    let maxSize = '';
    let paySize = 0;
    language.getLanguage('banner').then(res => {
      console.log(res)
      if (options.id == 1) {
        cardmoneys = res.price001,
        cardtypes = res.index008
      } else if (options.id == 2) {
        cardmoneys = res.price002,
        cardtypes = res.index009
      } else {
        cardmoneys = res.price003,
        cardtypes = res.index010
      }
      this.setData({
        cardmoney: cardmoneys,
        pageCode: res,
        cardType: cardtypes
      })
    })
    const db = wx.cloud.database()
    const _ = db.command
    var date = new Date()
    db.collection('CardDetail').where({
      itemId: options.id
    }).count({
      success: res => {
        console.log(res)
        paySize = res.total
        if (options.id != 1 && paySize >= maxSize) {
          this.setData({
            payed: true
          })
        }
      },
      fail: err => {
        console.log(err)
      }
    })

    if (options.id == 1) {
      
        maxSize = 1
    } else if (options.id == 2) {
     
        maxSize = 20
    } else {
     
        maxSize = 300
    }
    setTimeout(function () {
      that.setData({
        loading: true,
        imgid: options.id,
        cardType: cardtypes,
        cardmoney: cardmoneys,
        maxSize: maxSize,
        paySize: maxSize - paySize
      })
    }, 500)



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

  },

  delNum: function () {
    let conNum = this.data.conNum;
    conNum--
    if (conNum <= 0) {
      return
    }
    this.setData({
      conNum: conNum
    })
  },
  addNum: function () {
    let conNum = this.data.conNum;
    conNum++
    if (conNum > this.data.maxSize) {
      return
    }
    this.setData({
      conNum: conNum
    })
  },
  numChange: function (e) {
    let that = this;
    let conNum = this.data.conNum;
    let vauleNum = e.detail.value;
    if (!/^[0-9]*$/.test(vauleNum) || vauleNum == "" || vauleNum == 0 || vauleNum > this.data.maxSize) {
      wx.showToast({
        icon: 'none',
        title: that.data.pageCode.index012,
      })
      vauleNum = 1
    }
    this.setData({
      conNum: vauleNum
    })
  }
})