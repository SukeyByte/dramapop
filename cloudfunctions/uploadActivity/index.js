// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: 'mail-stg-oboxi'
})

// 云函数入口函数
exports.main = async (event, context) => {
    var timestamp = Date.parse(new Date());
    timestamp = timestamp / 1000;
    let cloudPath = timestamp;
    const fileStream = Buffer.from(event.fileBuffer.replace(/data:image\/png;base64,/,''),'base64')
    console.log(event.fileBuffer);
    return await cloud.uploadFile({
      fileContent:fileStream,
      cloudPath: 'activity/' + cloudPath + '.png'
    }).then(res=>{
      return res
    }).catch(err=>{
      return err
    })

}