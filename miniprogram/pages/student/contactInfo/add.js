const app = getApp()
const language = require('../../../util/getLanguageKeyByPage.js')
var time = require('../../../util/now.js')

// miniprogram/pages/contactInfo/add.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    pageCode: null,
    name: '',
    age: '',
    sex: 1,
    number: '',
    itemId: '',
    itemName: '',
    conNum: '',
    money: '',
    picker: ['女', '男'],
  },
  namechange: function (e) {
    this.setData({
      name: e.detail.value
    })
  },
  agechange: function (e) {
    var that = this
    let age = this.data.age;
    let vauleNum = e.detail.value;
    if (!/^[0-9]*$/.test(vauleNum) || vauleNum == "" || vauleNum == 0) {
      wx.showToast({
        icon: 'none',
        title: that.data.pageCode.index007,
      })
      vauleNum = 20
    }
    this.setData({
      age: vauleNum
    })
  },
  sexchange: function (e) {
    console.log(e.detail.value)
    this.setData({
      sex: e.detail.value
    })
  },
  numberchange: function (e) {
    var that = this
    let number = this.data.number;
    let vauleNum = e.detail.value;
    if (!/^[0-9]*$/.test(vauleNum) || vauleNum == "" || vauleNum == 0) {
      wx.showToast({
        icon: 'none',
        title: that.data.pageCode.index008,
      })
      vauleNum = ""
    }
    this.setData({
      number: vauleNum
    })
  },
  submit() {
    var that = this
    if (this.data.name==""){
      wx.showToast({
        icon: 'none',
        title: that.data.pageCode.index009,
      })
      return
    }
    if (this.data.age == "") {
      wx.showToast({
        icon: 'none',
        title: that.data.pageCode.index010,
      })
      return
    }
    if (this.data.number == "") {
      wx.showToast({
        icon: 'none',
        title: that.data.pageCode.index011,
      })
      return 
    }
    const db = wx.cloud.database().collection('ContactInfo')
    db.add({
      data: {
        userId: app.globalData.openId,
        createTime: time.now,
        userInfo: app.globalData.userInfo,
        name: this.data.name,
        age: this.data.age,
        sex:this.data.sex,
        number: this.data.number
      },
      success: function (res) {
        console.log(res)
        // wx.redirectTo({
        //   url: '../contactInfo/contactInfo?itemId=' + that.data.itemId + '&itemName=' + that.data.itemName + '&conNum=' + that.data.conNum + "&money=" + this.data.money,
        // })
        wx.showToast({
          title: that.data.pageCode.index012,
        })
        wx.navigateBack()
      },
      fail: err => {
        wx.showToast({
          icon: 'none',
          title: that.data.pageCode.index013,
        })
      }
    })

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.data.itemId = options.itemId
    this.data.itemName = options.itemName
    this.data.conNum = options.conNum
    this.data.money = options.money
    language.getLanguage('contactInfoAdd').then(res => {
      console.log(res)
      this.setData({
        pageCode: res
      })
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

  }
})