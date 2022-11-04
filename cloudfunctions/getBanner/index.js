// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: 'mail-stg-oboxi'
})
const db = cloud.database()
const _ = db.command
// 云函数入口函数
//限制5条数据
exports.main = async (event, context) => {
  var status = await db.collection('Banner').limit(5).get().then(res => {
    return res
  }).catch(err => {
    return err
  })
  return status
}