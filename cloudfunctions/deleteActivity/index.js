const cloud = require('wx-server-sdk')

cloud.init({
  env: 'mail-stg-oboxi'
})
const db = cloud.database()
const _ = db.command

// 云函数入口函数
exports.main = async (event, context) => {
  let {
    id
  } = event;
  let activity = await db.collection('Activity').where({
    _id: id
  }).remove().then(res => {
    return res
  });
  return activity
}