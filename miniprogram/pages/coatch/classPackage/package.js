// miniprogram/pages/coatch/classPackage/package.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    name: '',
    number: 20,
    total: 4800,
    coatchId: null,
    coatchName: '',
    shareid: null,
    loadModal:false,
    loadingtext:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    this.data.coatchId = options.coatchid
    this.data.coatchName = options.coatchname
    this.setData({
      name: options.coatchname + '的私教会员卡'
    })
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

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage:async function () {
    return await wx.cloud.callFunction({
      name: 'addCoatchPackage',
      data: {
        'coatchid': this.data.coatchId,
        'name': this.data.name,
        'total': this.data.total,
        'number': this.data.number,
      }
    }).then(res=>{
      console.log(res)
      if (res.result.code == 0) {
        this.data.shareid = res.result.massage._id
        console.log(this.data.shareid)
        let paths = '/pages/student/getPackage/getPackage?id=' + this.data.shareid
        console.log(paths)
        this.hideLoading()
        var shareObj = {
          title: this.data.name,
          path: paths,
          imageUrl: 'https://6d61-mallforgym-i8imy-1300202136.tcb.qcloud.la/share.jpg?sign=9d1d20bc01f939b7b052613af642e900&t=1619417498',
        }
        return shareObj;
      } else {
        console.log('[云函数] [addCoatchPackage] 调用失败: ', res.result.massage);
      }
    })
  },

  confirm: function () {
    this.showLoading('正在生成分享信息')
    if (this.data.name == null || this.data.name == '') {
      wx.showToast({
        title: '请输入标题',
        icon: 'error'
      })
      return
    }

    if (this.data.total == 0) {
      wx.showToast({
        title: '课程包总价不能为0',
        icon: 'error'
      })
      return
    }

    if (this.data.number == 0) {
      wx.showToast({
        title: '课程包总数不能为0',
        icon: 'error'
      })
      return
    }

  }
})