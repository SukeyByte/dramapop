const footdata = require('../../student/studentFootData.js')
const img = require('../../../util/getimagesrc.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgsrc: img.logosrc(),
    resourceList: null,
    dataList: [],
    pagenumber: 1,
    coatchlist: [],
    searchKeyWord: '',
    coatchCount: 0
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
    var that = this;
    footdata.footDataList('coatch').then(res => {
      this.setData({
        dataList: res
      })
    })
    this.showLoading('正在查找教练')

    this.search()
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
    if (this.data.coatchCount > (this.data.pagenumber * 10)) {
      this.data.pagenumber += 1
      this.search()
    }
  },

  selectCoatch(e) {
    console.log(e.currentTarget.dataset.id)
    wx.navigateTo({
      url: '../coatchdetailpages/coatchdetailpages?id=' + e.currentTarget.dataset.id,
    })
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
      coatchlist: []
    })
    this.search()
  },

  search() {
    let that = this
    this.showLoading('查找中...')
    wx.cloud.callFunction({
      name: 'getCoatchbyKey',
      data: {
        'pageIndex': this.data.pagenumber,
        'key': this.data.searchKeyWord
      }
    }).then(res => {
      console.log(res)
      res.result.data.forEach(function (element, index, array) {
        console.info(element); //当前元素的值
        console.info(index);   //当前下标
        console.info(array);  //数组本身 
        that.data.coatchlist.push(element)
      })
      this.setData({
        pagenumber: this.data.pagenumber,
        coatchlist: this.data.coatchlist
      })
      if (this.data.coatchCount != res.result.count) {
        this.data.coatchCount = res.result.count
      }
      console.log(this.data.coatchlist)
      this.hideLoading()
    }).catch(err => {
      console.log(err)
    })
  }
})