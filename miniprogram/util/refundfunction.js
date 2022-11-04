/*****************************************
 * 退款计算
 * 传入订单编号,退款的比例（应用于现金和余额）,是否退还优惠券（默认退还）
 * 传出需要退的现金的金额
 * 并增加退款订单
******************************************/
const db = wx.cloud.database()
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
  if (orderinfo == null) {
    return 0
  }
  let orderDetail = orderinfo[0]
  //进行卡片的退还
  if (orderDetail.buyCardInfo != null) {
    if (orderDetail.clientCardInfo.length > 0) {
      if (orderDetail.clientCardInfo[0].type == 0 && orderDetail.clientCardInfo[0].useType == 1) {
        db.collection('BuyCardByClient').doc(orderDetail.buyCardInfo)
          .update({
            data: {
              totalCounts: orderDetail.clientCardInfo[0].totalCounts + 1
            }
          })
        // 次数卡退还次数，不退费，异步处理
        return 0
      }
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
  let balance = totalpay - parseFloat(orderDetail.payMoney)
  let cash = parseFloat(orderDetail.payMoney)
  //计算实际需要退还的余额
  let perbalance = (parseFloat(percent * balance) / 100).toFixed(2)
  //计算实际需要退还的现金
  let percash = (parseFloat(percent * cash) / 100).toFixed(2)

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
        amount : (parseFloat(client.amount) + perbalance).toFixed(2)
      }
    }).then(res => {
      return res.data[0]
    }).catch(err => {
      return null
    })
  }
  //现金支付如果有剩余则返回现金支付的金额
  return percash;
}

module.exports = {
  refund
}