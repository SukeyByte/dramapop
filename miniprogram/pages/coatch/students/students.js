const app = getApp()
Component({
  options: {
    addGlobalClass: true,
  },
  /**
   * 组件的属性列表
   */
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {
    studentlist: [],
    loadModal: false,
    loadingtext: ''
  },

  lifetimes: {
    attached() {
      this.showLoading(
        '正在查询学员信息'
      )
      wx.cloud.callFunction({
        name: 'getStudentRelationship',
        data: {
          'openid': app.globalData.openid
        }
      }).then(res => {
        console.log(res)
        if (res.result.data.length > 0) {
          this.setData({
            studentlist: res.result.data
          })
        }
        this.hideLoading()
      })
    }
  },

  /**
   * 组件的方法列表
   */
  methods: {
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

    makecall(e) {
      console.log(e)
      wx.makePhoneCall({
        phoneNumber: e.currentTarget.dataset.phone,
      })
    },

    startsync() {
      this.showLoading(
        '正同步学员信息，这可能需要一点时间'
      )
      wx.cloud.callFunction({
        name: 'addSyncStudentRelationship',
        data: {
          'openid': app.globalData.openid
        }
      }).then(res => {
        console.log(res.result.list.filter(item => delete item._id))
        if (res.result.list.length > 0) {
          wx.setStorageSync('hasStudentInfo', true)
          this.setData({
            studentlist: res.result.list
          })
        }
        this.hideLoading()
      })
    }
  }
})
