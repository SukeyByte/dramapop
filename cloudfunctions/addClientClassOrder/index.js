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
  status = await db.collection('ClientClassOrder').add({
    data:event
  }).then(res => {
    return res
  }).catch(err => {
    return err
  })

  return status
}