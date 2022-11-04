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
  let SumTimeLog = await db.collection("SumTimelog").where({
    clientId: event.cilentId,
  }).limit(100).orderBy('status', 'asc').get().then(res => {
    return res.data
  }).catch(err => {
    return err
  })

  let result = []
  for (let i = 0; i < SumTimeLog.length; i++) {
    if(SumTimeLog[i].begTime !=null){
      if(SumTimeLog[i].endTime == null){
        SumTimeLog[i].endTime = new Date()
      }
      result.push({
        id:SumTimeLog[i]._id,
        begTime: SumTimeLog[i].begTime,
        endTime:SumTimeLog[i].endTime,
        start: getYYYYMMDD(SumTimeLog[i].begTime),
        end: getYYYYMMDD(SumTimeLog[i].endTime),
        span: Math.round(SumTimeLog[i].makeTime * 100) / 100,
        pay: SumTimeLog[i].status,
      })
    }
  }

  return result
}

function getYMDHMS(time) {
  console.log(time)
  time = new Date(time + (8 * 60 * 60 * 1000))
  
  var year = time.getFullYear(),
    month = time.getMonth() + 1,
    date = time.getDate(),
    hours = time.getHours(),
    minute = time.getMinutes(),
    second = time.getSeconds();
    
  if (month < 10) { month = '0' + month; }
  if (date < 10) { date = '0' + date; }
  if (hours < 10) { hours = '0' + hours; }
  if (minute < 10) { minute = '0' + minute; }
  if (second < 10) { second = '0' + second; }

  return {
    year: year,
    month: month,
    date: date,
    hours: hours,
    minute: minute,
    second: second
  }
}
function getYYYYMMDD(time){
  var dates=  getYMDHMS(time)
  return dates.year+'-'+dates.month+'-'+dates.date+' '+dates.hours+':'+dates.minute+':'+dates.second
}