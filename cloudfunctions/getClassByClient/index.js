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
  const result = await db.collection('ClassInfo').aggregate()
    .lookup({
      from: "ClientByClass",  //从哪个集合产生关联
      let: {
        classInfoId: '$_id'
      },
      pipeline: $.pipeline()
        .match(_.expr($.and([
          $.eq(['$classId', '$$classInfoId']),
          $.neq(['$status', 2])
        ])))
        .done(),
      as: "userList"
    }).match({
      type: event.type,
      date: event.date,
      starttimespan: _.gte(new Date().getTime())
    }).skip((event.pageIndex - 1) * MAX_LIMIT).limit(MAX_LIMIT).end().then(res => {
      console.log(res)
      return res
    }).catch(err => {
      return err
    })
  return result;
}