// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

const db = cloud.database()
const _ = db.command
// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  console.log(event)
  if(event.seller == null){
    db.collection('Coatch').where({
      _openid: wxContext.OPENID
    }).update({
      data: {
        seller: _.remove()
      },
    })
  }else{
    db.collection('Coatch').where({
      _openid: wxContext.OPENID
    }).update({
      data: {
        seller: event.seller
      },
    })
  }

}