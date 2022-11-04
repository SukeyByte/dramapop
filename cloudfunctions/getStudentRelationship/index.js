// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})


const db = cloud.database()
const _ = db.command

exports.main = async (event, context) => {
  //get all class
  let createtime = new Date().getTime()
  let studentgroup = await db.collection('StudentRelationship')
    .where({
      "coatch": event.openid
    }).limit(100).get()

  return studentgroup
}