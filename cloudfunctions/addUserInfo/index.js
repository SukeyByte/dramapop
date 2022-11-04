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
  let id = ''
  let phonenumber = await db.collection('Client')
      .where({
        wxphonenumber: event.phonenumber
      }).get().then(res=>{
        console.log(res)
        if (res.data.length > 0){
          id = res.data[0]._id
          return true
        }
        else{
          return false
        }
      }).catch(err=>{
        return false
      })
  if(!phonenumber){
    status= await db.collection('Client').add({
      data: {
        'wxuserInfo': event.userInfo,
        'openid': event.openid,
        'wxphonenumber': event.phonenumber,
        'createTime': new Date().getTime(),
        'amount':0  //余额
      },
    }).then(res => {
      return res
    }).catch(err => {
      return err
    })
  }
  else{
    status= await db.collection('Client').doc(id).update({
      data: {
        'wxuserInfo': event.userInfo,
        'openid': event.openid,
        'wxphonenumber': event.phonenumber,
        'createTime': new Date().getTime()
      },
    }).then(res => {
      return res
    }).catch(err => {
      return err
    })
  }

  return status
}