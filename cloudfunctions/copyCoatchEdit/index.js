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
  let id = event.id;
  let openid = event.openid
  let coatchEdit = await db.collection('CoatchEdit').where({
    _id: id
  }).get().then(res => {
    return res.data[0]
  });
  if (typeof (coatchEdit) == 'undefined') return 0
  let coatch = await db.collection('Coatch').where({
    _openid: openid
  }).update({
    data: {
      age: coatchEdit.age,
      number: coatchEdit.number,
      sex: coatchEdit.sex,
      userInfo: coatchEdit.userInfo,
      image: coatchEdit.image,
      imagepath: coatchEdit.imagepath,
      detail: coatchEdit.detail,
      allimgpath: coatchEdit.allimgpath
    }
  }).then(res => {
    console.log(res)
    return res;
  }).catch(console.error)

  if (typeof (coatch.stats.updated) < 1) return 3

  let del = await db.collection('CoatchEdit').where({
    _id: id
  }).remove().then(res => {
    console.log(res)
    return res;
  })
  if (del.stats.removed > 0) {
    return 1;
  }
  return 4;
}