const app = getApp()
var time = require('../../../util/now.js')
const language = require('../../../util/getLanguageKeyByPage.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    name: '',
    locate: '',
    number: '',
    data: '',
    itemId: '',
    itemName: '',
    pageCode: null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.data.itemId = options.itemId
    this.data.itemName = options.itemName
    language.getLanguage('addLocal').then(res => {
      console.log(res)
      this.setData({
        pageCode: res
      })
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },
  RegionChange: function(e) {
    this.setData({
      region: e.detail.value
    })
  },
  namechange: function(e) {
    this.setData({
      name: e.detail.value
    })
  },
  locatachange: function(e) {
    this.setData({
      locate: e.detail.value
    })
  },
  numberchange: function(e) {
    this.setData({
      number: e.detail.value
    })
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },


  Confirm() {
    var that = this
    if (this.data.name == "") {
      wx.showToast({
        icon: 'none',
        title: that.data.pageCode.index011,
      })
      return
    }
    if (this.data.locate == "") {
      wx.showToast({
        icon: 'none',
        title: that.data.pageCode.index012,
      })
      return
    }
    if (this.data.number == "") {
      wx.showToast({
        icon: 'none',
        title: that.data.pageCode.index013,
      })
      return
    }
    const db = wx.cloud.database().collection('UserLocate')
    db.add({
      data: {
        userId: app.globalData.openId,
        createTime: time.now,
        userInfo: app.globalData.userInfo,
        region: this.data.region,
        name: this.data.name,
        locate: this.data.locate,
        number: this.data.number
      },
      success: function(res) {
        wx.navigateBack()
        wx.showToast({
          title: that.data.pageCode.index014,
        })
      },
      fail: err => {
        wx.showToast({
          icon: 'none',
          title: that.data.pageCode.index015,
        })
      }
    })

  }
})