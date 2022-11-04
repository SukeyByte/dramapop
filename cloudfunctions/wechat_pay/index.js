//云开发实现支付
const cloud = require('wx-server-sdk')
cloud.init({
  env: 'mail-stg-oboxi'
})

//1，引入支付的三方依赖
const tenpay = require('tenpay');
//2，配置支付信息
const config = {
  appid: 'wx33ce179423c9f1a0',
  mchid: '1548455011',
  partnerKey: 'VjAxU7Y5vfXmnLrC5p6HizLb3oE7SHGp',
  notify_url: 'http://shici.sukeke.xyz/weixinNotify.action',
  spbill_create_ip: '127.0.0.1' //这里填这个就可以
};

exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  let {
    orderid,
    money,
    name
  } = event;
  //3，初始化支付
  const api = tenpay.init(config);

  let result = await api.getPayParams({
    out_trade_no: orderid,
    body: name,
    total_fee: money, //订单金额(分),
    openid: wxContext.OPENID //付款用户的openid
  });
  return result;
}