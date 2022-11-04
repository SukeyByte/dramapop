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
  const wxContext = cloud.getWXContext()
  var openid = event.openid
  console.log(event)
  console.log("用户id" + openid)
  const msk = await db.collection("mskClient").aggregate()
    .lookup({
      from: "msk",  //从哪个集合产生关联
      localField: "mskId",  //本地字段item
      foreignField: "_id",  //inventory 的sku字段
      //当order.item == inventory.sku时，两个集合就合起来展示数据
      as: "msks"
    }).match({
      status:0,
      clientId:openid
    })
    .end().then(res => {
      return res
    }).catch(err => {
      return err
    })
  return msk;
}