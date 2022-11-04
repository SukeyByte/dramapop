// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: 'mail-stg-oboxi'
})


const db = cloud.database()
const _ = db.command

// 用戶領取新的優惠券
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  let status = await db.collection('mskClient').add({
    data: {
      'mskId': event.mskId,
      'clientId': event.clientId,
      'status': 0,
      'createTime': new Date().getTime(),
      'sellerId':'e62469b25fcce3a400feccfa1a5a979a'
    },
  }).then(res => {
    return res
  }).catch(err => {
    return err
  })

  return status
}