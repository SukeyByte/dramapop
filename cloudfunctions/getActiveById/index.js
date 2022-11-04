// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
   //env: 'mail-stg-oboxi'
   env:cloud.DYNAMIC_CURRENT_ENV
})
const db = cloud.database()
const _ = db.command
// 云函数入口函数
//限制8条数据
exports.main = async (event, context) => {
  var status = await db.collection('Activity').where({
    _id: event.id
  }).get().then(res => {
    return res
  }).catch(err => {
    return err
  })
  return status
}