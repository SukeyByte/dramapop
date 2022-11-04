// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

const db = cloud.database()
const _ = db.command

// 云函数入口函数
exports.main = async (event, context) => {
  console.log(event)
  var status = await db.collection('ClientByClass').doc(event.id).update({
    data: {
      status: parseInt(event.status)
    }
  }).then(res => {
    return res
  }).catch(err => {
    return err
  })
  return status
}