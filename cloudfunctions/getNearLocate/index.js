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
  return await db.collection('Seller').aggregate()
    .geoNear({
      distanceField: 'distance', // 输出的每个记录中 distance 即是与给定点的距离
      spherical: true,
      near: db.Geo.Point(event.longitude, event.latitude),
      key: 'location', // 若只有 location 一个地理位置索引的字段，则不需填
      includeLocs: 'location', 
      distanceMultiplier: 6378137,//这样算出来的才是米
    })
    .end().then(res => {
      console.log(res)
      return res
    })
}