// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: 'mail-stg-oboxi'
})

// 云函数入口函数
exports.main = async (event, context) => {
  const db = cloud.database()
  var SellerCount = await db.collection('Seller').count().then(res => {
    return res.total
  })
  var CoatchCount = await db.collection('Coatch').count().then(res => {
    return res.total
  })
  var AdminsCount = await db.collection('Admins').count().then(res => {
    return res.total
  })

  var ClientCount = await db.collection('Client').count().then(res => {
    return res.total
  })

  console.log(SellerCount)
  console.log(CoatchCount)
  console.log(AdminsCount)
  return {
    sellerCount: SellerCount,
    coatchCount: CoatchCount,
    adminsCount: AdminsCount,
    clientCount: ClientCount
  }
}