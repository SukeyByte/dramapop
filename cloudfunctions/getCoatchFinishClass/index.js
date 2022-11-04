// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: 'mail-stg-oboxi'
})
const db = cloud.database()
const _ = db.command
const $ = db.command.aggregate

// 云函数入口函数
exports.main = async (event, context) => {
  console.log(event)
  let MAX_LIMIT = 10
  let pageIndex = 1
  let iscooperation = 0
  if (event.MAX_LIMIT != null) {
    MAX_LIMIT = event.MAX_LIMIT
  }
  if (event.pageIndex != null) {
    pageIndex = event.pageIndex
  }
  if (event.iscooperation != null) {
    iscooperation = event.iscooperation
  }
  let result, count
  if (iscooperation == 1) {
    result = await db.collection('ClientByClass').where({
      sellerId: event.sellerId,
      status: _.eq(1),
      coatchInfo: {
        "_openid": event.openid,
        "iscooperation": 1
      }
    }).skip((pageIndex - 1) * MAX_LIMIT).limit(MAX_LIMIT).get().then(res => {
      return res
    }).catch(err => {
      return err
    })
    count = await db.collection('ClientByClass').where({
      sellerId: event.sellerId,
      status: _.eq(1),
      coatchInfo: {
        "_openid": event.coatchId,
        "iscooperation": 1
      }
    }).count().then(res => {
      return res
    }).catch(err => {
      return err
    })
  } else {
    result = await db.collection('ClientByClass').where({
      sellerId: event.sellerId,
      status: _.eq(1),
      coatchInfo: {
        "_openid": event.openid
      }
    }).skip((pageIndex - 1) * MAX_LIMIT).limit(MAX_LIMIT).get().then(res => {
      return res
    }).catch(err => {
      return err
    })
    count = await db.collection('ClientByClass').where({
      sellerId: event.sellerId,
      status: _.eq(1),
      coatchInfo: {
        "_openid": event.coatchId
      }
    }).count().then(res => {
      return res
    }).catch(err => {
      return err
    })
  }


  console.log(result)
  let resultdata = []
  let price = 0
  let monthFirst = new Date(getDate())
  console.log(monthFirst)
  for (let i = 0; i < result.data.length; i++) {
    let classDate = result.data[i].classTime.split(" ")[0]
    if (new Date(classDate) < new Date() && new Date(classDate) > monthFirst) {
      resultdata.push(result.data[i])
      let currentprice = 0
      if(iscooperation == 1){
        console.log(result.data[i])
        currentprice = parseInt(result.data[i].coatchbenefits * 100).toFixed(2) / 100
      }
      else{
        currentprice = parseInt(result.data[i].price * 100).toFixed(2) / 100
      }

      price += currentprice
    }
  }

  return {
    result: result,
    price: price,
    count: count
  }
}

function getDate() {
  var myDate = new Date();
  var tYear = myDate.getFullYear()
  var tMonth = myDate.getMonth()
  tMonth = doHandleZero(tMonth + 1)

  return tYear + "-" + tMonth + "-01"
}

function doHandleZero(zero) {
  var date = zero;
  if (zero.toString().length == 1) {
    date = "0" + zero;
  }
  return date;
}