const app = getApp()
const db = wx.cloud.database()
const img = require('../../../util/getimagesrc.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    loadModal: false,
    mskDetail: null,
    imgsrc:img.logosrc()
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
    console.log(options)
    this.showLoading('正在搜刮优惠券')
    wx.cloud.callFunction({
      name: 'getmskWidthId',
      data: {
        id: options.id,
      },
      success: res => {
        console.log('[云函数] [getmskWidthId] result: ', res.result)
        this.setData({
          mskDetail: res.result.data
        })
      },
      fail: err => {
        console.error('[云函数] [getmskWidthId] 调用失败', err)
      },
      complete: res => {
        this.hideLoading()
      }
    })
  },

  async getNow() {
    if (app.globalData.openid == null || app.globalData.openid == undefined) {
      wx.showToast({
        title: '请先登陆哦',
        icon: 'none'
      })
      wx.redirectTo({
        url: '../mine/mine',
      })
      return;
    }
    //查询当前用户有没有优惠券
    let hasmsk = await db.collection('mskClient').where({
      clientId: app.globalData.openid,
      mskId: this.data.mskDetail._id
    }).get().then(res => {
      console.log(res)
      if (res.data.length > 0) {
        wx.showToast({
          title: '您已经领取过了哦',
          icon: 'none'
        })
        return false
      } else {
        return true
      }
    }).catch(err => {
      console.log(err)
      return false
    })
    //优惠只能领取一次，如果允许使用
    if (hasmsk) {
      this.showLoading('正在领取优惠券')
      wx.cloud.callFunction({
        name: 'addmskforCilent',
        data: {
          mskId: this.data.mskDetail._id,
          clientId: app.globalData.openid
        },
        success: res => {
          console.log('[云函数] [addmskforCilent] result: ', res.result)
          wx.showToast({
            title: '领取优惠券成功'
          })
        },
        fail: err => {
          console.error('[云函数] [addmskforCilent] 调用失败', err)
        },
        complete: res => {
          this.hideLoading()
        }
      })
    }
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