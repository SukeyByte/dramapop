const img = require('../../../util/getimagesrc.js')
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    packageList: [],
    openid: app.globalData.openid,
    loadModal: false,
    loadingtext: '',
    blanksrc: img.blanksrc(),
    pageIndex: 1,
    totalPage: 0,
    MAX_LIMIT: 10,
    selectItem: null,
    wating: true
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


  getSelectClass() {
    let that = this
    this.showLoading('正在获取课程包...')
    wx.cloud.callFunction({
      name: 'getPackageList',
      data: {
        'openid': app.globalData.openid,
        'pageIndex': this.data.pageIndex
      },
      success: res => {
        console.log('[云函数] [getPackageList] result: ', res.result);
        that.data.totalPage = res.result.count.total
        res.result.result.forEach(function (element, index, array) {
          that.data.packageList.push(element)
        })
        that.setData({
          packageList: that.data.packageList
        })

      },
      fail: err => {
        console.error('[云函数] [getStudentSelectClass] 调用失败', err);
        return err;
      },
      complete(res) {
        that.hideLoading()
        return res
      }
    })
  },

  shareClass: function (e) {
    console.log(e)
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getSelectClass()
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
    if (this.data.totalPage > (this.data.pageIndex * this.data.MAX_LIMIT)) {
      this.data.pageIndex += 1
      this.getSelectClass()
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (e) {
    console.log(e)
    this.data.selectItem = e.target.dataset.item
    console.log(this.data.selectItem)
    let that = this
    let paths = '/pages/student/getPackage/getPackage?id=' + that.data.selectItem._id
    console.log(paths)
    var shareObj = {
      title: that.data.selectItem.name,
      path: paths,
      imageUrl: 'https://6d61-mallforgym-i8imy-1300202136.tcb.qcloud.la/share.jpg?sign=9d1d20bc01f939b7b052613af642e900&t=1619417498',
    }
    return shareObj;
  }

})