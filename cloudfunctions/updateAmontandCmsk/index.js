// 云函数入口文件
const cloud = require('wx-server-sdk')


cloud.init({
  env: 'mail-stg-oboxi'
})

const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  console.log(event)
  //更新用户余额
  if (event.amount != null) {
    db.collection('Client').where({
      openid: wxContext.OPENID
    }).update({
      data: {
        amount: event.amount
      },
    })
  }
  //注销用户优惠券
  if (event.msk != null) {

    db.collection('mskClient').where({
      clientId: wxContext.OPENID,
      mskId: event.msk._id
    }).update({
      data: {
        status: 1
      },
    })
  }
}