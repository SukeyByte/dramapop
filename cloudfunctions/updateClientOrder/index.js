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
  const wxContext = cloud.getWXContext()

  return await db.collection("ClientClassOrder").doc(event.item._id)
    .remove().then(async res => {
      //存入ClientByClass
      let userinfo = await db.collection("Client").where({
        openid: event.item.userInfo.openId
      }).get().then(res => {
        return res.data[0]
      })
      let coatchinfo = await db.collection("Coatch").where({
        _openid: wxContext.OPENID
      }).get()
      console.log(userinfo)
      console.log(coatchinfo)
      event.item.user = userinfo;
      event.item.confirmStatus = 1;
      event.item.coatchinfo = coatchinfo;
      event.item.coatchName = coatchinfo.name;
      console.log(event.item)
      return db.collection("ClientByClass").add({
        data:event.item
      }).then(res=>{
        console.log(res)
        return true
      }).catch(err=>{
        console.error(err)
        return false
      })

    }).catch(err => {
      return false //防止已经被抢
    })
}