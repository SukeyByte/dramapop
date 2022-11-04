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
    status= await db.collection('Banner').add({
      data: {
        'type': event.form.type,
        'url': event.form.url,
        'imgpath': event.imgpath,
        'createTime': new Date().getTime()
      },
    }).then(res => {
      return res
    }).catch(err => {
      return err
    })
  }
  else{
    status= await db.collection('Banner').doc(event.id).update({
      data: {
        'type': event.form.type,
        'url': event.form.url,
        'imgpath': event.imgpath,
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