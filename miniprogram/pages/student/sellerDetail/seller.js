const app = getApp()
const db = wx.cloud.database()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    currentSeller: null,
    sellerid: null,
    coatchList: [],
    activityList: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    this.data.sellerid = options.id
    db.collection('Seller').doc(options.id).get().then(res => {
      console.log(res)
      this.setData({
        currentSeller: res.data
      })
    })
    this.getCoatchList()
    this.getActive()
  },
  //获取教练列表
  getCoatchList() {
    this.showLoading('')
    db.collection('Coatch').where({
      "seller._id": this.data.sellerid
    }).limit(3).get().then(res => {
      console.log(res)
      this.hideLoading()
      this.setData({
        coatchList: res.data
      })
    })
  },
  //获取优惠活动
  getActive() {
    wx.cloud.callFunction({
      name: 'getActivity',
      data: {
        sellerid: this.data.sellerid
      }
    }).then(res => {
      console.log(res)
      this.setData({
        activityList: res.result.data,
      })
    })
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

  coatchDetail(e) {
    console.log(e.currentTarget.dataset.item._id)
    wx.navigateTo({
      url: '../coatchdetailpages/coatchdetailpages?id=' + e.currentTarget.dataset.item._id,
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