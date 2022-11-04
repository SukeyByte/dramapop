// 云函数入口文件
const cloud = require('wx-server-sdk')
const charge = require('charge')
const sport = require('sportTime')
const coatchPackage = require('coatchPackage')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

const db = cloud.database()
const _ = db.command

// 接受支付回调
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  let errcode = 0, errmsg = ''

  await db.collection('PaymentLog').add({
    data: event,
  }).then(res => {
    return res
  }).catch(err => {
    return err
  })

  if (event.resultCode != 'SUCCESS') {
    updateOrderStatus(3, event.outTradeNo, event.totalFee)//异常
    return
  }
  updateOrderStatus(1, event.outTradeNo, event.totalFee)
  if (event.outTradeNo[0] == 'S') {
    charge.charge(event)
  }
  else {
    if (event.outTradeNo[1] == 'Y' && event.outTradeNo[2] == 'D') {
      sport.payed(event.outTradeNo)
    }else if (event.outTradeNo[1] == 'K' && event.outTradeNo[2] == 'B') {//合作教练私教包
      coatchPackage.createCard(event)
    }
  }

  return {
    errcode, errmsg
  }
}


function updateOrderStatus(result, outTradeNo,fee) {
  db.collection('OrderInfo').where({
    order: outTradeNo
  }).update({
    data: {
      orderStatus: result,
      payMoney: parseFloat(fee/100).toFixed(2)
    }
  })
}
