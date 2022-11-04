// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: 'mail-stg-oboxi'
})
const db = cloud.database()
const _ = db.command
// 云函数入口函数
exports.main = async (event, context) => {
  console.log(event)
  var list = []
  let count = 0
  if((event.phone=== null || event.phone === undefined 
    || event.phone ==='')&&(event.name=== null || event.name === undefined 
    || event.name ==='')){
      list = await db.collection('Client').orderBy('createTime','desc').skip((event.pageIndex - 1) * event.pageSize).limit(event.pageSize).get().then(res => {
        return res.data
      }).catch(err => {
        return err
      })
      count = await db.collection('Client').count().then(res => {
        return res
      }).catch(err => {
        return err
      })
  }else if(event.name=== null || event.name === undefined 
    || event.name ===''){
      list = await db.collection('Client').where({wxphonenumber:event.phone}).orderBy('createTime','desc')
      .skip((event.pageIndex - 1) * event.pageSize).limit(event.pageSize).get().then(res => {
        return res.data
      }).catch(err => {
        return err
      })
      count = await db.collection('Client').where({wxphonenumber:event.phone}).count().then(res => {
        return res
      }).catch(err => {
        return err
      })
  }else if(event.phone=== null || event.phone === undefined 
    || event.phone ===''){
      list = await db.collection('Client').where({
        "wxuserInfo.nickName":event.name
      }).orderBy('createTime','desc').skip((event.pageIndex - 1) * event.pageSize).limit(event.pageSize).get().then(res => {
        return res.data
      }).catch(err => {
        return err
      })
      count = await db.collection('Client').where({
        "wxuserInfo.nickName":event.name}).count().then(res => {
        return res
      }).catch(err => {
        return err
      })   
  }else{
    list = await db.collection('Client').where({wxphonenumber:event.phone,
      "wxuserInfo.nickName":event.name
    }).orderBy('createTime','desc').skip((event.pageIndex - 1) * event.pageSize).limit(event.pageSize).get().then(res => {
      return res.data
    }).catch(err => {
      return err
    })
    count = await db.collection('Client').where({wxphonenumber:event.phone,
      "wxuserInfo.nickName":event.name}).count().then(res => {
      return res
    }).catch(err => {
      return err
    }) 
  }
  return {
    data: list,
    count: count
  }
}