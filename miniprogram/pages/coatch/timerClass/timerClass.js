const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    classList: [],
    loadModal:false,
    loadingtext:'',
    coatchInfo:null
  },
  showLoading: function (text) {
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
  //加载数据
  async loadData() {
    const that = this
    this.showLoading('')
    const db = wx.cloud.database()
    let coatchInfo = await db.collection('Coatch').where({
      _openid: app.globalData.openid
    }).get()
    this.setData({
      coatchInfo: coatchInfo.data[0],
    })
    console.log('coatchInfo', this.data.coatchInfo)
    let res = await db.collection('TimerClassInfo').where({
      '_openid': app.globalData.openid
    }).orderBy('noonTime', 'asc').limit(10).get()
    console.log(res)
    let classList = []
    for (let i = 0; i < res.data.length; i++) {
      var clsssItem = res.data[i]
      var item = {
        startTime: clsssItem.noonTime.split("-")[0],
        endTime: clsssItem.noonTime.split("-")[1],
        type: clsssItem.type,
        price: clsssItem.price,
        id: clsssItem._id
      }
      classList.push(item)
    }
    that.setData({
      classList: classList
    })
    this.hideLoading()
  },
  //删除课程
  deleteClass(e) {
    this.showLoading('删除中......')
    var id = e.currentTarget.dataset.id
    const db = wx.cloud.database()
    const that = this
    db.collection('TimerClassInfo').doc(id).remove().then(res => {
      that.loadData()
      that.hideLoading()
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.loadData()
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