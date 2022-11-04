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
  var max_limit = 10
  let searchkey = '绝对不会出现'
  if (event.key != '') {
    searchkey = event.key
  }
  console.log(searchkey)
  let data = await db.collection('ClassInfo').aggregate()
    .lookup({
      from: "ClientByClass",  //从哪个集合产生关联
      localField: "_id",  //本地字段item
      foreignField: "classId",  //inventory 的sku字段
      as: "userList"
    })
    .match(_.or({
      name: db.RegExp({
        regexp: searchkey,
        options: 'i',
      })
    }, {
      'coatchInfo.name': db.RegExp({
        regexp: searchkey,
        options: 'i',
      }),
    }).and({
      'starttimespan': _.gt(new Date().getTime()),
    }))
    .project({
      'coatchInfo.name': 1,
      name: 1,
      date: 1,
      noonTime: 1,
      price: 1,
      userList: 1,
    })
    .skip((event.pageIndex - 1) * max_limit).limit(max_limit).end().then(res => {
      console.log(res)
      return res.list
    }).catch(err => {
      return err
    })

  let count = await db.collection('ClassInfo').where(_.or({
    name: db.RegExp({
      regexp: searchkey,
      options: 'i',
    })
  }, {
    'coatchInfo.name': db.RegExp({
      regexp: searchkey,
      options: 'i',
    }),
  }).and({
    'starttimespan': _.gt(new Date().getTime()),
  })).count().then(res => {
    console.log(res)
    return res.total
  }).catch(err => {
    return err
  })

  return { data, count }
}