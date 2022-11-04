const app = getApp()
const footdata = require('../../student/studentFootData.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    StatusBar: app.globalData.StatusBar,
    CustomBar: app.globalData.CustomBar,
    Custom: app.globalData.Custom,
    sellerName: '正在获取健身房信息...',
    bannerList: [],
    note: []
  },
  /******自主定义事件******/
  tobanner(e) {
    if (e.currentTarget.dataset.type == 0) {
      wx.navigateTo({
        url: e.currentTarget.dataset.url,
      })
    } else if (e.currentTarget.dataset.type == 1) {
      wx.navigateTo({
        url: e.currentTarget.dataset.url,
      })
    } else {
      wx.navigateTo({
        url: '../webview/webview?url=' + e.currentTarget.dataset.url,
      })
    }
  },
  //四个导航按键指向的路径
  navLocation: function () {
    wx.navigateTo({
      url: '/pages/student/sporttime/sportTime',
    })
  },

  toClass() {
    wx.redirectTo({
      url: '/pages/student/class/mainclass',
    })
  },

  toLocatelist() {
    wx.navigateTo({
      url: '/pages/student/locatelist/locatelistshow/locates',
    })
  },

  selectLocate() {
    wx.navigateTo({
      url: '/pages/student/locatelist/locatemap/locatemap',
    })
  },

  getLocation: function () {
    wx.getLocation({
      type: 'wgs84',
      success: function (res) {
        console.log(res)
        wx.openLocation({ //​使用微信内置地图查看位置。
          latitude: parseFloat(app.globalData.sallerinfo.x), //要去的纬度-地址
          longitude: parseFloat(app.globalData.sallerinfo.y), //要去的经度-地址
          name: app.globalData.sallerinfo.name,
          address: app.globalData.sallerinfo.addressName,
          success: function (res) {
            wx.hideLoading()
          },
          fail: function (res) {
            console.log(res)
          }
        })
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    footdata.footDataList('newIndex').then(res => {
      this.setData({
        dataList: res,
        bannerList: app.globalData.bannerList
      })
    })
    console.log(app.globalData.sallerinfo)
    //没获取到最近的健身房信息时，从数据库查找最近的健身房
    if (!app.globalData.sallerinfo) {
      let that = this
      //先获取当前位置信息
      wx.getLocation({
        type: 'wgs84',
        success: function (res) {
          console.log(res)
          wx.cloud.callFunction({
            name: 'getNearLocate',
            data: {
              longitude: res.longitude,
              latitude: res.latitude
            },
          }).then(res => {
            console.log(res.result)
            that.setData({
              sellerName: res.result.list[0].name
            })
            app.globalData.sallerinfo = res.result.list[0]
            wx.setStorage({
              key: 'currentSaller',
              data: res.result.list[0]
            })
          }).catch(err => {
            console.log(err)
          })
        }
      })
    } else {
      this.setData({
        sellerName: app.globalData.sallerinfo.name
      })
    }

    wx.cloud.callFunction({
      name: 'getSimpleRecommand',
    }).then(res => {
      console.log(res.result)
      this.setData({
        note: res.result.list
      })
    }).catch(err => {
      console.log(err)
    })
  },

  navgateToType: function (e) {
    let type = e.currentTarget.dataset.type
    if (type === 1) {
      wx.navigateTo({
        url: '../coatchdetailpages/coatchdetailpages?id=' + e.currentTarget.dataset.id,
      })
    } else if (type === 2) {
      //根据ID获取URL
      wx.cloud.callFunction({
        name: 'getActiveById',
        data: {
          id:e.currentTarget.dataset.id
        },
      }).then(res => {
        console.log(res)
        wx.navigateTo({
          url: res.result.data[0].url,
        })
      }).catch(err=>{
        wx.showToast({
          title: '网络出现点问题~',
          icon:'error'
        })
      })

    } else if (type === 3) {
      wx.navigateTo({
        url: '../../sellerDetail/seller?id=' + e.currentTarget.dataset.id,
      })
    } else if (type === 4) {} else if (type === 5) {
      this.order(e)
    }
  },

  async order(e) {

    //判断登陆
    if (app.globalData.openid == null || app.globalData.openid == undefined) {
      wx.redirectTo({
        url: '/pages/student/mine/mine',
      })
      return
    }
    let that = this

    const db = wx.cloud.database()
    const _ = db.command
    const coatchInfoList = await db.collection('ClientByClass').where({
      classId: e.currentTarget.dataset.classid,
      status: _.neq(2)
    }).get().then(res => {
      return res
    })
    if (coatchInfoList.data.length >= e.currentTarget.dataset.total && coatchInfoList.data.length > 0) {
      wx.showToast({
        title: '已经被预约满',
        icon: 'none'
      })
      return false;
    }
    let coatchInfoStatsList = await db.collection('ClientByClass').where({
      classId: e.currentTarget.dataset.classid,
      status: 2
    }).get().then(res => {
      return res
    })
    if (coatchInfoStatsList.data.length >= e.currentTarget.dataset.total && coatchInfoStatsList.data.length > 0) {
      wx.showToast({
        title: '已经被教练取消',
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
    wx.requestSubscribeMessage({
      tmplIds: ['K42vDO5R4i72tcmUlWFsUC_3Qelgq66cEp2Z7UQFJ9Y'],
      success(res) {
        if (res.confirm) {
          //调用订阅消息
          console.log('用户点击确定');
        } else if (res.cancel) {
          console.log('用户点击取消');
        }
      },
      fail(res) {
        console.log('用户点击取消');
        console.log(that.tmplIds + res.errMsg + "   /n" + res.errCode)
      },
      complete: (errMsg) => {
        wx.navigateTo({
          url: '/pages/student/classOrderDetails/classOrderDetails?classId=' + e.currentTarget.dataset.classid,
        })
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
    let that = this
    wx.cloud.callFunction({
      name: 'getSimpleRecommand',
    }).then(res => {
      console.log(res.result)
      res.result.list.forEach(function (sditem, index) {
        that.data.note.push(sditem)
      })
      that.setData({
        note: that.data.note
      })
    }).catch(err => {
      console.log(err)
    })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})