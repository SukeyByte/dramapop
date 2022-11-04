// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
    //env: 'mail-stg-oboxi'
    env:'mallforgym-i8imy'
})

// 云函数入口函数
exports.main = async (event, context) => {
    var fileContents=[];
    for (var i = 0 ;event.fileBuffers.length>i;i++){
      var timestamp = Date.parse(new Date());
      timestamp = timestamp / 1000;
      let cloudPath = timestamp+i+1;
      const fileStream = Buffer.from(event.fileBuffers[i].replace(/data:image\/png;base64,/,''),'base64')
      console.log(event.fileBuffers[i]);
      var fileContent = await cloud.uploadFile({
        fileContent:fileStream,
        cloudPath: event.fileName+'/' + cloudPath + '.png'
      }).then(res=>{
        return res
      }).catch(err=>{
        return err
      })
      fileContents.push(fileContent)
    }
    return fileContents
}