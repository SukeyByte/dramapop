// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: 'mail-stg-oboxi'
})

// 云函数入口函数
exports.main = async (event, context) => {
  let phoneNumber = "+86" + event.phoneNumber
  try {
    console.log(cloud.DYNAMIC_CURRENT_ENV)
    let result = await cloud.openapi.cloudbase.sendSms({
        env: 'mail-stg-oboxi',
        phoneNumberList: [
          phoneNumber
        ],
        content:'有学员预定了您的课程，请打开微信小程序查看详情',
        path:'/jump-mp.html'
      })
    return result
  } catch (err) {
    return err
  }
}