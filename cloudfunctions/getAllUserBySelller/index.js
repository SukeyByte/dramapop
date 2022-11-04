// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: 'mail-stg-oboxi'
})
const db = cloud.database()
const _ = db.command
// 云函数入口函数
exports.main = async (event, context) => {
  console.log(event)
  var max_limit = 20
  var status = await db.collection('UserBySeller')
    .aggregate()
    .lookup({
      from: 'Client',
      localField: 'phonenumber',
      foreignField: 'wxphonenumber',
      as: 'userInfo',
    })
    .lookup({
      from: 'Seller',
      localField: 'sellerId',
      foreignField: '_id',
      as: 'sellerInfo',
    }).skip((event.pageIndex - 1) * max_limit).limit(max_limit)
    .end().then(res => {
      return res
    }).catch(err => {
      return err
    })

  var count = await db.collection('UserBySeller').count()
    .then(res => { return res }).catch(err => {
      return err
    })
  return {
    data: status,
    count: count
  }
}