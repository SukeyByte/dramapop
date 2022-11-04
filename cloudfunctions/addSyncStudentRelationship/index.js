// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})


const db = cloud.database()
const _ = db.command
const $ = db.command.aggregate

exports.main = async (event, context) => {
  //get all class
  let createtime = new Date().getTime()
  let studentgroup = await db.collection('ClientByClass')
    .aggregate()
    .match({
      "coatchInfo._openid": event.openid
    })
    .project({
      '_id':1,
      'clientInfo.openid': 1,
      'clientInfo.wxuserInfo.avatarUrl': 1,
      'clientInfo.wxuserInfo.nickName': 1,
      'clientInfo.wxphonenumber': 1
    })
    .group({
      _id:'$clientInfo.openid',
      userid: $.first('$clientInfo.openid'),
      url: $.first('$clientInfo.wxuserInfo.avatarUrl'),
      name: $.first('$clientInfo.wxuserInfo.nickName'),
      phonenumber: $.first('$clientInfo.wxphonenumber'),
      coatch: $.first(event.openid),
      status: $.first(0),
      remark: $.first(''),
      createTime: $.first(createtime),
    })
    .end()

  db.collection('StudentRelationship').add({ data: studentgroup.list.filter(item => delete item._id) }).then(res => { console.log(res) })

  return studentgroup
}