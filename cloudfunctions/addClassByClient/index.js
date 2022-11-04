// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: 'mail-stg-oboxi'
})

const db = cloud.database()
const _ = db.command

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  console.log(event)
  let updateStatus = await db.collection('ClientByClass').add({
    data: event.clientByClass,
  }).then(res => {
    console.log(res)
    return 1
  }).catch(err => {
    console.log(err)
    return 0
  })
  if (updateStatus > 0) {
    if (event.payType == 0) {//用卡片支付的
      if (event.buyInfo.type == "0") {//判断是次数的
        var count = parseInt(event.buyInfo.totalCounts) - 1
        var buyStatus = 1
        if (count == 0) {
          buyStatus = 2
        }
        updateStatus = await db.collection('BuyCardByClient').doc(event.buyInfo._id).update({
          data: {
            'totalCounts': count,
            'status': buyStatus
          },
        }).then(res => {
          console.log(res)
          return 1
        }).catch(err => {
          console.log(err)
          return 0
        })
        return updateStatus
      }
    } else if (event.payType == 1) {//用优惠券支付的
      var mskStatus = 1
      updateStatus = await db.collection('mskClient').doc(event.mskInfo._id).update({
        data: {
          'stauts': mskStatus
        },
      }).then(res => {
        console.log(res)
        return 1
      }).catch(err => {
        console.log(err)
        return 0
      })
      if (updateStatus > 0) {
        updateStatus = await db.collection('Client').where({
          openid: event.openid
        }).update({
          data: {
            'amount': event.payAccount
          },
        }).then(res => {
          console.log(res)
          return 1
        }).catch(err => {
          console.log(err)
          return 0
        })
      }
      return updateStatus
    } else if (event.payType == 2) {//只用钱和，余额
      updateStatus = await db.collection('Client').where({
        openid: event.openid
      }).update({
        data: {
          'amount': event.payAccount
        },
      }).then(res => {
        console.log(res)
        return 1
      }).catch(err => {
        console.log(err)
        return 0
      })
      return updateStatus
    }
  }
}