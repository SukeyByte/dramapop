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
  var max_limit = 10
  const wxContext = cloud.getWXContext()
  var status = await db.collection('Admins').skip((event.pageIndex - 1) * max_limit).limit(max_limit).get().then(res => {
    return res
  }).catch(err => {
    return err
  })
  return status
}