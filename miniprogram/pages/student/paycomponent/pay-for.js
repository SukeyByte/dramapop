const app = getApp()
const img = require('../../../util/getimagesrc.js')
const order = require('../../../util/getOrderNum.js')
const parama = require('../../../util/getUsefulParama.js')
const db = wx.cloud.database()
Component({
  /**
   * 传入属性，money是应付金钱
   */
  properties: {
    price: {
      type: Float64Array,
      default: 0
    },
    useType: {
      type: Int32Array,
      default: 0
    },
    resule: {
      type: Boolean,
      default: false
    },
    payType: {
      type: Int32Array,
      default: 0
    },
    title: {
      type: String,
      default: ''
    },
    itemId: {
      type: String,  //用户代金券的商品id  可以是年卡id 或者其他id
      default: ''
    },
    itemCode: {
      type: String,  //用户支付的系统代码
      default: 'YD'//运动
    },
    foreignId: {
      type: String,  //用户支付的系统代码
      default: null//通过外键ID来判断
    },
  },

  /**
   * 组件的初始数据
   */
  data: {
    showpayInfo: true,
    showmsk: false,
    showcard: false,
    imgsrc: img.logosrc(),
    blanksrc: img.blanksrc(),
    buyInfo: null,   //卡片
    mksInfo: null,  //优惠券
    buyId: null,
    mskId: null,
    mskInfo: null,
    price: 0,
    payPrice: 0,
    tmplIds: ['W9D9SN8cRFojxolRaKgcqkdMJ7Oqs3oFisUVOuZS9Vg'],
    amount: 0,//余额
    payAccount: 0,//需要支付的金额
    loadModal: false,
    loadingtext: '',
    MSKList: [],
    buyCardList: [],
    carduseType: 0,
    coatchInfo: {},
    payType: 0,
    itemId: '',
    coastamont: 0
  },

  lifetimes: {
    attached: function (options) {
      console.log(this.properties)
      this.setBuyAndMsk(this.properties)
    },
    ready: function (options) {
      console.log(this.properties)
      this.setBuyAndMsk(this.properties)
    },
  },

  /**
   * 组件的方法列表
   */
  methods: {
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

    async setBuyAndMsk(options) {
      console.log(options)
      this.setData({
        price: options.price,
        payPrice: options.price,
        carduseType: options.useType,
        title: options.title,
        payType: options.payType,
        itemId: options.itemId,
        foreignId: options.foreignId
      })
      let that = this

      var openid = app.globalData.openid
      //获取当前客户的余额
      await db.collection('Client').where({
        openid: openid
      }).get().then(res => {
        console.log(res)
        var amount = 0;
        if (res.data.length == 0) {
          amount = 0;
          return
        }
        amount = res.data[0].amount
        console.log(that.data)
        var payPrice = parseFloat(options.price) - parseFloat(amount)
        let coastamont = -payPrice
        var payAccount = 0
        if (payPrice >= 0) {
          payAccount = parseFloat(amount).toFixed(2)
          coastamont = amount
        }
        if (payPrice < 0) {
          payPrice = 0
          coastamont = options.price
          payAccount = (parseFloat(amount) - parseFloat(this.data.payPrice)).toFixed(2)
        }
        payAccount = (parseFloat(amount) - parseFloat(this.data.payPrice))
        this.setData({
          payPrice: payPrice.toFixed(2),
          amount: amount,
          payAccount: payAccount.toFixed(2),
          coastamont: parseFloat(coastamont).toFixed(2),
        })
      })
    },

    toBuy: function () {
      let useType = this.data.carduseType;
      let that = this
      this.showLoading('正在排列会员卡')
      console.log(useType)
      const db = wx.cloud.database()
      db.collection('BuyCardByClient').where({
        status: 1,
        useType: useType == '3' ? '1' : useType,
        userId: app.globalData.openid
      }).get().then(res => {
        console.log('[云函数]  result: ', res)
        let buyCardList = new Array()
        for (var i = 0; i < res.data.length; i++) {
          var item = res.data[i]
          if (parseInt(item.type) == 1) {
            var date = new Date(), begdate = new Date(item.begTime), enddate = new Date(item.endTime)
            if ((begdate > date || date > enddate)) {
              continue;
            }
          }
          if (parseInt(item.type) == 0 && parseInt(item.totalCounts < 1)) {
            continue;
          }
          buyCardList.push(item)
        }
        console.log(buyCardList)
        this.setData({
          buyCardList: buyCardList
        })
        that.hideLoading()
        return res
      }
      )
      this.setData({
        showpayInfo: false,
        showcard: true,
      })
    },

    toMKS: function () {
      let mskId = this.data.mskId;
      let useType = this.data.useType;
      let price = this.data.price
      this.showLoading('正在传输优惠券')
      wx.cloud.callFunction({
        name: 'getMKSByClient',
        data: {
          openid: app.globalData.openid
        },
        success: res => {
          console.log('[云函数] [getMKSByClient] result: ', res.result)
          this.setMSKList(res.result.list);
        },
        fail: err => {
          console.error('[云函数] [getMKSByClient] 调用失败', err)
        },
        complete: res => {
          this.hideLoading()
        }
      })
      this.setData({
        showmsk: true,
        showpayInfo: false,
      })
    },

    async saveOrderInfo(title, type) {
      let that = this
      console.log(this.data.payPrice)
      let orderNo = order.getOrderNumber(app.globalData.openid, 'L' + this.data.itemCode)//订单号
      app.globalData.sallerinfo = await parama.getSaller().then(res => {
        console.log(res)
        return res
      })
      wx.cloud.callFunction({
        name: 'addOrderByPay',
        data: {
          'buyInfo': this.data.buyInfo,
          'mskInfo': this.data.mskInfo,
          'price': this.data.price,
          'totalMoney': this.data.price,
          'payMoney': this.data.payPrice,
          'classInfo': null,
          'sellerId': app.globalData.sallerinfo._id,
          'counts': 1,
          'order': orderNo,
          'title': title,
          'payType': type,
          'type': this.data.payType,
          'balanceMoney': this.data.coastamont,
          'orderStatus': 0,
          'foreignId': this.data.foreignId
        },
      }).then(res => {
        return res
      }).catch(err => {
        return err
      })

      if (type == 0) {
        if (this.data.buyInfo.type == "0") {//判断是次数的
          db.collection("BuyCardByClient").doc(this.data.buyInfo._id).update({
            data: {
              'totalCounts': parseInt(this.data.buyInfo.totalCounts) - 1
            }
          })
        }
      } else {
        db.collection('Client').where({
          openid: app.globalData.openid
        }).update({
          data:{
            amount: parseFloat(this.data.amount - this.data.coastamont).toFixed(2)
          }
        })
      }

      let needpay = parseInt(parseFloat(that.data.payPrice).toFixed(2) * 100)
      console.log(that.data.payPrice)
      if (needpay == 0 || needpay == 0.00) {
        console.log('this mean need return')
        if (this.data.buyId == null) {
          this.updateStatus()
        }
        this.triggerEvent('paymevent', { 'result': 'payed', 'orderNo': orderNo })
        console.log('this mean need return')
        return;
      }
      //确保数据位准确
      console.log('this mean need to pay')

      let payment = await wx.cloud.callFunction({
        name: 'getwxpayment',
        data: {
          body: title,
          order: orderNo,
          money: needpay
        }
      }).then(res => { return res }).catch(err => { return err })

      console.log(payment)

      const pay = payment.result.payment
      wx.requestPayment({
        ...pay,
        success(res) {
          console.log('pay success', res)
          wx.showToast({
            title: '将从微信确认收款结果，您的余额展示可能有延时',
            icon: null
          })
          that.updateStatus()
          that.triggerEvent('paymevent', { 'result': 'payed', 'orderNo': orderNo })
        },
        fail(res) {
          console.error('pay fail', res)
        }
      })
    },

    async updateStatus() {
      //计算余额和本次支付的关系
      let pr = parseInt(this.data.price * 100)
      console.log(pr)
      let lastamount = this.data.amount * 100
      if (pr < lastamount) {
        lastamount = lastamount - pr
      } else {
        lastamount = 0
      }
      console.log(lastamount)
      console.log(this.data.mskInfo)

      lastamount = parseInt(lastamount / 100).toFixed(2)
      wx.cloud.callFunction({
        name: 'updateAmontandCmsk',
        data: {
          amount: lastamount,
          msk: this.data.mskInfo
        },
      }).then(res => {
        return res
      }).catch(err => {
        return err
      })
    },

    async order(options) {
      console.log(options)
      //用卡片支付的
      let payType = 0
      if (this.data.buyId != null) {
        payType = 0
      } else {
        payType = 1
      }

      this.saveOrderInfo(this.data.title, payType)
    },

    toBank() {
      this.setData({
        showpayInfo: true,
        showmsk: false,
        showcard: false,
      })
    },

    async setMSKList(result) {
      console.log("进来了", result)
      let that = this
      let useType = parseInt(that.data.useType)
      let price = parseFloat(that.data.price)
      let mskList = new Array()
      for (var i = 0; i < result.length; i++) {
        var item = result[i]
        var msk = item.msks[0]
        if (parseInt(msk.status) == 0) {//判断优惠券是否还能用
          continue;
        }
        //判断是否在有效期
        var date = new Date(), begdate = new Date(msk.begTime), enddate = new Date(msk.endTime)
        if (begdate > date || date > enddate) {
          continue;
        }
        item.name = msk.name
        item.begTime = msk.begTime
        item.endTime = msk.endTime
        item.price = msk.price
        item.detai = msk.detai
        item.maxPrice = msk.maxPrice
        item.minPrice = msk.minPrice
        //msk.type类型     0 满减  1 范围减  2 场地减  3  私教减   4 代金券
        //useType  1 私教  2 团课  3 拼客私教
        var mskType = parseInt(msk.type)
        item.mskType = mskType
        if (mskType == 0) {
          item.mskName = "满减"
          if (parseFloat(item.maxPrice) <= price) {
            mskList.push(item)
          }
        } else if (mskType == 1) {
          item.mskName = "范围减"
          if (parseFloat(item.minPrice) <= price && price <= parseFloat(item.maxPrice)) {
            mskList.push(item)
          }
        } else if (mskType == 2 && useType == 2) {
          item.mskName = "场地减"
          mskList.push(item)
        } else if (mskType == 3 && (useType == 1 || useType == 3)) {
          item.mskName = "私教减"
          mskList.push(item)
        } else if (mskType == 4 && that.data.itemId == msk.itemId) {
          item.mskName = "代金券"
          mskList.push(item)
        }
      }

      if (mskList.length > 0) {
        this.setData({
          MSKList: mskList,
          mskId: mskList[0]._id
        })
      }
    },

    checkMsk(e) {
      let mskClient = {}
      this.data.payPrice = this.data.price - this.data.amount
      let msk = e.currentTarget.dataset.item
      console.log(msk)
      mskClient._id = msk.msks[0]._id
      mskClient.name = msk.name
      mskClient.begTime = msk.begTime
      mskClient.endTime = msk.endTime
      mskClient.price = msk.price
      mskClient.detai = msk.detai
      mskClient.maxPrice = msk.maxPrice
      mskClient.minPrice = msk.minPrice
      var payPrice = parseFloat(this.data.payPrice) - parseFloat(mskClient.price)
      if (payPrice < 0) {
        payPrice = 0
      }
      this.setData({
        payPrice: payPrice.toFixed(2),
        mskId: e.currentTarget.dataset.id,
        mskInfo: mskClient,
        buyId: null,
        buyInfo: null
      })
      this.toBank()
    },

    checkBuy(e) {
      this.setData({
        payPrice: (0).toFixed(2),
        coastamont: (0).toFixed(2),
        buyId: e.currentTarget.dataset.id,
        buyInfo: e.currentTarget.dataset.item,
        mskId: null,
        mskInfo: null,
      })
      this.toBank()
    }
  }
})
