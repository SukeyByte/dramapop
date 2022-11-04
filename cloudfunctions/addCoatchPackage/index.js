// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})


const db = cloud.database()
const _ = db.command

// 云函数入口函数
exports.main = async (event, context) => {
  let retCode ={
    code:0,
    massage:null
  }
  let status = await db.collection('Package').add({
    data: {
      'coatchid': event.coatchid,
      'status': 0,
      'userid': null,
      'name': event.name,
      'total': event.total,
      'number': event.number,
      'createTime': new Date().getTime()
    },
  }).then(res => {
    retCode.massage = res
    return retCode
  }).catch(err => {
    retCode.code = -1
    retCode.massage = err
    return retCode
  })

  return status
}