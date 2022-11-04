const footdata = require('../../coatch/coatchFootData.js')
const language = require('../../../util/getLanguageKeyByPage.js')
const img = require('../../../util/getimagesrc.js')
const app = getApp()
const db = wx.cloud.database()
const _ = db.command
var warcher = null;
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
    ready() {
      this.getDatas();
      this.startwarcher();
    }

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
        name: "updateClientOrder",
        data: {
          item: item
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
            order: item.orderId,
            name: '教练暂时不能提供服务'
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
        name: 'getAllClientOrder',
        data: {
          pageIndex: index
        },
        success: res => {
          console.log('[云函数] [getAllClientOrder] : ', res.result)
          this.hideLoading()
          let orderinfo = res.result.data
          if (orderinfo.length < 1) {
            this.setData({
              pageIndex: 0
            })
            return
          }
          for (let i = 0; i < orderinfo.length; i++) {
            data.push(orderinfo[i])
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
    },

    startwarcher() {
      let time = new Date().getTime()
      let that = this
      console.log(time)
      warcher = db.collection('ClientClassOrder').where({
          starttimespan: _.gte(1630069620897)
        })
        .watch({
          onChange: function (snapshot) {
            console.log('start watcher')
            console.log('snapshot', snapshot)
            snapshot.docChanges.forEach(function (item, index) {
              console.log(item)
              if (item.dataType == "remove") {
                for (let i = 0; i < that.data.list.length; i++) {
                  if (that.data.list[i].id == item.doc.id) {
                    that.data.list.splice(i, 1)
                    that.setData({
                      list:that.data.list
                    })
                    break;
                  }
                }
              } else if (item.dataType == "add") {
                that.data.list.unshift(item.doc)
                that.setData({
                  list:that.data.list
                })
              }
            })
          },
          onError: function (err) {
            console.error('the watch closed because of error', err)
          }
        })
    }
  },
  ready() {
    // this.getDatas();
    // this.startwarcher();
  },
})