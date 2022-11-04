// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  //env: 'mail-stg-oboxi'
  env:cloud.DYNAMIC_CURRENT_ENV
})

// 云函数入口函数
exports.main = async (event, context) => {
  console.log("getSellerInfoBySellerIdCoun="+event)
  const db = cloud.database()
  var userCount = await db.collection('UserBySeller').where({
    SellerId:event.sellerId
  }).count().then(res => {
    return res.total
  })
  //合作教练
  var CoatchCounth = await db.collection('Coatch').where({
    "seller._id":event.sellerId
  }).count().then(res => {
    return res.total
  })
    //本部教练
  var CoatchCountb = await db.collection('Coatch').where({
    "seller._id":event.sellerId
  }).count().then(res => {
    return res.total
  })
//会员人数
  var ClientCount = await db.collection('Client').count().then(res => {
    return res.total
  })
  var incomeSum  = await db.collection('Client').count().then(res => {
    return res.total
  })
  console.log("getSellerInfoBySellerIdCoun=SellerCount="+userCount)
  console.log("getSellerInfoBySellerIdCoun=CoatchCounth="+CoatchCounth)
  console.log("getSellerInfoBySellerIdCoun=CoatchCountb="+CoatchCountb)
  console.log("getSellerInfoBySellerIdCoun=incomeSum="+incomeSum)
  return {
    userCount: userCount,
    coatchCounth: CoatchCounth,
    coatchCountb: CoatchCountb,
    clientCount: ClientCount,
    incomeSum:incomeSum
  }
}