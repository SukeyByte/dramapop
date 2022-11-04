const footdata = require('../../coatch/coatchFootData.js')
const language = require('../../../util/getLanguageKeyByPage.js')
const img = require('../../../util/getimagesrc.js')
const app = getApp()
Component({
  options: {
    addGlobalClass: true,
  },
  /**
   * 组件的属性列表
   */
  properties: {
    pageCode: {
      type: [Array],
      default: []
    },
  },

  /**
   * 组件的初始数据
   */
  data: {
    imgsrc: img.blanksrc(),
    dataList: [],
    pageCode: [],
    page: 1,
    pageIndex: 1,
    list: new Array(),
    loadModal: false,
    loadingtext: '',
    sallerName: '种马波普',
    total: 0,
    templateId: 'K42vDO5R4i72tcmUlWFsUC_3Qelgq66cEp2Z7UQFJ9Y'
  },

  lifetimes: {
  },

  /**
   * 组件的方法列表
   */
  methods: {
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
    //确认按钮
    accapt: function (e) {
      this.showLoading('正在确认')
      console.log(e.currentTarget.dataset.id + '' + e.currentTarget.dataset.status)
      console.log(e.currentTarget.dataset.index)
      if (this.data.list[e.currentTarget.dataset.index].confirmStatus == 1) {
        this.hideLoading()
        return;
      }
      console.log(e.currentTarget.dataset.item)
      let item = e.currentTarget.dataset.item
      wx.cloud.callFunction({
        name: 'sendMessage',
        data: {
          'openid': item.openid,
          'data': {
            'thing1': {
              'value': item.name
            },
            'thing4': {
              'value': '预约成功！'
            },
            'thing7': {
              'value': '上课详情请在小程序中查看详情'
            }
          },
          'templateId': this.data.templateId
        }
      })

      wx.cloud.callFunction({
        name: "updateConfirmStatus",
        data: {
          id: item._id
        }
      }).then(res => {
        this.setData({
          ["list[" + e.currentTarget.dataset.index + "].confirmStatus"]: 1,
        })
        this.hideLoading()
      }).catch(err => {
        this.hideLoading()
      })
    },

    confirm: function (e) {
      this.showLoading('正在修改')
      console.log(e.currentTarget.dataset.id + '' + e.currentTarget.dataset.status)
      console.log(e.currentTarget.dataset.index)
      if (parseInt(e.currentTarget.dataset.status) == 2) {
        let item = e.currentTarget.dataset.item
        //先退款
        wx.cloud.callFunction({
          name: 'getrefund',
          data: {
            order:item.orderId,
            name:'教练暂时不能提供服务'
          }
        })
        //再发通知
        wx.cloud.callFunction({
          name: 'sendMessage',
          data: {
            'openid': item.openid,
            'data': {
              'thing1': {
                'value': item.name
              },
              'thing4': {
                'value': '教练已取消！'
              },
              'thing7': {
                'value': '款项将原路退回'
              }
            },
            'templateId': this.data.templateId
          }
        })
      }
      let that = this
      wx.cloud.callFunction({
        name: 'updateClassStatus',
        data: {
          'id': e.currentTarget.dataset.id,
          'status': parseInt(e.currentTarget.dataset.status)
        },
        success: res => {
          console.log('[云函数] [updateClassStatus] result: ', res.result)
          that.setData({
            ["list[" + e.currentTarget.dataset.index + "].status"]: parseInt(e.currentTarget.dataset.status)
          })
        },
        fail: err => {
          console.error('[云函数] [updateClassStatus] 调用失败', err)
        },
        complete: res => {
          this.hideLoading()
        }
      })
      this.hideLoading()
    },

    scrollToLower: function () {
      if (this.data.total >= ((this.data.pageIndex - 1) * 10)) {
        this.getDatas();
      }
    },
    makephonecall(e) {
      console.log(e)
      wx.makePhoneCall({
        phoneNumber: e.currentTarget.dataset.phone,
      })
    },
    async getDatas() {
      this.showLoading('正在载入..')
      let that = this
      var index = that.data.pageIndex
      if (index < 0) return
      const data = that.data.list
      wx.cloud.callFunction({
        name: 'getMyClassPage',
        data: {
          pageIndex: index,
          sellerId: app.globalData.sallerinfo._id,
          coatchId: app.globalData.openid
        },
        success: res => {
          console.log('[云函数] [login] getMyClassPage: ', res.result)
          this.hideLoading()
          let coatchInfo = res.result.result
          if (coatchInfo.length < 1) {
            this.setData({
              pageIndex: 0
            })
            return
          }
          for (let i = 0; i < coatchInfo.length; i++) {
            data.push(coatchInfo[i])
          }
          index++
          this.setData({
            list: data,
            pageIndex: index
          })
          this.data.total = res.result.count
        },
        fail: err => {
          console.error('[云函数] [getMyClassPage] 调用失败', err)
          this.hideLoading()
        },
        complete: res => {
          this.hideLoading()
        }
      })
    }
  },
  ready() {
    this.getDatas();
  },
})