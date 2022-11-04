// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: 'mail-stg-oboxi'
})


const db = cloud.database()
const _ = db.command

// 云函数入口函数
exports.main = async (event, context) => {
  let status
  console.log(event)
  //没传ID 代表存入新的数据

  if (event.id == null || event.id == undefined) {
    let haverec = await db.collection('UserBySeller').where({
      phonenumber: event.phonenumber
    }).get().then(res => {
      if (res.data.length > 0) {
        return true
      } else {
        return false
      }
    }).catch(err => { return false })
    if (!haverec) {
      status = await db.collection('UserBySeller').add({
        data: {
          'userId': event.openid,
          'sellerId': event.sellerId,
          'phonenumber': event.phonenumber,
          'status': 0,//默认未通过
          'createTime': new Date().getTime(),
          'updateTime': new Date().getTime()
        },
      }).then(res => {
        return res
      }).catch(err => {
        return err
      })
    }
    else {
      return true
    }
  }
  else {
    status = await db.collection('UserBySeller').doc(event.id).update({
      data: {
        'status': 1,//更新只有通过时候更新
        'updateTime': new Date().getTime()
      },
    }).then(res => {
      return res
    }).catch(err => {
      return err
    })
  }
  return status
}