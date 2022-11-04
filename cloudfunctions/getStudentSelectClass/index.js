// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: 'mail-stg-oboxi'
})

const db = cloud.database()
const _ = db.command
const $ = db.command.aggregate
// 云函数入口函数
exports.main = async (event, context) => {
  console.log(event)
  let MAX_LIMIT = 10
  let pageIndex = 1
  let type = 1
  //type 为1则为当前选课，type为2则为历史选课
  if (event.MAX_LIMIT != null) {
    MAX_LIMIT = event.MAX_LIMIT
  }
  if (event.pageIndex != null) {
    pageIndex = event.pageIndex
  }
  if (event.type != null) {
    type = event.type
  }


  let count = await db.collection('ClientByClass').aggregate()
    .lookup({
      from: "ClassInfo",  //从哪个集合产生关联
      localField: "classId",  //本地字段item
      foreignField: "_id",  //inventory 的sku字段
      as: "classInfo"
    }).match({
      sellerId: event.sellerId,
      openid: event.openid,
      "classInfo.starttimespan": type == 1 ? _.gte(new Date().getTime()) : _.lte(new Date().getTime())
    }).count('count').end().then(res => {
      return res.list[0].count
    }).catch(err => {
      return err
    })

  const result = await db.collection('ClientByClass').aggregate()
    .lookup({
      from: "ClassInfo",  //从哪个集合产生关联
      localField: "classId",  //本地字段item
      foreignField: "_id",  //inventory 的sku字段
      as: "classInfo"
    }).match({
      sellerId: event.sellerId,
      openid: event.openid,
      "classInfo.starttimespan": type == 1 ? _.gte(new Date().getTime()) : _.lte(new Date().getTime())
    })
    .project({
      classTime: 1,
      className: 1,
      coatchName: 1,
      _id: 1,
      status: 1,
      createTime: 1,
      "coatchInfo.number": 1
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