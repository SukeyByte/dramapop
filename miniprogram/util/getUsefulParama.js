const storage = require('./storageControl.js')
var db = wx.cloud.database()
const app = getApp()

//获取最近使用的店铺信息，如果店铺信息为空则不加载
async function getSaller() {
  return wx.getStorageSync('currentSaller')
}
//获取是否为店员
async function getSellerUser() {
  let phonenumber = storage.getStorageSyncTime('phoneNumber', undefined)
  console.log(phonenumber)
  if (phonenumber == null || phonenumber == undefined) {
    return false
  }
  let sellesrUserStorge = storage.getStorageSyncTime('IsSellerUser', undefined)

  if (sellesrUserStorge == undefined || sellesrUserStorge == null) {
    let data = await db.collection('UserBySeller')
      .where({
        phonenumber: phonenumber,
        status: 1
      }).get().then(res => {
        console.log(res)
        if (res.data.length > 0) {
          storage.setStorageSyncHour('IsSellerUser', 1)
          return true;
        }
        else {
          storage.setStorageSyncHour('IsSellerUser', 0)
          return false;
        }
      }).catch(err => {
        return false
      })
    console.log(data)
    return data
  }
  console.log(sellesrUserStorge)
  return sellesrUserStorge
}

module.exports = {
  getSaller,
  getSellerUser
}