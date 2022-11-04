// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

const db = cloud.database()
const _ = db.command
const $ = db.command.aggregate
// 云函数入口函数
exports.main = async (event, context) => {
  console.log(event)
  let MAX_LIMIT = 10
  let pageIndex = 1
  //type 为1则为当前选课，type为2则为历史选课
  if (event.MAX_LIMIT != null) {
    MAX_LIMIT = event.MAX_LIMIT
  }
  if (event.pageIndex != null) {
    pageIndex = event.pageIndex
  }


  let count = await db.collection('Package').where({
    coatchid: event.openid
  }).count().then(res => {
      return res
    }).catch(err => {
      return err
    })

  const result = await db.collection('Package').aggregate()
    .lookup({
      from: "Client", 
      localField: "userid", 
      foreignField: "openid", 
      as: "userinfo"
    }).match({
      coatchid: event.openid
    })
    .sort({
      createTime: -1
    })
    .skip((pageIndex - 1) * MAX_LIMIT)
    .limit(MAX_LIMIT).end().then(res => {
      console.log(res)
      return res.list
    }).catch(err => {
      return err
    })

  return {
    result: result,
    count: count
  }
}