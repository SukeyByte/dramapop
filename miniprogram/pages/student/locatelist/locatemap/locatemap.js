const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    sellerList: null,
    centerX: 114.0214,
    centerY: 22.53076,
    markers: [],
    shop_image: "",
    shop_name: "",
    searchKeyWord: "",
    pagenumber: 1,
    searchCount: 0,
    StatusBar: app.globalData.StatusBar,
    CustomBar: app.globalData.CustomBar,
    Custom: app.globalData.Custom,
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
    let that = this
    wx.getLocation({
      type: 'wgs84',
      success: function (res) {
        console.log(res)
        that.setData({
          centerX: res.longitude,
          centerY: res.latitude
        })
        wx.cloud.callFunction({
          name: 'getNearLocate',
          data: {
            longitude: res.longitude,
            latitude: res.latitude
          },
        }).then(res => {
          console.log(res.result)
          that.setData({
            sellerList: res.result.list
          })
          that.requestMaKers(res.result.list)
        }).catch(err => {
          console.log(err)
        })
      }
    })
  },

  /**
   * 获取门店列表数据
   */
  requestMaKers: function (event) {
    let that = this
    let markers = [];
    for (let i = 0; i < event.length; i++) {
      let marker = that.createMarker(event[i], i);
      markers.push(marker)
    }
    console.log(markers)
    that.setData({
      markers: markers
    })
  },
  /**
   * 创建marker对象
   */
  createMarker(point, id) {
    let marker = {
      id: id || 0,
      name: point.name || '',
      longitude: point.location[0],
      latitude: point.location[1],
      content: point.addressName || '',
      borderWidth: 15,
      borderRadius: 15,
      width: 18,
      height: 30,
    };
    return marker;
  },

  createCircle(point) {
    return circles = {
      latitude: 40.002607,
      longitude: 116.587847,
      color: '#ee7788aa',
      radius: 50,
      fillColor: '#7cb5ec88',
      strokeWidth: 1
    }
  },

  /**
   * 点击marker
   */
  markertap: function (shopitem) {
    let index = shopitem.detail.markerId
    console.log(index)
    console.log(this.data.showData[index])
    let that = this
    that.setData({
      shop_image: that.data.showData[index].shop_image,
      shop_name: that.data.showData[index].shop_name,
    })
  },

  selectLocate(e) {
    let data =  e.currentTarget.dataset.item
    this.mapCtx.moveToLocation({
      longitude: data.location[0],
      latitude: data.location[1],
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.mapCtx = wx.createMapContext('map', this)
  },

  selectItem: function (e) {
    console.log(e)
    wx.setStorageSync('currentSaller', e.currentTarget.dataset.item)
    wx.redirectTo({
      url: '/pages/student/newIndex/newIndex',
    })
  },

  //搜索
  bindSearchInput(e) {
    this.setData({
      searchKeyWord: e.detail.value
    })
  },

  searchData() {
    this.data.pagenumber = 1
    this.setData({
      sellerList: [],
      markers:[]
    })
    this.search()
  },

  search() {
    let that = this
    this.showLoading('查找中...')
    wx.cloud.callFunction({
      name: 'getLocateByKey',
      data: {
        'pageIndex': this.data.pagenumber,
        'key': this.data.searchKeyWord
      }
    }).then(res => {
      console.log(res)
      res.result.data.forEach(function (element, index, array) {
        // console.info(element); //当前元素的值
        // console.info(index); //当前下标
        // console.info(array); //数组本身 
        that.data.sellerList.push(element)
      })
      this.setData({
        pagenumber: this.data.pagenumber,
        sellerList: this.data.sellerList
      })
      this.requestMaKers(this.data.sellerList)
      if (this.data.searchCount != res.result.count) {
        this.data.searchCount = res.result.count
      }
      this.hideLoading()
    }).catch(err => {
      console.log(err)
      this.hideLoading()
    })
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