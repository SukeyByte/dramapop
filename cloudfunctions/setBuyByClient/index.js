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
  var createTime = new Date().getTime()
  //3   ---79550af2600a57e2006efffc799567dc
  // 0 年卡  1 半年卡  2 季度卡 3 私教卡  4 月卡
   var buyMap = new Map([['0','b00064a760094354005c9d26313d9056'],['1','1526e12a600a52c7005b6a1e74c8ef96'],['2','3b020ca360096f5000589e6d191e6e1e'],['3','b00064a7603e50070800e6e05c170220'],['4','28ee4e3e600a50c3007b2e0c6046812c']]);
   let clientLog = await db.collection("ClientLog").where({
    phone: event.phone,
    status: 0
  }).get().then(res => {
    return res.data
  }).catch(err => {
    return err
  })
  for(var i=0;i<clientLog.length;i++){
      var item = clientLog[i]
      var buyId = buyMap.get(item.type)
      console.log(buyId)
      let buyList = await db.collection("BuyCard").where({
        _id: buyId 
      }).get().then(res => {
        return res.data
      }).catch(err => {
        return err
      })
      if(buyList.length>0){
        var buy = buyList[0]
        console.log('卡片：'+buy)
        var buyCardByClient = {
          buyCardId: buy._id,
          createTime: createTime,
          sellerId: event.sellerId,
          status: 1,
          userId: event.openId
        }
        if(item.type=="0" || item.type=="1" || item.type=="2"|| item.type=="4"  ){// 0 年卡   1  半年卡   2  季度卡   3 私教卡   4 月卡
          buyCardByClient.type="1"
          buyCardByClient.useType="0"
          buyCardByClient.begTime=item.begTime
          buyCardByClient.endTime=item.endTime
          buyCardByClient.lastupdateTime=item.begTime
          buyCardByClient.totalCounts = buy.totalCounts
        }else{//    3 私教卡   
          buyCardByClient.totalCounts = item.count
          buyCardByClient.type="0"
          buyCardByClient.useType="1"
          buyCardByClient.totalMoney=item.totalMoney
          buyCardByClient.money=item.money
          buy.money=item.money
          buy.totalCounts=item.totalCounts
        }
        buyCardByClient.buyCardInfo=buy
        var status = await db.collection('BuyCardByClient').add({
          data: buyCardByClient
        }).then(res => {
          return res
        }).catch(err => {
          return err
        })
        if(status._id!=null){
          var itemId = item._id
          item.status=1
          delete item._id
          status = await db.collection('ClientLog').doc(itemId).update({
            data: item
          }).then(res => {
            return res
          }).catch(err => {
            return err
          })
        }
      }else{
        console.log('未找到卡片')
      }
  }
}