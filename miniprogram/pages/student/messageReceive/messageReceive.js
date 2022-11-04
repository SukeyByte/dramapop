const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

    const db = wx.cloud.database()
    const _ = db.command
    var date = new Date()
    db.collection('UserMessage').where({
      toUserId: app.globalData.openid
    }).get({
      success: res => {
        console.log(res)
        wx.hideLoading()
        this.setData({
          list: res.data
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
  onReady: function() {

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

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },

  jumptoDetai(e) {
    console.log(e.currentTarget.dataset.id)
    console.log(e.currentTarget.dataset.type)
    let type = e.currentTarget.dataset.type;
    if (type == 1) {
      wx.navigateTo({
        url: '../detail/detail?id=' + e.currentTarget.dataset.id,
      })
    } else if (type == 2) {
      wx.navigateTo({
        url: '../goodsDetail/goodsDetail?id=' + e.currentTarget.dataset.id,
      })
    } else if (type == 3) {
      wx.navigateTo({
        url: '../help/helpDetail?id=' + e.currentTarget.dataset.id,
      })
    }
  }
})