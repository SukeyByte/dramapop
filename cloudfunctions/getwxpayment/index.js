// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: 'mail-stg-oboxi'
})

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  // let ip = wxContext.CLIENTIP
  // if (wxContext.CLIENTIP == null || wxContext.CLIENTIP == undefined) {
  //   ip = '127.0.0.1'
  // } else if (wxContext.CLIENTIP.indexOf('.') < -1) {
  //   ip = '127.0.0.1'
  // }
  const res = await cloud.cloudPay.unifiedOrder({
    "body": event.body,
    "outTradeNo": event.order,
    "spbillCreateIp": "127.0.0.1",
    "subMchId": "1548455011",
    "sub_appid": wxContext.APPID,
    "totalFee": event.money,
    "envId": "mail-stg-oboxi",
    "functionName": "getwxpaymentrst"
  })
  return res
}