// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  //env: 'mail-stg-oboxi'
  env:cloud.DYNAMIC_CURRENT_ENV
})
const db = cloud.database()
const _ = db.command
// 云函数入口函数
exports.main = async (event, context) => {
  console.log(event)
  var max_limit = 10
  var status = await db.collection('BuyCard').where({
    sellerId: event.sellerId
  }).skip((event.pageIndex - 1) * max_limit).limit(max_limit).get().then(res => {
    return res
  }).catch(err => {
    return err
  })

  let count = await db.collection('BuyCard').where({
    sellerId: event.sellerId
  }).count().then(res => {
    return res
  }).catch(err => {
    return err
  })

  return {
    data: status,
    count: count
  }
}