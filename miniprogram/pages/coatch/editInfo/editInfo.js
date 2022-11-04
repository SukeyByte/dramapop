const app = getApp()
const language = require('../../../util/getLanguageKeyByPage.js')
var time = require('../../../util/now.js')
const img = require('../../../util/getimagesrc.js')
const db = wx.cloud.database()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgsrc: img.logosrc(),
    imgList: [],
    pageCode: null,
    name: '',
    age: '',
    sex: 1,
    number: '',
    itemId: '',
    itemName: '',
    conNum: '',
    money: '',
    picker: ['女', '男'],
    itemDetail: '',
    loadModal: false,
    loadingtext: '',
    qimgList: [],
    tempclouldPaths: null,
    tempallimgpath: null,
    headChangeFlag: false,
    pChangeFlag: false,
  },

  showLoading(text) {
    this.setData({
      loadModal: true,
      loadingtext: text
    })
  },

  hideLoading() {
    this.setData({
      loadModal: false
    })
  },

  namechange: function (e) {
    this.setData({
      name: e.detail.value
    })
  },
  agechange: function (e) {
    var that = this
    let vauleNum = e.detail.value;
    if (vauleNum != "") {
      if (!/^[0-9]*$/.test(vauleNum) || vauleNum == "" || vauleNum == 0) {
        wx.showToast({
          icon: 'none',
          title: that.data.pageCode.index007,
        })
        vauleNum = 20
      }
      this.setData({
        age: vauleNum
      })
    }

  },
  sexchange: function (e) {
    console.log(e.detail.value)
    this.setData({
      sex: e.detail.value
    })
  },
  numberchange: function (e) {
    let vauleNum = e.detail.value;
    this.setData({
      number: vauleNum
    })
  },
  submit() {
    var that = this
    if (this.data.name == "") {
      wx.showToast({
        icon: 'none',
        title: "请输入姓名",
      })
      return
    }
    if (this.data.age == "") {
      wx.showToast({
        icon: 'none',
        title: "请输入年龄",
      })
      return
    }
    if (this.data.number == "") {
      wx.showToast({
        icon: 'none',
        title: "请输入电话号码",
      })
      return
    }

    wx.requestSubscribeMessage({
      tmplIds: ['iRB2UsQ1ffFQqMaEtBWkNKgRxF7-3JONzfV6grGZ8E4'],
      success(res) {
        console.log(that.tmplIds + res);
        if (res.confirm) {
          //调用订阅消息
          console.log('用户点击确定');
        } else if (res.cancel) {
          console.log('用户点击取消');
        }
      },
      fail(res) {
        console.log('用户点击取消');
        console.log(that.tmplIds + res.errMsg + "   /n" + res.errCode)
      },
      complete: (errMsg) => {
        that.addCoatch()
      }
    })
  },
  //上传教练信息
  async addCoatch() {
    var that = this
    that.showLoading('上传中')
    let headimg, headtmpimg, paperimg, filetmpimg
    if (this.data.headChangeFlag) {
      headimg = await this.uploadFiles(that.data.imgList)
    } else {
      headimg = that.data.imgList
    }
    console.log(that.data.imgList)

    if (this.data.pChangeFlag) {
      paperimg = await this.uploadFiles(that.data.qimgList)
    } else {
      paperimg = that.data.qimgList
    }

    filetmpimg = await this.getTempUrl(paperimg)
    headtmpimg = await this.getTempUrl(headimg)

    that.hideLoading()
    this.saveDataToRequest(headtmpimg[0].tempFileURL, filetmpimg, headimg, paperimg)

  },

  async uploadFiles(filePath) {
    var clouldFilePath = [];
    for (let i = 0; i < filePath.length; i++) {
      let finalpath = await this.getFileResult(filePath[i], i)
      clouldFilePath.push(finalpath)
    }
    return clouldFilePath;
  },

  async getFileResult(singlefilePath, i) {
    var timestamp = Date.parse(new Date());
    timestamp = timestamp / 1000;
    console.log("当前时间戳为：" + timestamp);
    let tempfilrPath = singlefilePath
    console.log(tempfilrPath.match(/\.[^.]+?$/)[0])
    let cloudPath = app.globalData.openid + timestamp + i + tempfilrPath.match(/\.[^.]+?$/)[0]
    console.log(cloudPath)
    let filepath = await wx.cloud.uploadFile({
      cloudPath,
      filePath: tempfilrPath.toString(),
    }).then(res => {
      console.log(res)
      return res.fileID
    }).catch(err => {
      console.error(err)
    })
    return filepath
  },

  async getTempUrl(clouldFilePath) {
    return await wx.cloud.getTempFileURL({
      fileList: clouldFilePath
    }).then(res => {
      return res.fileList
    }).catch(error => {
      console.log(error)
    })
  },
  //保存数据
  saveDataToRequest(headImage, fileImages, clouldFilePath, cloudPath) {
    let that = this
    that.showLoading('正在申请..')
    const db = wx.cloud.database()
    db.collection('CoatchEdit').add({
      data: {
        userId: app.globalData.openId,
        createTime: time.now,
        userInfo: app.globalData.userInfo,
        name: that.data.name,
        age: that.data.age,
        sex: that.data.sex,
        number: that.data.number,
        detail: that.data.itemDetail,
        allimgpath: fileImages,
        imagepath: headImage,
        image: clouldFilePath,
        path: cloudPath
      },
      success: function (res) {
        console.log(res)
        wx.showToast({
          title: "申请成功！",
        })
        wx.navigateBack()
      },
      fail: err => {
        wx.showToast({
          icon: 'none',
          title: "申请失败！",
        })
      },
      complete: res => {
        that.hideLoading()
      }
    })

  },

  textareaAInput(e) {
    this.setData({
      itemDetail: e.detail.value
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    that.showLoading('收集数据中..')
    db.collection('Coatch').where({
      _openid: app.globalData.openid
    }).get().then(res => {
      console.log(res)
      if (res.data.length > 0) {
        let current = res.data[0]
        that.data.imgList.push(current.image[0])
        for (let i = 1; i < current.image.length; i++) {
          that.data.qimgList.push(current.image[i])
        }
        that.setData({
          name: current.name,
          age: current.age,
          sex: current.sex,
          imgList: current.image,
          qimgList: current.path,
          number: current.number,
          itemDetail: current.detail,
          tempclouldPaths: current.image,
          tempallimgpath: current.allimgpath
        })
        that.hideLoading()
      }
    }).catch(res => {
      that.hideLoading()
      wx.navigateBack({
        delta: 0,
      })
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  ChooseImage() {
    wx.chooseImage({
      count: 1, //默认9
      sizeType: ['compressed'], //可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album'], //从相册选择
      success: (res) => {
        this.data.headChangeFlag = true
        if (this.data.imgList.length != 0) {
          this.setData({
            imgList: this.data.imgList.concat(res.tempFilePaths)
          })
        } else {
          this.setData({
            imgList: res.tempFilePaths
          })
        }
      }
    });
  },
  ViewImage(e) {
    wx.previewImage({
      urls: this.data.imgList,
      current: e.currentTarget.dataset.url
    });
  },
  DelImg(e) {
    wx.showModal({
      title: ' ',
      content: '确定要删除这张照片吗？',
      cancelText: '取消',
      confirmText: '确定',
      success: res => {
        if (res.confirm) {
          this.data.imgList.splice(e.currentTarget.dataset.index, 1);
          this.setData({
            imgList: this.data.imgList
          })
        }
      }
    })
  },
  ChoosepImage() {
    wx.chooseImage({
      count: 3, //默认9
      sizeType: ['compressed'], //可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album'], //从相册选择
      success: (res) => {
        this.data.pChangeFlag = true
        if (this.data.qimgList.length != 0) {
          this.setData({
            qimgList: this.data.qimgList.concat(res.tempFilePaths)
          })
        } else {
          this.setData({
            qimgList: res.tempFilePaths
          })
        }
      }
    });
  },
  ViewpImage(e) {
    wx.previewImage({
      urls: this.data.qimgList,
      current: e.currentTarget.dataset.url
    });
  },
  DelpImg(e) {
    wx.showModal({
      title: ' ',
      content: '确定要删除这张照片吗？',
      cancelText: '取消',
      confirmText: '确定',
      success: res => {
        if (res.confirm) {
          this.data.qimgList.splice(e.currentTarget.dataset.index, 1);
          this.setData({
            qimgList: this.data.qimgList
          })
        }
      }
    })
  },
})