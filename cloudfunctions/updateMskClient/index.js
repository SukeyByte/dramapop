// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

const db = cloud.database()
const _ = db.command

// 云函数入口函数
exports.main = async (event, context) => {
  let status = await db.collection('mskClient')
    .doc(event.id)
    .update({
      data: {
        clientId: event.clientId,
        lastUpdateTime: new Date().getTime()
      }
    }).then(res => {
      return true
    }).catch(err => {
      console.error(err)
      return false
    })

  return status
}