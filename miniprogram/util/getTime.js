function getYMDHMS(time) {
  time = new Date(time)
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
function getYYYYmmdd(time){
  var dates=  getYMDHMS(time)
  return dates.year+'-'+dates.month+'-'+dates.date
}
module.exports = {
  getYMDHMS,
  getYYYYMMDD,
  getYYYYmmdd
}