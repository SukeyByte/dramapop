const language = require('../../util/getLanguageKeyByPage.js')
const storage = require('../../util/storageControl.js')
async function getfootData(e) {
  var footer = [{
      "footCode": "主页",
      "footIcon": "cuIcon-home",
      "isSelect": false,
      "name": "newIndex",
      "navUrl": "/pages/student/newIndex/newIndex",
      "showName": true
    },
    {
      "footCode": "约课",
      "footIcon": "cuIcon-time",
      "isSelect": false,
      "name": "class",
      "navUrl": "/pages/student/class/mainclass",
      "showName": true
    },
    {
      "footCode": "咔咔",
      "footIcon": "cuIcon-hot",
      "isSelect": false,
      "name": "callCoatch",
      "navUrl": "/pages/student/callCoatch/callCoatch",
      "showName": true
    },
    {
      "footIcon": "cuIcon-my",
      "isSelect": false,
      "name": "mine",
      "navUrl": "/pages/student/mine/mine",
      "showName": true,
      "footCode": "我的"
    }
  ]
  console.log(e)
  for (var i = 0; i < footer.length; i++) {
    footer[i].isSelect = false
    if (footer[i].navUrl.indexOf(e) != -1) {
      console.log(e)
      footer[i].isSelect = true
    }
  }
  return footer
}

module.exports = {
  footDataList: getfootData
}