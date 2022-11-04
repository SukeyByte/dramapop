// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({env: 'mail-stg-oboxi'})

const db = cloud.database()
const _ = db.command

// 用戶領取新的優惠券
exports.main = async (event, context) => {
  console.log(event)
  var status = 0
  if(parseInt(event.type)==1){
    status = await db.collection('BuyCardByClient').doc(event.id).update({
      data: {
        totalCounts: event.totalCounts,
        begTime: event.begTime,
        endTime: event.endTime
      }
    }).then(res => {
      return res
    }).catch(err => {
      return err
    })
  }else{
    status = await db.collection('BuyCardByClient').doc(event.id).update({
      data: {
        totalCounts: event.totalCounts
      }
    }).then(res => {
      return res
    }).catch(err => {
      return err
    })
  }
  
  return status
}