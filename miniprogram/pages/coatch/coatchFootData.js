async function getfootData(e) {
  let footDataList = [
    {
      "footCode": "主页",
      "footIcon": "cuIcon-home",
      "navUrl": "/pages/coatch/index/index",
      "showName": true,
      "isSelect": false,
      "name": "index"
    },
    {
      "footCode": "排课",
      "footIcon": "cuIcon-time",
      "navUrl": "/pages/coatch/targetclasses/targetclasses",
      "showName": true,
      "isSelect": false,
      "name": "date"
    },
    {
      "footCode": "咔咔",
      "footIcon": "cuIcon-list",
      "navUrl": "/pages/coatch/listenOrder/listenOrder",
      "showName": true,
      "isSelect": false,
      "name": "stu"
    },
    {
      "footCode": "我的",
      "footIcon": "cuIcon-my",
      "navUrl": "/pages/coatch/my/my",
      "showName": true,
      "isSelect": false,
      "name": "my"
    }
  ]

  for (var i = 0; i < footDataList.length; i++) {
    footDataList[i].isSelect = false
    if (footDataList[i].name.indexOf(e) != -1) {
      footDataList[i].isSelect = true
    }
  }
  console.log(footDataList)
  return footDataList
}

module.exports = {
  footDataList: getfootData
}