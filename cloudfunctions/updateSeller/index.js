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
  console.log("修改店铺信息="+event)
  let status
  if (event.id === null || event.id === undefined) {
    status = await db.collection('Seller').add(
        {data:event.data}
    ).then(res => {
      return res
    }).catch(err => {
      return err
    })
  }
  else {
    status = await db.collection('Seller').doc(event.id).update(
      {data:event.data}
    ).then(res => {
      return res
    }).catch(err => {
      return err
    })
  }

  return status
}