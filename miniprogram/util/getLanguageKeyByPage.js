const app = getApp()
const db = wx.cloud.database()
const storage = require('./storageControl.js')

async function getLanguage(pagename) {
  let pageName = pagename + 'Page'
  let appLanguage = app.globalData.languageSet
  let pageLanguageStorge = storage.getStorageSyncTime(pageName, "Empty")
  if(pageLanguageStorge == "Empty"){
    let data = await db.collection(appLanguage)
      .where({
        pageInfo: pageName
      })
      .get().then(res => {
        storage.setStorageSyncHour(pageName,res.data[0])
        return res.data[0]
      })
    return data
  }
  return pageLanguageStorge

}

async function getResource(pagename) {
  let pageName = pagename + 'Page'
  let sourceSite = app.globalData.sourceSite
  let data = await db.collection(sourceSite)
    .where({
      pageInfo: pageName
    })
    .get().then(res => {
      return res.data[0]
    })
  return data
}

module.exports = {
  getLanguage, getResource
}