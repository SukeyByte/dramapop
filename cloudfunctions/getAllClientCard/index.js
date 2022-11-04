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
  let MAX_LIMIT = 10;
  if (event.MAX_LIMIT != null || event.MAX_LIMIT != undefined) {
    MAX_LIMIT = event.MAX_LIMIT
  }
  const result = await db.collection('BuyCardByClient').aggregate()
    .lookup({
      from: "Client", //从哪个集合产生关联
      localField: 'userId',
      foreignField: 'openid',
      as: "userInfo"
    }).match({
      status: _.neq(2),
      sellerId: event.sellerId,
      'userInfo.wxphonenumber': event.phone === "" ? _.neq(null) : event.phone
    })
    .replaceRoot({
      newRoot: $.mergeObjects([$.arrayElemAt(['$userInfo', 0]), '$$ROOT'])
    })
    .project({
      _id:1,
      'wxphonenumber': 1,
      'buyCardInfo.name': 1,
      'buyCardInfo.money': 1,
      'buyCardInfo.type': 1,
      'buyCardInfo.useType': 1,
      'wxuserInfo.nickName': 1,
    }) //选择展示哪些数据
    .skip((event.pageIndex - 1) * MAX_LIMIT).limit(MAX_LIMIT).end().then(res => {
      console.log(res)
      return res
    }).catch(err => {
      return err
    })

  let count = await db.collection('BuyCardByClient').aggregate()
    .lookup({
      from: "Client", //从哪个集合产生关联
      localField: 'userId',
      foreignField: 'openid',
      as: "userInfo"
    }).match({
      status: _.neq(2),
      sellerId: event.sellerId,
      'userInfo.wxphonenumber': event.phone === "" ? _.neq(null) : event.phone
    })
    .count('buyCardInfo').end().then(res => {
      return res
    }).catch(err => {
      return err
    })

  return {
    data: result,
    count: count
  }
}