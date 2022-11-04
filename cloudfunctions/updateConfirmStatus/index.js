// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: 'mail-stg-oboxi'
})

const db = cloud.database()
const _ = db.command

// 云函数入口函数
exports.main = async (event, context) => {
  let status = await db.collection('ClientByClass')
    .doc(event.id)
    .update({
      data: {
        confirmStatus: 1,
      }
    }).then(res => {
      return true
    }).catch(err => {
      console.error(err)
      return false
    })

  return status
}