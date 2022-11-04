// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: 'mail-stg-oboxi'
})


const db = cloud.database()
const _ = db.command

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  let status

  status = await db.collection('Admins').doc(event.id).update({
    data: {
      'coatchId': event.coatch,
    },
  }).then(res => {
    return res
  }).catch(err => {
    return err
  })

  return status
}