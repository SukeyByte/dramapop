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
  let status
  if(event.id === null || event.id === undefined){
    status= await db.collection('Admins').add({
      data: {
        'name': event.form.name,
        'account': event.form.account,
        'pwd': event.form.password,
        'roleid': event.form.role,
        'status':1,
        'createTime': new Date().getTime()
      },
    }).then(res => {
      return res
    }).catch(err => {
      return err
    })
  }
  else{
    status= await db.collection('Admins').doc(event.id).update({
      data: {
        'name': event.form.name,
        'account': event.form.account,
        'pwd': event.form.password,
        'roleid': event.form.role,
        'status':1,
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