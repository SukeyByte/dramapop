// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: 'mail-stg-oboxi'
})

const db = cloud.database()
const _ = db.command

// 获取当前用户的优惠券
exports.main = async (event, context) => {
  console.log(event)
  //获取当前用户的优惠券
  let clientmsk = await db.collection("mskClient").where({
    clientId: event.cilentId,
    status: 0
  }).get().then(res => {
    return res.data
  }).catch(err => {
    return err
  })
  console.log(clientmsk)
  let idlist = []
  for (let i = 0; i < clientmsk.length; i++) {
    if (idlist.indexOf(clientmsk[i].mskId) == -1) {
      //防止意外，只筛选有值的
      idlist.push(clientmsk[i].mskId)
    }
  }
  console.log(idlist)
  let usermsks = await db.collection("msk").where({
    _id: _.in(idlist)
  }).get().then(res => {
    return res.data
  }).catch(err => {
    return err
  })
  console.log(usermsks)

  let myDate = new Date();

  let result = []
  for (let i = 0; i < usermsks.length; i++) {
    if (myDate <= new Date(usermsks[i].endTime)){
      result.push(usermsks[i])
    }
  }

  return result
}