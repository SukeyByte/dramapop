// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

const db = cloud.database()
const _ = db.command

// 获取当前用户的优惠券
exports.main = async (event, context) => {
  console.log(event)
  //获取当前用户的优惠券
  let clientmsk = await db.collection("mskClient").aggregate()
    .lookup({
      from: "msk",
      localField: "mskId",
      foreignField: "_id",
      as: "msks"
    }).match({
      status: 0,
      "mskId": event.id,
      clientId: event.clientId
    }).end().then(res => {
      return res
    }).catch(err => {
      return err
    })
  console.log(clientmsk)

  return clientmsk
}