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
  var status = await db.collection('ClientClassOrder').where({
    'openid': wxContext.OPENID
  }).get().then(res => {
    return res
  }).catch(err => {
    return err
  })

  status.data.forEach(function (item, index) {
    let time = new Date().getTime()
    if(item.starttimespan < time){
      db.collection('ClientClassOrder').doc(item._id).remove().then(res => {
        return res
      }).catch(err => {
        return err
      })
      return null
    }
  })

  return status.data
}