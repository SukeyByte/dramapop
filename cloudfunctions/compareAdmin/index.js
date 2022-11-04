// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  //env: 'mail-stg-oboxi'
  env:cloud.DYNAMIC_CURRENT_ENV
})

const db = cloud.database()
const _ = db.command

// 云函数入口函数
exports.main = async (event, context) => {
  var status = await db.collection('Admins').where({
    account: event.username,
    pwd: event.password
  }).get().then(res => {
    console.log(res)
    if (res.data.length > 0) {
      var admin = res.data[0];
      //设置登陆时间
      var status =  db.collection('Admins').doc(admin._id).update({
        data: {
          loginTime: new Date().getTime()
        }
      }).then(res => {
        return res
      }).catch(err => {
        return err
      })
      return admin
    }
    else {
      return false
    }
  }).catch(err => {
    return err
  })

  return status
}