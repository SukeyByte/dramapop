
//充值函数
const cloud = require('wx-server-sdk')
cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})
const db = cloud.database()

async function payed(e) {
  let id = await db.collection('OrderInfo').where({
    order: e
  }).get().then(res => {
    console.info(res)
    return res.data[0].foreignId
  }).catch(err => {
    console.error(err)
    return null
  })

  if (id == null) {
    return;
  }
  //真实的支付状态
  db.collection('SumTimelog').doc(id).update({
    data: {
      'paystatus': 1
    }
  }).then(res => {
    console.info(res)
  }).catch(err => {
    console.error(err)
  })
}

module.exports = {
  payed
}