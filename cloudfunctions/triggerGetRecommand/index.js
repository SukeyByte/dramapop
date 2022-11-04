// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

const db = cloud.database()
const _ = db.command
// 云函数入口函数
exports.main = async (event, context) => {
  await db.collection('Recommand').where({
    all: null
  }).remove({
    success(res) {
      return res
    },
    fail(err) {
      return err
    }
  })
  createActive();
  createCoatch();
  createSeller();
  createClass();
}

function createActive() {
  //创建活动
  for (i = 0; i <= 3; i++) {
    db.collection('Activity').skip(i * 20).limit(20).get().then(res => {
      let activerecommand = []
      res.data.forEach(function (item, index) {
        console.log(item)
        let newitem = {
          name: item.name,
          type: 2,
          title: item.seller || '',
          url: item.imgpath,
          forgionid: item._id
        }
        activerecommand.push(newitem)
      })
      if (activerecommand.length > 0) {
        console.log(activerecommand)
        addData(activerecommand)
      }

    }).catch(err => {
      console.log(err)
    })
  }

}

function createCoatch() {
  for (i = 0; i <= 3; i++) {
    db.collection('Coatch').skip(i * 20).limit(20).get().then(res => {
      let coatchrecommand = []
      res.data.forEach(function (item, index) {
        console.log(item)
        let newitem = {
          name: item.name,
          type: 1,
          title: item.seller || '合作教练',
          url: item.imagepath,
          forgionid: item._id
        }
        coatchrecommand.push(newitem)
      })
      if (coatchrecommand.length > 0) {
        console.log(coatchrecommand)
        addData(coatchrecommand)
      }
    }).catch(err => {
      console.log(err)
    })
  }
}

function createSeller() {
  for (i = 0; i <= 3; i++) {
    db.collection('Seller').skip(i * 20).limit(20).get().then(res => {
      let sellerecommand = []
      res.data.forEach(function (item, index) {
        console.log(item)
        let newitem = {
          name: '推荐场地',
          type: 3,
          title: item.name,
          url: item.logoimg,
          forgionid: item._id
        }
        sellerecommand.push(newitem)
      })
      if (sellerecommand.length > 0) {
        console.log(sellerecommand)
        addData(sellerecommand)
      }
    }).catch(err => {
      console.log(err)
    })
  }
}

function createClass() {
  for (i = 0; i <= 3; i++) {
    db.collection('ClassInfo').where({
      'starttimespan': _.gt(new Date().getTime()),
    }).skip(i * 20).limit(20).get().then(res => {
      let sellerecommand = []
      res.data.forEach(function (item, index) {
        console.log(item)
        let newitem = {
          name: item.coatchInfo.name,
          type: 5,
          title: item.date + ' ' + item.noonTime,
          url: item.coatchInfo.imagepath,
          forgionid: item._id
        }
        sellerecommand.push(newitem)
      })
      if (sellerecommand.length > 0) {
        console.log(sellerecommand)
        addData(sellerecommand)
      }
    }).catch(err => {
      console.log(err)
    })
  }
}

function addData(data) {
  db.collection('Recommand').add({
    data: data
  }).catch(err => {
    console.log(err)
  })
}