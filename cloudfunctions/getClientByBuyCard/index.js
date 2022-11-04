// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: 'mail-stg-oboxi'
})
const db = cloud.database()
const _ = db.command
// 云函数入口函数
exports.main = async (event, context) => {
  var openid = event.openid
  console.log(event)
  console.log("用户id" + openid)
  const list = await db.collection('BuyCardByClient').where({
    userId: openid
  }).skip((event.pageIndex - 1) * event.pageSize).limit(event.pageSize).get().then(res => {
    return res.data
  }).catch(err => {
    return err
  })
  const  count = await db.collection('BuyCardByClient').where({
    userId: openid}).count().then(res => {
    return res
  }).catch(err => {
    return err
  })  
  return {
    data: list,
    count: count
  }
}