const app = getApp()
const timeUtil = require('../../../../util/getTime.js')
const img = require('../../../../util/getimagesrc.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    blanksrc: img.blanksrc(),
    showdataList: [],
    loadModal: false,
    loadingtext: '',
    selectindex: null,
    pageIndex: 1,
    totalPage: 0,
    MAX_LIMIT: 10
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
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log("我的订单", options)
    this.showLoading({
      title: "正在加载...",
    })
    if (app.globalData.openid == null || app.globalData.openid == undefined ||
      app.globalData.sallerinfo == null || app.globalData.sallerinfo == undefined) {
      wx.redirectTo({
        url: '../mine/mine',
      })
      return;
    }
    this.getHistory()
  },

  getHistory() {
    let that = this
    this.showLoading('正在挑选课程...')
    wx.cloud.callFunction({
      name: 'getPaymentHistory',
      data: {
        'openid': app.globalData.openid,
        'sellerId': app.globalData.sallerinfo._id,
        'pageIndex': this.data.pageIndex
      },
      success: res => {
        console.log('[云函数] [getPaymentHistory] result: ', res.result);
        this.data.totalPage = res.result.count
        this.data.MAX_LIMIT = res.result.MAX_LIMIT
        res.result.result.forEach(element => {
          element.createTime = timeUtil.getYYYYMMDD(element.createTime)
          this.data.showdataList.push(element)
        })
        that.setData({
          showdataList:this.data.showdataList
        })
      },
      fail: err => {
        console.error('[云函数] [getStudentSelectClass] 调用失败', err);
      },
      complete(res) {
        that.hideLoading()
      }
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
    if (this.data.totalPage > (this.data.pageIndex * this.data.MAX_LIMIT)) {
      this.data.pageIndex += 1
      this.getHistory()
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

  onTap: function (e) {
    if (e.currentTarget.dataset.index == this.data.selectindex) {
      this.setData({
        selectindex: null
      })
    } else {
      this.setData({
        selectindex: e.currentTarget.dataset.index
      })
    }
  },

  async copy(e) {
    console.log(e)
    let item = e.currentTarget.dataset.item
    // let payment = await wx.cloud.callFunction({
    //   name: 'getwxPayRefund',
    //   data: {
    //     refunddesc: '充值退款',
    //     refundmoney: 1,
    //     money: 1,//(that.data.selected + 1) * 50 *100
    //     order: "S2021032017462341819582",
    //     refund: 'RES2021032017462341819582'
    //   }
    // }).then(res => {
    //   console.log(res)
    //   if(res.result.returnCode == "FAIL"){
    //     wx.showToast({
    //       title: res.result.returnMsg,
    //     });
    //   }
    //   return res
    // }).catch(err => { return err })
    wx.setClipboardData({
      data: e.currentTarget.dataset.order,
      success: function (res) {
        wx.showToast({
          title: '已复制订单号',
        });
      }
    })
  }
})