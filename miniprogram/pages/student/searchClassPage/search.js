const app = getApp()
const img = require('../../../util/getimagesrc.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    loadModal: false,
    loadingtext: '正在查询',
    dataList: [],
    pagenumber: 1,
    searchKeyWord: '',
    classes: [],
    blanksrc: img.blanksrc(),
    total: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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
    if (this.data.total > (this.data.pagenumber * 10)) {
      this.data.pagenumber += 1
      this.search()
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

  bindSearchInput(e) {
    this.setData({
      searchKeyWord: e.detail.value
    })
  },

  searchCoatch() {
    this.data.pagenumber = 1
    this.setData({
      classes: []
    })
    this.search()
  },

  search() {
    let that = this
    this.showLoading('查找中...')
    wx.cloud.callFunction({
      name: 'getSearchResult',
      data: {
        'pageIndex': this.data.pagenumber,
        'key': this.data.searchKeyWord
      }
    }).then(res => {
      console.log(res)
      this.toDateClass(res.result)
    }).catch(err => {
      console.log(err)
    })
  },

  async toDateClass(opents) {
    console.log(opents)
    if (this.data.total != opents.count) {
      this.data.total = opents.count
    }

    this.data.pageIndex += 1
    const tasks = this.data.classes
    //单条数据处理，过滤过期的单次循环信息
    const classList = opents.data
    for (let i = 0; i < classList.length; i++) {
      const item = classList[i]
      item.coatchTime = item.noonTime
      let makeStatus = 1 //预约按钮状态   1  可以预约  2  预约过了   3 已经满人了
      let userList = item.userList
      if (userList.length >= item.total) { //判断是否满员
        makeStatus = 3
      } else {
        for (let j = 0; j < userList.length; j++) {
          if (userList[j].openid == app.globalData.openid) { //判断是否预定
            makeStatus = 2
            break;
          }
        }
      }
      item.makeStatus = makeStatus
      tasks.push(item)
    }
    this.setData({
      classes: tasks
    })
    this.hideLoading()
  },

  async toOrderDetails(e) {
    //判断登陆
    if (app.globalData.openid == null) {
      return
    }
    const db = wx.cloud.database()
    const coatchInfoList = await db.collection('ClientByClass').where({
      classId: e.currentTarget.dataset.classid
    }).get().then(res => {
      return res
    }
    )
    if (coatchInfoList.data.length >= e.currentTarget.dataset.total && coatchInfoList.data.length > 0) {
      wx.showToast({
        title: '已经被预约满',
        icon: 'none'
      })
      return false;
    }
    let isStatus = false;
    for (let j = 0; j < coatchInfoList.data.length; j++) {
      if (coatchInfoList.data[j].openId == app.globalData.openid) { //判断是否预定
        isStatus = true;
        break;
      }
    }
    if (isStatus) {
      wx.showToast({
        title: '你已经预定',
        icon: 'none'
      })
      return false;
    }
    wx.navigateTo({
      url: '/pages/student/classOrderDetails/classOrderDetails?classId=' + e.currentTarget.dataset.classid,
    })
  },
})