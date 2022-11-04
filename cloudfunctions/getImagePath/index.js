// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: 'mail-stg-oboxi'
})

// 云函数入口函数
exports.main = async(event, context) => {
  return await wx.cloud.downloadFile({
    fileID: event.fileID
  }).then(res => {
    console.log(res.tempFilePath)
    return res.tempFilePath
  }).catch(error => {
    console.log(error)
    return error
  })
}