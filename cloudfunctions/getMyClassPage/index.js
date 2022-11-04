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
  if (event.type != null) {
    type = event.type
  }

  let count = await db.collection('ClientByClass').where(_.or({
    "classInfo.endtimespan":_.gte(new Date().getTime())
  }, {
    status: 0
  }).and({
    sellerId: event.sellerId,
    "coatchInfo._openid": event.coatchId,
  })).count().then(res => {
    return res.total
  }).catch(err => {
    return err
  })


  let result = await db.collection('ClientByClass').aggregate()
    .lookup({
      from: "ClassInfo",  //从哪个集合产生关联
      localField: "classId",  //本地字段item
      foreignField: "_id",  //inventory 的sku字段
      as: "classInfo"
    }).match(_.or({
      "classInfo.endtimespan":_.gte(new Date().getTime())
    }, {
      status: 0
    }).and({
      sellerId: event.sellerId,
      "coatchInfo._openid": event.coatchId
    }))
    .replaceRoot({
      newRoot: $.mergeObjects([$.arrayElemAt(['$classInfo', 0]), '$$ROOT'])
    })
    .project({
      'clientInfo.wxuserInfo.avatarUrl': 1,
      name: 1,
      classTime: 1,
      'clientInfo.wxuserInfo.nickName': 1,
      'clientInfo.wxphonenumber': 1,
      status: 1,
      _id: 1,
      confirmStatus: 1,
      sellerId: 1,
      starttimespan: 1,
      showtype: 1,
      endtimespan: 1,
      coatchbenefits: 1,
      date: 1,
      openid: 1,
      className: 1,
      confirmStatus: 1,
      orderId: 1
    })
    .skip((pageIndex - 1) * MAX_LIMIT).limit(MAX_LIMIT).end().then(res => {
      return res.list
    }).catch(err => {
      return err
    })


  return {
    result: result,
    count: count
  }
}