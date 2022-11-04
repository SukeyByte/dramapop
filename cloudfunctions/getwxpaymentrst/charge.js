//充值函数
const cloud = require('wx-server-sdk')
cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})
const db = cloud.database()
const _ = db.command

async function charge(e) {
  console.log(e)
  //获取用户信息和余额
  var amount = await db.collection('Client').where({
    openid:e.userInfo.openId
  }).get().then(res => {
    return res.data
  }).catch(err => {
    return err
  })
  console.log(amount)
  if(amount[0].amount == null){
    amount[0].amount = 0
  }
  //为了防止JS数组精度的问题
  let newamount = amount[0].amount * 1000 + e.totalFee *10
  console.log(amount[0].amount)
  console.log(newamount)
  //完成将充值金额进行增加
  status = await db.collection('Client').doc(amount[0]._id).update({
    data: {
      amount: parseFloat(newamount/1000).toFixed(2),
    },
  }).then(res => {
    console.log(res)
    return true
  }).catch(err => {
    return err
  })
  console.log(status)
}

module.exports = {
  charge
}