function getOrderNumber(e,type = 'L') {
  //S --save L-- load 代表存入和取出，目前只有余额为存入 R -- refund 代表退款
  //第2-3位代表功能，充值为CZ，选课为XK,组成页面的type的2-3位
  //return type + e.substring(3, 10) + new Date().getTime()
  return type + generateTimeReqestNumber() + uuid(8, 10)
}

module.exports = {
  getOrderNumber
}



function generateTimeReqestNumber() {
  var date = new Date();
  return date.getFullYear().toString() + pad2(date.getMonth() + 1) + pad2(date.getDate()) + pad2(date.getHours()) + pad2(date.getMinutes()) + pad2(date.getSeconds());
}
function uuid(len, radix) {
  var chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('');
  var uuid = [], i;
  radix = radix || chars.length;
 
  if (len) {
   // Compact form
   for (i = 0; i < len; i++) uuid[i] = chars[0 | Math.random()*radix];
  } else {
   // rfc4122, version 4 form
   var r;
   // rfc4122 requires these characters
   uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-';
   uuid[14] = '4';
   // Fill in random data. At i==19 set the high bits of clock sequence as
   // per rfc4122, sec. 4.1.5
   for (i = 0; i < 36; i++) {
    if (!uuid[i]) {
     r = 0 | Math.random()*16;
     uuid[i] = chars[(i == 19) ? (r & 0x3) | 0x8 : r];
    }
   }
  }
  return uuid.join('');
}

function pad2(n) { return n < 10 ? '0' + n : n }