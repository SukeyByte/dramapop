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
  var max_limit = 10
  let year = new Date().getFullYear() + ''
  let month = (new Date().getMonth() + 1)
  let currentMonth = ''
  if (month < 10) {
    currentMonth = year + '0' + month
  } else {
    currentMonth = year + month
  }

  var status = await db.collection('PaymentLog').aggregate()
    .lookup({
      from: "Client",
      localField: "userInfo.openId",
      foreignField: "openid",
      as: "userList"
    })
    .lookup({
      from: "OrderInfo",
      localField: "outTradeNo",
      foreignField: "order",
      as: "orderList"
    })//关联两张表
    .match({
      timeEnd: db.RegExp({
        regexp: currentMonth,
        options: 'i',
      })
    })//筛选数据
    .replaceRoot({
      newRoot: $.mergeObjects([$.arrayElemAt(['$orderList', 0]), '$$ROOT'])
    })
    .replaceRoot({
      newRoot: $.mergeObjects([$.arrayElemAt(['$userList', 0]), '$$ROOT'])
    })//将联合查询结果作为跟节点输出
    .project({
      outTradeNo: 1,
      cashFee: 1,
      timeEnd: 1,
      'wxuserInfo.nickName': 1,
      title: 1,
      wxphonenumber: 1,
    })//选择展示哪些数据
    .sort({
      timeEnd:-1
    })
    .skip((event.pageIndex - 1) * max_limit).limit(max_limit).end()

  let count = await db.collection('PaymentLog').where({
    timeEnd: db.RegExp({
      regexp: currentMonth,
      options: 'i',
    })
  }).count().then(res => {
    return res
  }).catch(err => {
    return err
  })

  return {
    data: status,
    count: count,
    currentMonth: currentMonth
  }
}