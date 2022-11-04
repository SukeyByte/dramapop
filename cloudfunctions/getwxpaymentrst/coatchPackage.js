
//购买 合作教练的卡片包
const cloud = require('wx-server-sdk')
const timeUtil = require('../../miniprogram/util/getTime')
cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})
const db = cloud.database()

async function createCard(event) {
  //打印回调的参数
  console.log('打印回调的参数:'+event)
  let orderInfo = await db.collection('OrderInfo').where({
    order: event.outTradeNo
  }).get().then(res => {
    console.info('打印then的参数:'+res)
    return res.data[0]
  }).catch(err => {
    console.error('打印catch的参数:'+err)
    return null
  })
  var  times= new Date();
  if (orderInfo == null) {
    return;
  }
  let buyCardInfo = {
    detailImg:[{"tempFileURL":"https://6d61-mallforgym-i8imy-1300202136.tcb.qcloud.la/share.jpg?sign=9d1d20bc01f939b7b052613af642e900&t=1619417498"}],
    money:orderInfo.buyCardInfo.total,
    name:orderInfo.title,
    type:0,
    useType:1,
    totalCounts:orderInfo.buyCardInfo.number,
    detai:'合作教练的卡片包',
    sellerId:orderInfo.sellerId,
    createTime:times.getTime(),
    status:1,
    sort:1 
  }
 
  let BuyCardByClient ={
    'buyCardId':orderInfo.buyCardInfo._id,
    'begTime':times.getTime(),
    'endTime':times.getTime(),
    'status':1,
    'sellerId':orderInfo.sellerId,
    'type':0,
    'useType':1,
    'totalCounts':orderInfo.buyCardInfo.number,
    'buyCardInfo':buyCardInfo,
    'lastupdateTime':timeUtil.getYYYYMMDD(times.getTime()),
    'stopCounts':0,
    'laststopTime':times.getTime(),
    'coatchid':orderInfo.buyCardInfo.coatchid,
    'userId':orderInfo.clientId
  }
  var status = await db.collection('BuyCardByClient').add({
    data: BuyCardByClient
  }).then(res => {
    return res
  }).catch(err => {
    return err
  })

}


module.exports = {
  createCard 
}