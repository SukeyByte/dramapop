// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})
const db = cloud.database()
const _ = db.command
// 云函数入口函数
exports.main = async (event, context) => {
  console.log(event)
  var max_limit = 10
  const wxContext = cloud.getWXContext()
  let searchkey = '.'
  if (event.key != '') {
    searchkey = event.key
  }
  console.log(searchkey)
  var data = await db.collection('Coatch').where({
    name: db.RegExp({
      regexp: searchkey,
      options: 'i',
    })
  }).skip((event.pageIndex - 1) * max_limit).limit(max_limit).get().then(res => {
    console.log(res)
    return res.data
  }).catch(err => {
    return err
  })

  var count = await db.collection('Coatch').count().then(res => {
    console.log(res)
    return res.total
  }).catch(err => {
    return err
  })

  return { data, count }
}