// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  //env: 'mail-stg-oboxi'
  env:'mail-stg-oboxi'
})


const db = cloud.database()
const _ = db.command

// 云函数入口函数
exports.main = async (event, context) => {
  let status
  if (event.id === null || event.id === undefined) {
    status = await db.collection('BuyCard').add({
      data: {
        'detailImg': event.images,
        'money': event.form.money,
        'name': event.form.name,
        'type': event.form.type,
        'useType': event.form.useType,
        'totalCounts': event.form.totalCounts,
        'detail': event.form.detail,
        'sellerId': event.form.sellerId,
        'createTime': new Date().getTime(),
        'status': event.form.status,
        'sort': event.form.sort,
        'sellerId':event.form.sellerId
      },
    }).then(res => {
      return res
    }).catch(err => {
      return err
    })
  }
  else {
    status = await db.collection('BuyCard').doc(event.id).update({
      data: {
        'detailImg': event.images,
        'money': event.form.money,
        'name': event.form.name,
        'type': event.form.type,
        'useType': event.form.useType,
        'totalCounts': event.form.totalCounts,
        'detail': event.form.detail,
        'sellerId': event.form.sellerId,
        'createTime': new Date().getTime(),
        'status': event.form.status,
        'sort': event.form.sort,
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