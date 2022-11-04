// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: 'mail-stg-oboxi'
})

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const res = await cloud.cloudPay.refund({
    "sub_appid": wxContext.APPID,
    "refund_desc": event.refunddesc,
    "refund_fee": event.refundmoney,
    "totalFee": event.money,
    "out_refund_no": event.refund,
    "out_trade_no": event.order,
    "sub_mch_id": "1548455011",
    "envId": "mail-stg-oboxi",
    "functionName": "getwxPayRefundtrst"
  })
  return res
}