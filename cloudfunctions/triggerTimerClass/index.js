// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

process.env.TZ = 'Asia/Shanghai'

const db = cloud.database()
const _ = db.command
// 云函数入口函数
exports.main = async (event, context) => {
  let date = getCurrentDate()
  let timerCount = await db.collection("TimerClassInfo").count()
  let total = timerCount.total
  let startCount = 0
  let limit = 20
  while (total >= startCount * limit) {
    console.log(startCount)
    db.collection("TimerClassInfo").skip(startCount).limit(limit).get().then(res => {
      let classData = translateDataToClass(res.data, date)
      console.log(classData[0])
      let {_id,...paramas} = classData[0]
      db.collection('ClassInfo').add({
        data: paramas
      }).catch(err=>{
        console.log(err)
      })
    })
    startCount++
  }
}
//时间转换
function translateDataToClass(timeData, date) {
  let classData = []
  for (i = 0; i < timeData.length; i++) {
    let tempData = timeData[i]
    let startHour = tempData.noonTime.split('-')[0]
    let endHour = tempData.noonTime.split('-')[1]
    let starttimespan = new Date(date + ' ' + startHour).getTime()
    let endtimespan = new Date(date + ' ' + endHour).getTime()

    tempData.starttimespan = starttimespan
    tempData.endtimespan = endtimespan
    tempData.date = date
    tempData.createTime = new Date().getTime()
    classData.push(tempData)
  }
  return classData
}
//获取当前日期
function getCurrentDate() {
  var timestamp = Date.parse(new Date());
  var date = new Date(timestamp + (8 * 60 * 60 * 1000));
  //获取年份  
  var Y = date.getFullYear();
  //获取月份  
  var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1);
  //获取当日日期 
  var D = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
  console.log(Y + '-' + M + '-' + D)
  return Y + '-' + M + '-' + D
}