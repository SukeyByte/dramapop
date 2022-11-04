// miniprogram/pages/detail/detail.js
const app = getApp()
const sendMessage = require('../../../util/sendMessage.js')
const time = require('../../../util/now.js')
const language = require('../../../util/getLanguageKeyByPage.js')
Page({

  /**
   * Page initial data
   */
  data: {
    itemId: '',
    itemName: '',
    userName: '',
    createDate: '',
    images: [],
    rules: [],
    avatarUrl: '',
    read: 0,
    command: 0,
    commit: 0,
    isCommand: false,
    message: '',
    messageList: [],
    repeatfocus: false,
    isrepeat: false,
    repeatid: '',
    repeatuser: '',
    repeatname: '',
    repeatindex: '',
    datails: '',
    userId: '',
    joinList: [],
    joincount: 0,
    price: 0,
    pageCode: null,
    status: 0, 
    pageIndex: 1
  },

  /**
   * Lifecycle function--Called when page load
   */
  onLoad: function(options) {
    var that = this
    console.log(options)
    this.data.itemId = options.id
    const db = wx.cloud.database().collection('ItemDetails')
    const dbCommand = wx.cloud.database().collection('CommandDetail')
    const dbMessage = wx.cloud.database().collection('ItemMessage')
    const dbJoin = wx.cloud.database().collection('JoinItems')
    const _ = db.command
    db.where({
      _id: options.id
    }).get().then(res => {
      console.log(res)
      wx.hideLoading()
      this.setData({
        itemName: res.data[0].itemName,
        userName: res.data[0].userName,
        userId: res.data[0].userId,
        createDate: res.data[0].createDate,
        images: res.data[0].images,
        rules: res.data[0].ruleList,
        avatarUrl: res.data[0].avatarUrl,
        read: res.data[0].read + 1,
        command: res.data[0].command,
        commit: res.data[0].commit,
        datails: res.data[0].itemDetail,
        price: res.data[0].price,
        status:res.data[0].status
      })
      db.doc(options.id).update({
        data: {
          read: res.data[0].read + 1
        },
        success: function(res) {
          console.log('更新成功')
        }
      })
    })
    language.getLanguage('detail').then(res => {
      console.log(res)
      this.setData({
        pageCode: res
      })
    })
    dbCommand.where({
      _openid: app.globalData.openId,
      itemId: options.id,
    }).get().then(res => {
      console.log(res)
      if (res.data.length > 0) {
        that.setData({
          isCommand: true
        })
      }
    }).catch(res => {
      console.log(res)
    })
    this.getDatas();
    dbJoin.where({
      itemId: options.id,
    }).limit(3).get().then(res => {
      console.log(res.data)
      that.setData({
        joinList: res.data
      })
    })

    dbJoin.where({
      itemId: options.id,
    }).count().then(res => {
      console.log(res)
      that.setData({
        joincount: res.total
      })
    })
  },  /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
  onPullDownRefresh: function () {
    console.log("1111111");
    wx.showNavigationBarLoading() //在标题栏中显示加载 
    setTimeout(() => {
      console.log("222222");
      wx.hideNavigationBarLoading() //完成停止加载 
      console.log("33333");
      wx.stopPullDownRefresh() //停止下拉刷新 
    }, 2000)
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    console.log('hi')
    this.getDatas();
    setTimeout(() => {
      wx.hideLoading()
    }, 2000)
  }, scrollToLower: function () {
    console.log('scrollToLower')
    this.getDatas();
  },
  async getDatas() {
    const MAX_LIMIT = 15;
    let that = this
    var index = that.data.pageIndex
    if (index < 0) return
    const db = wx.cloud.database()
    const _ = db.command
    const data = that.data.messageList
    let coatchInfo = await db.collection('ItemMessage').where({
      itemId: that.data.itemId
    }).orderBy('createDate', 'desc').skip((index - 1) * MAX_LIMIT).limit(MAX_LIMIT).get()
    if (coatchInfo.length < 1) {  
      this.setData({
        pageIndex: 0
      })
      return
    }
    index++
    for (let i = 0; i < coatchInfo.data.length; i++) {
      data.push(coatchInfo.data[i])
    }
    this.setData({
      messageList: data,
      pageIndex: index
    })
     
  },setMessage:function(){
    console.log('requestSubscribeMessage')
    var that=this
    wx.requestSubscribeMessage({
      tmplIds: ['1HBFbIX33RfZb-ybbR3so2U84NmnicTtBwiwAtnPTNc'],
      success(res) {
        console.log('requestSubscribeMessage+++success' + res)
      }, fail(res){
        console.log('requestSubscribeMessage+++fail' + res.errMsg + "   /n" + res.errCode)
      },complete(res){
        wx.navigateTo({
          url: '../selectLocal/selectLocal?itemId=' + that.data.itemId + '&itemName=' + that.data.itemName + '&price=' + that.data.price,
        })
      }
    })
  },

  /**
   * Lifecycle function--Called when page is initially rendered
   */
  onReady: function() {

  },

  /**
   * Lifecycle function--Called when page show
   */
  onShow: function() {

  },

  /**
   * Lifecycle function--Called when page hide
   */
  onHide: function() {

  },

  /**
   * Lifecycle function--Called when page unload
   */
  onUnload: function() {

  },

  /**
   * Page event handler function--Called when user drop down
   */
  onPullDownRefresh: function() {

  },

  /**
   * Called when page reach bottom
   */
  onReachBottom: function() {

  },

  /**
   * Called when user click on the top right corner to share
   */
  onShareAppMessage: function() {

  },

  commandTap() {
    const db = wx.cloud.database().collection('CommandDetail')
    const dbitem = wx.cloud.database().collection('ItemDetails')
    let that = this
    if (!this.data.isCommand) {
      db.add({
        data: {
          userId: app.globalData.openId,
          itemId: this.data.itemId,
          isCommand: true,
          createTime: new Date()
        },
        success: function(res) {
          console.log(res)
          wx.cloud.callFunction({
            name: "updateCommand",
            data: {
              itemId: that.data.itemId,
              command: that.data.command + 1
            },
            success(res) {
              console.log("提交成功")
              that.setData({
                command: that.data.command + 1, //浏览次数
                isCommand: true
              })
              wx.showToast({
                icon: 'none',
                title: that.data.pageCode.index011,
              })
            },
            fail(res) {
              wx.showToast({
                icon: 'none',
                title: that.data.pageCode.index012,
              })
              console.log("提交失败", res)
            },
            complete: res => {
              wx.hideLoading()
            }
          })
        }
      })
    } else {
      wx.cloud.init()
      wx.cloud.callFunction({
        name: 'removeCommand',
        data: {
          openId: app.globalData.openId,
          itemId: that.data.itemId,
          command: that.data.command - 1, //浏览次数
        },
        success: res => {
          dbitem.doc(that.data.itemId).update({
            data: {
              command: that.data.command - 1
            },
            success: function(res) {
              that.setData({
                command: that.data.command - 1,
                isCommand: false
              })
              console.log('更新成功')
            }
          })
        }
      })
    }

  },

  cardSwiper(e) {
    this.setData({
      cardCur: e.detail.current
    })
  },

  messageinput(e) {
    this.setData({
      message: e.detail.value
    })
  },

  sendMessage(e) {
    if (!this.data.message) {
      return;
    }
    let that = this
    wx.showLoading({
      title: that.data.pageCode.index013,
    })
    const db = wx.cloud.database().collection('ItemMessage')
    db.add({
      data: {
        itemId: that.data.itemId,
        message: that.data.message,
        userId: app.globalData.openid,
        userName: app.globalData.userInfo.nickName,
        avatarUrl: app.globalData.userInfo.avatarUrl,
        createDate: time.now,
        read: 0,
        command: 0,
        commit: 0,
        childrenMessage: []
      },
      success: res => {
        console.log('[数据库] [新增记录] 成功，记录 _id: ', res._id)
        var s = that.data.messageList
        console.log(s)
        s.unshift({
          _id: res._id,
          itemId: that.data.itemId,
          message: that.data.message,
          userId: app.globalData.openid,
          userName: app.globalData.userInfo.nickName,
          avatarUrl: app.globalData.userInfo.avatarUrl,
          createDate: time.now,
          read: 0,
          command: 0,
          commit: 0,
          childrenMessage: []
        })
        sendMessage.send(that.data.userId, that.data.userName, that.data.message, 1, that.data.itemId)
        that.setData({
          messageList: s,
          message: ''
        })
        that.updateMessageNumber()
        wx.showToast({
          icon: 'none',
          title: that.data.pageCode.index014,
        })
      },
      fail: err => {
        wx.showToast({
          icon: 'none',
          title: that.data.pageCode.index015,
        })
        console.error('[数据库] [新增记录] 失败：', err)
      },
      complete: res => {
        wx.hideLoading()
      }
    })

  },

  messageblur(e) {
    console.log(e)
    this.setData({
      repeatfocus: false,
    })
    console.log(this.data.isrepeat)
  },

  repeat(e) {

    this.setData({
      repeatfocus: true,
      isrepeat: true,
      repeatid: e.currentTarget.dataset.id,
      repeatuser: e.currentTarget.dataset.repeatuser,
      repeatname: e.currentTarget.dataset.repeatname,
      repeatindex: e.currentTarget.dataset.index
    })
  },

  updateMessageNumber: function() {
    let that = this
    const db = wx.cloud.database().collection('ItemDetails')
    db.doc(that.data.itemId).update({
      data: {
        commit: that.data.commit + 1
      },
      success: function(res) {
        console.log('更新成功')
        that.setData({
          commit: that.data.commit + 1
        })
      }
    })
  },

  joinInBuy() {
    var that=this
    if (app.globalData.userInfo == null) {
      wx.navigateBack()
      wx.showToast({
        icon: "none",
        title: that.data.pageCode.index016,
      })
      return;
    }
    const db = wx.cloud.database().collection('JoinItems')

    db.where({
      _openid: app.globalData.openid,
      itemId: that.data.itemId
    }).get().then(res => {
      console.log(res);
      if (res.data.length > 0) {
        wx.showToast({
          title: that.data.pageCode.index017,
        })
        return;
      } else {
        var data = {
          userId: app.globalData.openId,
          itemId: that.data.itemId,
          createTime: time.now,
          itemName: that.data.itemName,
          userInfo: app.globalData.userInfo
        }
        that.setMessage()
      }
    })
  },

})