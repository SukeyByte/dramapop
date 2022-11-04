// 云函数入口文件 
const cloud = require('wx-server-sdk')

cloud.init({
  env: 'mail-stg-oboxi'
})

const db = cloud.database()
const _ = db.command
/** 
 *  event, 
 *  openid: wxContext.OPENID, 
 *  appid: wxContext.APPID, 
 *  unionid: wxContext.UNIONID, 
 * @param {*} event  
 * @param {*} context  
 */
// 云函数入口函数 
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  console.log(event)
  let status = 0
  status = await db.collection('OrderInfo').add({
    data: {
      'clientId': wxContext.OPENID,
      'buyCardInfo': event.buyInfo,
      'order': event.order,
      'title': event.title,
      'price': event.price,
      'counts': event.counts,
      'totalMoney': event.totalMoney,
      'createTime': new Date().getTime(),
      'payMoney': event.payMoney,
      'sellerId': event.sellerId,
      'mskInfo': event.mskInfo,
      'payType': event.payType,
      'type': event.type,
      'classInfo': event.classInfo,
      'orderStatus': event.orderStatus,
      'balanceMoney': event.balanceMoney,
      'foreignId': event.foreignId
    },
  }).then(res => {
    return 1
  }).catch(err => {
    return 0
  })
  return status
}