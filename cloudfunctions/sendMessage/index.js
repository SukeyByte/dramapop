// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: 'mail-stg-oboxi'
})

// 云函数入口函数
exports.main = async (event, context) => {
  try {
    const result = await cloud.openapi.subscribeMessage.send({
      touser: event.openid, // 通过 getWXContext 获取 OPENID
      data: event.data,
      templateId: event.templateId 
    })
    // result 结构
    // { errCode: 0, errMsg: 'openapi.subscribeMessage.send:ok' }
    return result
  } catch (err) {
    // 错误处理
    // err.errCode !== 0
    throw err
  }
}