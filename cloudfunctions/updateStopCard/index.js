// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: 'mail-stg-oboxi'
})

const db = cloud.database()
const _ = db.command

// 云函数入口函数
exports.main = async (event, context) => {
  console.log(event)
  let cardid = event.id
  let conut = 0
  let stoptime = 10 * 24 * 60 * 60 * 1000
  if (event.count == null || event.count == undefined) {
    conut = 1
  }
  else {
    conut = event.count + 1
  }

  if (event.type == null || event.count == undefined) {
    stoptime = 10 * 24 * 60 * 60 * 1000
  } else {
    stoptime = parseInt(event.type) * 24 * 60 * 60 * 1000
  }

  let currentTime = new Date()
  let status = await db.collection('BuyCardByClient')
    .doc(cardid)
    .update({
      data: {
        status: 3,
        laststopTime: currentTime.getTime(),
        stopCounts: conut
      }
    }).then(res => {
      return true
    }).catch(err => {
      console.error(err)
      return false
    })
  if (status) {
    let reactive = currentTime.getTime() + (stoptime)
    let addClientCardTaskStatus = await db.collection('ClientCardTask').add({
      data: {
        'lastupdateTime': currentTime.getTime(),
        'cardid': cardid,
        'needUpdateTime': reactive,
        'status': 0
      }
    }).then(res => {
      return true
    }).catch(err => {
      return false
    })
    return addClientCardTaskStatus
  }
  return status
}