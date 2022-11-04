//设置时效缓存，time为有效时间，（单位：小时，不填则默认24小时）
function setStorageSyncHour(key, value, time) {
  console.log(value)
  wx.setStorageSync(key, value)
  var t = time ? time : 24;
  var seconds = parseInt(t * 3600);
  if (seconds > 0) {
    var timestamp = Date.parse(new Date());
    timestamp = timestamp / 1000 + seconds;
    wx.setStorageSync(key + 'dtime', timestamp + "")
  } else {
    wx.removeStorageSync(key + 'dtime')
  }
}

//设置时效缓存，time为有效时间，（单位：秒，不填则默认3600s）
function setStorageSyncSecond(key, value, time) {
  wx.setStorageSync(key, val)
  var t = time ? time : 3600;
  var seconds = parseInt(t);
  if (seconds > 0) {
    var timestamp = Date.parse(new Date());
    timestamp = timestamp / 1000 + seconds;
    wx.setStorageSync(k + 'dtime', timestamp + "")
  } else {
    wx.removeStorageSync(k + 'dtime')
  }
}

//读取缓存，若缓存不存在，返回def，def为可选参数，表示无缓存数据时返回值（支持字符串、json、数组、boolean等等）
function getStorageSyncTime(key, def) {
  var deadtime = parseInt(wx.getStorageSync(key + 'dtime'))
  if (deadtime) {
    if (parseInt(deadtime) < Date.parse(new Date()) / 1000) {
      wx.removeStorageSync(key);
      wx.removeStorageSync(key + 'dtime');
      if (def) { return def; } else { return; }
    }
  }
  var res = wx.getStorageSync(key);
  if (res) {
    return res;
  } else if (def) {
    return def;
  } else {
    return;
  }
}

module.exports = {
  setStorageSyncHour: setStorageSyncHour,
  setStorageSyncSecond: setStorageSyncSecond,
  getStorageSyncTime: getStorageSyncTime
}