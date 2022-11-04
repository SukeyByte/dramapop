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
  const wxContext = cloud.getWXContext()
  let status
  if(event.id === null || event.id === undefined){
    status= await db.collection('msk').add({
      data: {
        'name': event.form.name,
        'type': event.form.type,
        'status':event.form.status,
        'begTime': event.form.begTime,
        'endTime': event.form.endTime,
        'price': event.form.price,
        'maxPrice': event.form.maxPrice,
        'minPrice': event.form.minPrice,
        'detai': event.form.detai,
        'imgpath': event.imgpath,
        'createTime': new Date().getTime(),
        'itemId':event.form.itemId,
        'sellerId':event.form.sellerId
      },
    }).then(res => {
      return res
    }).catch(err => {
      return err
    })
  }
  else{
    status= await db.collection('msk').doc(event.id).update({
      data: {
        'name': event.form.name,
        'type': event.form.type,
        'status':event.form.status,
        'begTime': event.form.begTime,
        'endTime': event.form.endTime,
        'price': event.form.price,
        'maxPrice': event.form.maxPrice,
        'minPrice': event.form.minPrice,
        'detai': event.form.detai,
        'createTime': new Date().getTime(),
        'itemId':event.form.itemId,
        'sellerId':event.form.sellerId
      },
    }).then(res => {
      return res
    }).catch(err => {
      return err
    })
  }
  return status
}