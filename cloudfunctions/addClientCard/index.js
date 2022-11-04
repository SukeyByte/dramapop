// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: 'mail-stg-oboxi'
})

const db = cloud.database()
const _ = db.command
// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  console.log(event)

  status = await db.collection('BuyCardByClient').add({
    data: {
      'buyCardId': event.card._id,
      'userId': wxContext.OPENID,
      'status': 0,
      'sellerId': event.seller._id,
      'type': event.card.type,
      'useType': event.card.useType,
      'totalCounts': event.card.totalCounts,
      'buyCardInfo': event.card,
      'createTime': new Date().getTime()
    }
  }).then(res => {
    return res
  }).catch(err => {
    return err
  })

  return status
}