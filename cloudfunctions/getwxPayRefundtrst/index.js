// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: 'mail-stg-oboxi'
})

const db = cloud.database()
const _ = db.command
// 云函数入口函数
exports.main = async (event, context) => {
  let errcode = 0, errmsg = ''
  let result = await db.collection('RefundLog').add({
    data: event,
  }).then(res => {
    return res
  }).catch(err => {
    return err
  })
  updateOrderStatus(2, event.outRefundNo, event.refundFee)
  return {
    errcode, errmsg
  }
}

function updateOrderStatus(result, outTradeNo, fee) {
  db.collection('OrderInfo').where({
    order: outTradeNo
  }).update({
    data: {
      orderStatus: result,
      payMoney: parseFloat(fee / 100).toFixed(2)
    }
  })
}
