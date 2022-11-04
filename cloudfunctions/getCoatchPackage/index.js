// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})
const db = cloud.database()
const _ = db.command
// 云函数入口函数
exports.main = async (event, context) => {
  console.log(event)
  var status = await db.collection('Package')
  .doc(event.id)
  .get().then(res => {
    return res
  }).catch(err => {
    return err
  })
  return status
}