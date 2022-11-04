function dateCount(arg, date) {
  var str = "-";
  if (arg.indexOf("-") == -1) {
    str = "/"
  }
  var date1 = arg;
  var date2 = new Date(date1);

  date2.setDate(date2.getDate() + parseInt(date));
  var times = date2.getFullYear() + str + (date2.getMonth() + 1) + str + date2.getDate();
  var Year = 0;
  var Month = 0;
  var Day = 0;
  var CurrentDate = "";
  Year = date2.getFullYear();
  Month = date2.getMonth() + 1;
  Day = date2.getDate();
  CurrentDate += Year + str;
  if (Month >= 10) {
    CurrentDate += Month + str;
  } else {
    CurrentDate += "0" + Month + str;
  }
  if (Day >= 10) {
    CurrentDate += Day;
  } else {
    CurrentDate += "0" + Day;
  }
  return CurrentDate;
}

function getdatearr(arg, number = 3) {
  var str = "-";
  let datearry = []
  var date = new Date(arg);
  for (let i = 0; i < number; i++) {
    var Year = 0;
    var Month = 0;
    var Day = 0;
    var CurrentDate = "";
    if(i>0){
      date.setDate(date.getDate()+1)
    }
    Year = date.getFullYear();
    Month = date.getMonth() + 1;
    Day = date.getDate();
    CurrentDate += Year + str;
    if (Month >= 10) {
      CurrentDate += Month + str;
    } else {
      CurrentDate += "0" + Month + str;
    }
    if (Day >= 10) {
      CurrentDate += Day;
    } else {
      CurrentDate += "0" + Day;
    }
    console.log('CurrentDate', CurrentDate)
    datearry.push(CurrentDate)
  }
  return datearry
}

Date.prototype.format = function () {
  var s = '';
  s += this.getFullYear() + '-'; // 获取年份。
  if ((this.getMonth() + 1) >= 10) { // 获取月份。
    s += (this.getMonth() + 1) + "-";
  } else {
    s += "0" + (this.getMonth() + 1) + "-";
  }
  if (this.getDate() >= 10) { // 获取日。
    s += this.getDate();
  } else {
    s += "0" + this.getDate();
  }
  return (s); // 返回日期。
};
//两个日期之间的所有日期
function getAll(begin, end) {
  var str = "-";
  if (begin.indexOf("-") == -1) {
    str = "/"
  }
  var ab = begin.split(str);
  var ae = end.split(str);
  var db = new Date();
  db.setUTCFullYear(ab[0], ab[1] - 1, ab[2]);
  var de = new Date();
  de.setUTCFullYear(ae[0], ae[1] - 1, ae[2]);
  var unixDb = db.getTime();
  var unixDe = de.getTime();
  var str = "";
  for (var k = unixDb + 24 * 60 * 60 * 1000; k < unixDe;) {
    str += (new Date(parseInt(k))).format() + ",";
    k = k + 24 * 60 * 60 * 1000;
  }
  return str;
}
//两个时间相差天数
function datedifference(sDate1, sDate2) { //sDate1和sDate2是2006-12-18格式  
  var aDate, oDate1, oDate2, iDays;
  aDate = sDate1.split("-");
  oDate1 = new Date(aDate[1] + '-' + aDate[2] + '-' + aDate[0]); //转换为9-25-2017格式 
  aDate = sDate2.split("-");
  oDate2 = new Date(aDate[1] + '-' + aDate[2] + '-' + aDate[0]);
  iDays = parseInt(Math.abs(oDate1 - oDate2) / 1000 / 60 / 60 / 24);
  return iDays;
};

//两个时间相差天数
function datedifferenceIos(sDate1, sDate2) { //sDate1和sDate2是2006/12/18格式  
  var aDate, oDate1, oDate2, iDays;
  aDate = sDate1.split("/");
  oDate1 = new Date(aDate[1] + '/' + aDate[2] + '/' + aDate[0]); //转换为9-25-2017格式 
  aDate = sDate2.split("/");
  oDate2 = new Date(aDate[1] + '/' + aDate[2] + '/' + aDate[0]);
  iDays = parseInt(Math.abs(oDate1 - oDate2) / 1000 / 60 / 60 / 24);
  return iDays;
};
/**
 * 获取两个时间月份差 
 */
function getMonths(start, end){ //sDate1和sDate2是2006-12-18格式  
	var result = [];
    var starts = start.split('-');
    var ends = end.split('-');
    var staYear = starts[0]*1;
    var staMon = starts[1]*1 < 10? starts[1]:starts[1];
    var endYear = ends[0]*1;
    var endMon = ends[1]*1 < 10? ends[1]:ends[1];;
    result.push(staYear+'-'+staMon);
    while (staYear <= endYear) {
        if (staYear === endYear) {
            while (staMon < endMon) {
                staMon++;
                if(staMon < 10){
                	result.push(staYear+'-0'+staMon);
                }else{
                	result.push(staYear+'-'+staMon);
                }
            }
            staYear++;
        } else {
            staMon++;
            if (staMon > 12) {
                staMon = 1;
                staYear++;
            }
            if(staMon < 10){
            	result.push(staYear+'-0'+staMon);
            }else{
            	result.push(staYear+'-'+staMon);
            }
        }
    }
    return result;
};
module.exports = {
  DateCount: dateCount,
  GetAll: getAll,
  Datedifference: datedifference,
  DatedifferenceIos: datedifferenceIos,
  getdatearr:getdatearr,
  getMonths:getMonths
}