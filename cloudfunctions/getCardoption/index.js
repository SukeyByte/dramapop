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
  var status = await db.collection('BuyCard')
  .field({
    name: true,
    _id: true,
  })
  .get().then(res => {
    return res
  }).catch(err => {
    return err
  })
  return status
}