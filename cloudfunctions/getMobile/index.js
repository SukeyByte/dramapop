// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: 'mail-stg-oboxi'
})
  
// 云函数入口函数
exports.main = async (event, context) => {
 const wxContext = cloud.getWXContext()
 var moblie = event.weRunData.data.phoneNumber;
 return moblie
}