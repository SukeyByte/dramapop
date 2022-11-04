// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: 'mail-stg-oboxi'
})

const db = cloud.database()
const _ = db.command
const $ = db.command.aggregate

// 云函数入口函数
exports.main = async (event, context) => {
  let oldorder = event.order
  let neworder = 'R' + oldorder.substr(1)
  let name = '时刻享健-服务退款'
  if (event.name != null || event.name != undefined) {
    name = event.name
  }
  refund(event.order).then(res => {
    console.log(res)
    if (res != 0) {
      cloud.callFunction({
        name: 'getwxPayRefund',
        data: {
          refunddesc: name,
          refundmoney: res.percash,
          money: res.totalpay,
          order: event.order,
          refund: neworder
        }
      }).then(res => {
        console.info(res)
      }).catch(err => {
        console.error(err)
      })
    }
  })
}

async function saveOrder(orderInfo, cardPay = false) {
  console.log(orderInfo)
  let oldorder = orderInfo.order
  let neworder = 'R' + oldorder.substr(1)
  console.log(neworder)
  let satus = 0
  if (cardPay) {
    satus = 2
  }

  db.collection('OrderInfo').add({
    data: {
      'clientId': orderInfo.clientId,
      'buyCardInfo': orderInfo.buyInfo,
      'order': neworder,
      'title': orderInfo.title,
      'price': orderInfo.price,
      'counts': orderInfo.counts,
      'totalMoney': orderInfo.totalMoney,
      'createTime': new Date().getTime(),
      'payMoney': orderInfo.payMoney,
      'sellerId': orderInfo.sellerId,
      'mskInfo': orderInfo.mskInfo,
      'payType': orderInfo.payType,
      'type': orderInfo.type,
      'classInfo': orderInfo.classInfo,
      'orderStatus': satus,
      'balanceMoney': orderInfo.balanceMoney,
      'foreignId': orderInfo.foreignId
    },
  })
}

/*****************************************
 * 退款计算
 * 传入订单编号,退款的比例（应用于现金和余额）,是否退还优惠券（默认退还）
 * 传出需要退的现金的金额
 * 并增加退款订单
******************************************/

async function refund(orderNumber, percent = 100, refundmsk = true) {
  //获取订单详情
  let orderinfo = await db.collection('OrderInfo').aggregate()
    .lookup({
      from: "BuyCardByClient",  //从哪个集合产生关联
      localField: "buyCardInfo",  //本地字段item
      foreignField: "_id",  //inventory 的sku字段
      as: "clientCardInfo"
    })
    .match({
      order: orderNumber
    }).end().then(res => {
      return res.list
    }).catch(err => {
      console.log(err)
      return null
    })

  console.log('orderinfo', orderinfo)
  if (orderinfo == null) {
    return 0
  }
  let orderDetail = orderinfo[0]
  //进行卡片的退还
  if (orderDetail.buyCardInfo != null) {
    if (orderDetail.buyCardInfo.type == 0 && orderDetail.buyCardInfo.useType == 1) {
      console.log('buyCardInfo', orderDetail.buyCardInfo)
      db.collection('BuyCardByClient').doc(orderDetail.buyCardInfo._id)
        .update({
          data: {
            'totalCounts': parseInt(orderDetail.buyCardInfo.totalCounts) + 1
          }
        })
      // 次数卡退还次数，不退费，异步处理
      saveOrder(orderDetail, true)
      return 0
    }
  }

  let mskMoney = 0
  //进行优惠券的退还
  if (refundmsk) {
    if (orderDetail.mskInfo != null) {
      //查询优惠券信息
      mskMoney = await db.collection('mskClient').aggregate()
        .lookup({
          from: "msk",
          localField: "mskId",
          foreignField: "_id",
          as: "mskDetail"
        }).match({
          _id: orderDetail.mskInfo
        }).end().then(res => {
          console.log(res)
          if (res.list.length > 0) {
            return res.list[0].price
          }
          else {
            return 0
          }
        }).catch(err => {
          console.log(err)
          return 0
        })
      db.collection('mskClient').doc(orderDetail.mskInfo)
        .update({
          data: {
            stauts: 0
          }
        })
    }
  }
  //计算总金额，即扣除优惠券剩余应退还多少
  let totalpay = orderDetail.totalMoney - mskMoney
  let balance = parseFloat(orderDetail.balanceMoney)
  let cash = parseFloat(orderDetail.payMoney)
  //计算实际需要退还的余额
  let perbalance = parseFloat(parseFloat(percent * balance) / 100).toFixed(2)
  //计算实际需要退还的现金
  let percash = parseFloat(parseFloat(percent * cash) / 100).toFixed(2)

  //余额支付的退还余额

  let client = await db.collection('Client').where({
    openid: orderDetail.clientId
  }).get().then(res => {
    return res.data[0]
  }).catch(err => {
    return null
  })

  if (client != null) {
    db.collection('Client').where({
      openid: orderDetail.clientId
    }).update({
      data: {
        amount: parseFloat(parseFloat(client.amount) + perbalance).toFixed(2)
      }
    }).then(res => {
      return res.data[0]
    }).catch(err => {
      return null
    })
  }
  saveOrder(orderDetail)
  //现金支付如果有剩余则返回现金支付的金额
  console.log(percash)
  return {
    totalpay: parseFloat(orderDetail.payMoney) * 100,
    percash: parseFloat(percash) * 100
  }
}