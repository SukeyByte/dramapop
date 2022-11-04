// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})
const db = cloud.database()
const _ = db.command
// 云函数入口函数
exports.main = async (event, context) => {
  let wxContext = cloud.getWXContext()
  console.log(wxContext)
  let banner = await db.collection('Banner').limit(5).get().then(res => {
    return res.data
  }).catch(err => {
    return err
  })
  let isCoatch = false
  if(event.isLogin){
    isCoatch = await db.collection('Coatch')
    .where({
      _openid: wxContext.OPENID
    })
    .get().then(res => {
      console.log(res.data)
      if (res.data.length > 0) {
        return true;
      } else {
        return false;
      }
    }).catch(err => {
      return false
    })
  }

  return {
    banner: banner,
    isCoatch: isCoatch
  }
}