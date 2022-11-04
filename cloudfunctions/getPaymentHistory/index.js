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
  //type 为1则为当前选课，type为2则为历史选课
  if (event.MAX_LIMIT != null) {
    MAX_LIMIT = event.MAX_LIMIT
  }
  if (event.pageIndex != null) {
    pageIndex = event.pageIndex
  }

  let count = await db.collection('OrderInfo').where({
    clientId: event.openid,
    sellerId: event.sellerId
  }).count().then(res => {
    console.log(res)
    return res.total
  })

  let result = await db.collection('OrderInfo').where({
    clientId: event.openid,
    sellerId: event.sellerId
  })
    .field({
      title: 1,
      order: 1,
      createTime: 1,
      totalMoney: 1,
      payMoney: 1,
      "buyCardInfo.buyCardInfo.name": 1,
      "mskInfo.name": 1,
      orderStatus: 1,
      balanceMoney: 1,
      payType: 1
    })
    .skip((pageIndex - 1) * MAX_LIMIT)
    .limit(MAX_LIMIT).get().then(res => {
      console.log('[collection]OrderInfo: ', res)
      return res.data
    }).catch(err => {
      return err
    })

  return {
    result: result,
    count: count,
    MAX_LIMIT: MAX_LIMIT
  }
}