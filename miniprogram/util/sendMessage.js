const app = getApp();
// 1:detail 2:goodsdetail 3:help (message for type)
function send(toUserId, toUserName, message, type, itemId) {
  var date = new Date()
  var year = date.getFullYear()
  var month = date.getMonth() + 1
  var day = date.getDate()
  var hour = date.getHours()
  var minute = date.getMinutes()
  var second = date.getSeconds()
  let now = year + '-' + month + '-' + day + ' ' + hour + ':' + minute
  console.log(message)
  const db = wx.cloud.database()
  db.collection('UserMessage').add({
    data: {
      toUserId: toUserId,
      toUserName: toUserName,
      message: message,
      type: type,
      createTime:now,
      itemId: itemId,
      fromuserId: app.globalData.openid,
      fromuserName: app.globalData.userInfo.nickName,
    },
    success: res => {
      console.log('[数据库] [新增记录] 成功，记录 _id: ', res._id)
      return true;
    },
    fail: err => {
      return false;
    }
  })
}

module.exports = {
  send: send
}