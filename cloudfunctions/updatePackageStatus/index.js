// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

const db = cloud.database()
const _ = db.command

// 云函数入口函数
exports.main = async (event, context) => {
  let status = await db.collection('Package')
    .doc(event.id)
    .update({
      data: {
        status: event.status,
        lastUpdateTime: new Date().getTime(),
        userid:event.userid
      }
    }).then(res => {
      return true
    }).catch(err => {
      console.error(err)
      return false
    })

  return status
}