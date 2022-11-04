/**********计算健身房运动时间后的金钱***********/
const time = require('../util/getTime.js')
const app = getApp()
const db = wx.cloud.database()
const _ = db.command

async function caculete(startTime, endTime, sellerId) {
  let totalMoney = 0
  //获取健身房时间表

  let start = time.getYMDHMS(startTime)
  let end = time.getYMDHMS(endTime)

  //获取当前计算的小时数
  let totalHour = ((endTime - startTime) / 1000 / 60 / 60)
  let ourcount
  if (end.date == start.date) {
    ourcount = parseInt(end.hours) - parseInt(start.hours)
  } else {
    ourcount = (parseInt(end.hours) - 0) + (24 - parseInt(start.hours))
  }

  if (ourcount > 0) {
    totalHour = ourcount
  }
  if (startTime > endTime) { //开始时间大于结束时间时直接最高金额
    totalMoney = 49
  } else if (totalHour > 20) { //持续时间结束20小时时直接最大金额
    totalMoney = 49
  } else {
    let queryid = []
    //根据运动时间获取ID
    for (let i = 0; i <= totalHour; i++) {
      let id = parseInt(start.hours) + i + 1

      if (id > 24) {
        id = id - 24
      }
      queryid.push(id + '')
    }

    let timeZ = await db.collection('TimeZoom').where({
        _id: _.or(queryid)
      }).get()
      .then(res => {
        return res.data
      })
      .catch(err => {
        return err
      })

    if (timeZ.length == 1) { //当只运动了一个小时的时候，运算区间为开始结束的分钟
      totalMoney = (end.minute - start.minute) / 60 * timeZ[0].money
    } else {
      let startparam = (60 - start.minute) / 60
      let endparam = end.minute / 60

      for (let i = 0; i < queryid.length; i++) {
        //需要根据queryid来匹配顺序
        let currentTz = timeZ.find(item => {
          return item._id == queryid[i]
        })
        let paramMoney = parseFloat(currentTz.money)
        if (i == 0) { //开始的时候需要用开始时间系数计算金额
          totalMoney += startparam * paramMoney
        } else if (i == (timeZ.length - 1)) { //结束的时候需要用开始时间系数计算金额
          totalMoney += endparam * paramMoney
        } else {
          totalMoney += paramMoney
        }
      }
    }
    console.log(parseFloat(totalMoney))
    if (totalMoney > 49) {
      totalMoney = 49
    }
  }


  return parseFloat(totalMoney).toFixed(2)
}
/*******************************
 * 计算是否收费的状态
 * 传入openid，防止在此处获取不到getApp（）
 * 传出status 0 & dataid  --- 新开始运动，无未完成订单
 *            1 & dataid  --- 已经开始运动，开始计算时间
 *            2 & dataid  --- 已经结束运动，尚未结算
 *****************************/
async function caculetestatus(openid, sallerid, phone) {
  let lastdata = await db.collection('SumTimelog').where(
    _.or([{
      status: 0
    }, {
      begTime: _.eq(null),
    }, {
      endTime: _.eq(null),
    }]).and([{
      clientId: openid
    }])
  ).get().then(res => {
    //只返回第一条用于结算
    return res.data[0]
  }).catch(err => {
    console.log(err)
  })

  if (lastdata == undefined) {
    console.log('there has no data,will create a new')
    //新建时候三个都是空的，可以，方便店员扫码进行开始,将创建好的信息返回回去
    let dataid = await db.collection('SumTimelog').add({
      data: {
        'begTime': null,
        'endTime': null,
        'makeTime': null,
        'clientId': openid,
        'sellerId': sallerid,
        'useType': 0,
        'status': 0,
        'phonenumber': phone
      },
    }).then(res => {
      return res._id
    }).catch(err => {
      return err
    })

    return {
      status: 0,
      dataid: dataid
    }
  } else {
    if (lastdata.begTime == null) {
      //如果开始时间为空，则一定尚未开始运动
      return {
        status: 0,
        dataid: lastdata._id
      }
    } else if (lastdata.endTime == null) {
      //如果结束时间为空，则开始运动尚未结束
      return {
        status: 1,
        dataid: lastdata._id,
        begTime: lastdata.begTime,
      }
    } else if (lastdata.status == 0) {
      //如果开始结束时间都结束了，则这个状态代表没支付,返回开始和结束时间
      return {
        status: 2,
        dataid: lastdata._id,
        begTime: lastdata.begTime,
        endTime: lastdata.endTime
      }
    } else {
      //这个就神奇了，不知道这个会发生啥
      return {
        status: 3,
        dataid: lastdata._id
      }
    }
  }
}

module.exports = {
  caculete,
  caculetestatus
}