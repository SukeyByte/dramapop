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
  let id = event.id;
  let iscooperation = 0

  if (event.iscooperation != null) {
    iscooperation = event.iscooperation
  }


  let coatchApply = await db.collection('CoatchApply').where({
    _id: id
  }).get().then(res => {
    return res.data[0]
  });

  if (typeof (coatchApply) == 'undefined') return 0
  let coatch = await db.collection('Coatch').add({
    data: {
      _openid: coatchApply._openid,
      age: coatchApply.age,
      name: coatchApply.name,
      number: coatchApply.number,
      sex: coatchApply.sex,
      userInfo: coatchApply.userInfo,
      image: coatchApply.image,
      imagepath: coatchApply.imagepath,
      allimgpath: coatchApply.allimgpath,
      detail: coatchApply.detail,
      iscooperation: iscooperation
    }
  }).then(res => {
    console.log(res)
    return res;
  }).catch(console.error)

  if (typeof (coatch._id) == 'undefined') return 0

  let del = await db.collection('CoatchApply').where({
    _id: id
  }).remove().then(res => {
    console.log(res)
    return res;
  })
  if (del.stats.removed > 0) {
    return 1;
  }
  return 0;
}