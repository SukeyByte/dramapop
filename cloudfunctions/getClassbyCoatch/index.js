// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: 'mail-stg-oboxi'
})
const db = cloud.database()
const _ = db.command
// 云函数入口函数
exports.main = async (event, context) => {
  console.log(event)
  var max_limit = 6
  const wxContext = cloud.getWXContext()
  var status = await db.collection('ClassInfo').aggregate()
  .lookup({
    from: "ClientByClass",  //从哪个集合产生关联
    localField: "_id",  //本地字段item
    foreignField: "classId",  //inventory 的sku字段
    //当order.item == inventory.sku时，两个集合就合起来展示数据
    as: "userList"
  }).match({
    'coatchInfo._openid': event.coatchid,
    'starttimespan': _.gt(new Date().getTime()),
  }).skip((event.pageIndex - 1) * max_limit).limit(max_limit).end().then(res => {
    return res
  }).catch(err => {
    return err
  })
  return status
}