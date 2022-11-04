// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: 'mail-stg-oboxi'
})

const db = cloud.database()
const _ = db.command

// 云函数入口函数
exports.main = async (event, context) => {
  //获取当前时间，为后续计算的固定时间
  let courrent = new Date().getTime()
  console.log("courrent="+courrent)
  //获取大于当前时间的行数
  let count = await db.collection('ClientCardTask').where({
    needUpdateTime: _.lte(courrent)
  }).count()
  let max_limit = 20
  let pageIndex = 1

  //获取行数
  if (count.total > 0) {
    //获取循环次数
    let pageTotal = count.total / 20
    let cardlist = []
    //获取数据
    for (let i = 0; i < pageTotal; i++) {
      var clientCardTaskList = await db.collection('ClientCardTask').where({
        needUpdateTime: _.lte(courrent)
      }).field({
        cardid: true
      }).skip((pageIndex - 1) * max_limit).limit(max_limit).get().then(res => {
        return res
      }).catch(err => {
        return err
      })
      console.log("clientCardTaskList="+clientCardTaskList)
      for(let j=0 ; j<clientCardTaskList.data.length ;j++){
          var item = clientCardTaskList.data[j].cardid
          cardlist.push(item)
      }
      console.log("cardlist="+cardlist)
    }

    if (cardlist.length > 0) {
      await db.collection('BuyCardByClient')
      .where({
        _id:_.in(cardlist)
      })
      .update({
        data: {
          status: 1
        }
      })
      //更新通知状态
      await db.collection('ClientCardTask')
      .where({
        needUpdateTime: _.lte(courrent)
      })
      .update({
        data: {
          status: 1
        }
      })
    }
  }

}