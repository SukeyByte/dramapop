const HB = require('../../../util/getDates.js');
const footdata = require('../../coatch/coatchFootData.js')
const language = require('../../../util/getLanguageKeyByPage.js')
const img = require('../../../util/getimagesrc.js')
const app = getApp()
Component({

  options: {
    addGlobalClass: true,
  },

  /**
   * 组件的属性列表
   */
  properties: {
    pageCode: {
      type: [Array],
      default: []
    },
  },
  /**
   * 页面的初始数据
   */
  data: {
    imgsrc:img.logosrc(),
    dataList: [],
    pageCode: [],
    currentId: '',
    showModel: false,
    modelTitle: '',
    currentData: '',
    sourceList: [{
      "NoonName": "10:00-10:30",
      "Noon": 1,
    },
    {
      "NoonName": "10:30-11:00",
      "Noon": 2,
    },
    {
      "NoonName": "11:00-11:30",
      "Noon": 3,
    },
    {
      "NoonName": "11:30-12:00",
      "Noon": 4,
    },
    {
      "NoonName": "12:00-12:30",
      "Noon": 5,
    },
    {
      "NoonName": "12:30-13:00",
      "Noon": 6,
    },
    {
      "NoonName": "13:30-14:00",
      "Noon": 7,
    },
    {
      "NoonName": "14:00-14:30",
      "Noon": 8,
    },
    {
      "NoonName": "14:30-15:00",
      "Noon": 9,
    },
    {
      "NoonName": "15:30-16:00",
      "Noon": 10,
    },
    {
      "NoonName": "16:00-16:30",
      "Noon": 11,
    },
    {
      "NoonName": "16:30-17:00",
      "Noon": 12,
    },
    {
      "NoonName": "17:00-17:30",
      "Noon": 13,
    },
    {
      "NoonName": "17:30-18:00",
      "Noon": 14,
    },
    {
      "NoonName": "18:00-18:30",
      "Noon": 15,
    },
    {
      "NoonName": "18:30-19:00",
      "Noon": 16,
    },
    {
      "NoonName": "19:00-19:30",
      "Noon": 17,
    },
    {
      "NoonName": "19:30-20:00",
      "Noon": 18,
    },
    {
      "NoonName": "20:00-20:30",
      "Noon": 19,
    },
    {
      "NoonName": "20:30-21:00",
      "Noon": 20,
    },
    {
      "NoonName": "21:00-21:30",
      "Noon": 21,
    },
    {
      "NoonName": "21:30-22:00",
      "Noon": 22,
    },
    {
      "NoonName": "22:00-22:30",
      "Noon": 23,
    },
    {
      "NoonName": "22:30-23:00",
      "Noon": 24,
    },
    {
      "NoonName": "23:00-23:30",
      "Noon": 25,
    },
    {
      "NoonName": "23:30-00:00",
      "Noon": 26,
    }
    ],
    dateArray: [],
    noonList: [],
    StartClinicDate: "",
    EndClinicDate: "",
    repeat: true,
    className: '',
    checkedSingle: true,
    maxNumber: 20,
    systemInfo: null,
    checkedSpell: false,
    price: 100,
    loadModal: false,
    loadingtext: '',
    currentX: null,
    selectData: []
  },

  /**
   * 组件的方法列表
   */
  methods: {
    showLoading: function (text) {
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

    getCurrentDate: function (e) {
      var timestamp = Date.parse(e);
      var date = new Date(timestamp);
      //获取年份  
      var Y = date.getFullYear();
      //获取月份  
      var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1);
      //获取当日日期 
      var D = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
      console.log(Y + '-' + M + '-' + D)
      return Y + '-' + M + '-' + D
    },

    removal: function () {
      var that = this;
      var objectArray = this.data.sourceList;
      var newObject = [];
      for (var i = 0; i < objectArray.length; i++) //从第二项开始遍历
      {
        newObject.push(objectArray[i].NoonName);
      }

      var finalArray = [newObject[0]]; //结果数组
      for (var j = 1; j < newObject.length; j++) //从第二项开始遍历
      {
        //如果当前数组的第i项在当前数组中第一次出现的位置不是i，
        //那么表示第i项是重复的，忽略掉。否则存入结果数组
        if (newObject.indexOf(newObject[j]) == j) {
          finalArray.push(newObject[j]);
        }
      }
      var noonList = [];
      for (var k = 0; k < finalArray.length; k++) //从第二项开始遍历
      {
        noonList.push({
          NoonName: finalArray[k],
          noon: that.getNoonNum(finalArray[k]),
          Value: false,
          list: []
        })
      }
      that.setData({
        noonList: noonList.sort(that.compare("noon"))
      })
      that.getSevenDays();
      console.log(noonList)
    },
    getNoonNum: function (ele) {
      var num;
      let sourceList = this.data.sourceList
      for (let i = 0; i < sourceList.length; i++) {
        let source = sourceList[i]
        if (source.NoonName == ele) {
          num = source.Noon
          return num;
        }
      }
      return num;
    },
    compare: function compare(property) {
      return function (a, b) {
        var value1 = a[property];
        var value2 = b[property];
        return value1 - value2;
      }
    },

    getSevenDays: function () {
      var that = this
      var daysArray = [];
      var dayDict = {};
      var weekStr = '';
      var weekNum = '';
      var date = new Date(); //当前日期
      var newDate = new Date();
      //开始日期与结束日期之间相差天数
      var dateNum = 0;
      if (that.data.systemInfo == 1) {
        dateNum = HB.DatedifferenceIos(this.data.StartClinicDate, this.data.EndClinicDate);
      } else {
        dateNum = HB.Datedifference(this.data.StartClinicDate, this.data.EndClinicDate);
      }
      //显示几周的表格
      var weekNum = Math.ceil((dateNum + 1) / 3);
      var dateArr = HB.GetAll(this.data.StartClinicDate, HB.DateCount(this.data.StartClinicDate, weekNum * 3 - 1));
      dateArr = (this.data.StartClinicDate + "," + dateArr + HB.DateCount(this.data.StartClinicDate, weekNum * 3 - 1)).split(","); //获取两个日期之间日期
      for (var i = 0; i < dateArr.length; i++) {
        weekNum = this.getWeekNum(this.getWeekByDay(dateArr[i]));
        dayDict = {
          "date": dateArr[i],
          "date_text": dateArr[i].substring(5, 10),
          "weekName": this.getWeekByDay(dateArr[i]),
          "weekNum": weekNum
        };
        daysArray.push(dayDict);
      }
      console.log(daysArray)
      this.setData({
        dateArray: daysArray
      });
      this.dealData();
    },
    getWeekNum: function (ele) {
      var num;
      switch (ele) {
        case '周一':
          num = 0;
          break;
        case '周二':
          num = 1;
          break;
        case '周三':
          num = 2;
          break;
        case '周四':
          num = 3;
          break;
        case '周五':
          num = 4;
          break;
        case '周六':
          num = 5;
          break;
        case '周日':
          num = 6;
          break;
      }
      return num;
    },
    getWeekByDay: function (value) {
      var day = new Date(Date.parse(value.replace(/-/g, '/'))); //将日期值格式化  
      var today = new Array("周日", "周一", "周二", "周三", "周四", "周五", "周六"); //创建星期数组  
      return today[day.getDay()];
    },
    dealData: function () {
      var that = this;
      var objectArray = that.data.noonList;
      let loopNum = that.data.dateArray.length;
      for (var k = 0; k < objectArray.length; k++) {
        for (var m = 0; m < loopNum; m++) {
          objectArray[k].list.push({
            keyue: false,
            date: HB.DateCount(that.data.StartClinicDate, m)
          })
        }
      }
      for (var i = 0; i < that.data.sourceList.length; i++) {
        var assignmentArray;

        for (var j = 0; j < objectArray.length; j++) {
          if (objectArray[j].NoonName == that.data.sourceList[i].NoonName) {
            assignmentArray = objectArray[j];
          }
        }
        assignmentArray.Value = true;
        for (var n = 0; n < assignmentArray.list.length; n++) {
          if (assignmentArray.list[n].date == that.data.sourceList[i].Date) {

          }
        }

      }
      that.setData({
        noonList: objectArray
      })
    },

    //选择事件
    selecttb: function (e) {
      console.log(e.currentTarget.dataset.index)
      let ids = e.currentTarget.dataset.index.split('~')
      let that = this
      console.log(ids)
      if (this.data.currentX == null) {
        //为了防止异步，在确定没有数据的时候就进行清空
        this.data.selectData = []
        //记录所选择的第一个X轴，然后进行同一行的判断
        console.log(ids[1])
        that.setData({
          currentX: ids[1]
        })
        console.log(this.data.currentX)
      }
      //如果选择了不同的列，则不记录
      if (this.data.currentX != ids[1]) {
        console.log(this.data.currentX)
        return
      }
      //如果已经选择了则取消所有选项,加入到缓存内容中方便后续使用
      if (this.data.noonList[ids[0]].list[ids[1]].select) {
        this.data.noonList[ids[0]].list[ids[1]].select = false
        this.data.selectData.splice(this.data.selectData.indexOf(e.currentTarget.dataset.index), 1)
      } else {
        this.data.noonList[ids[0]].list[ids[1]].select = true
        if (this.data.selectData.indexOf(e.currentTarget.dataset.index < 0))
          this.data.selectData.push(e.currentTarget.dataset.index)
      }

      this.data.noonList[ids[0]].list[ids[1]].color = 'gray'
      this.setData({
        noonList: this.data.noonList
      })

    },
    //取消选中事件
    cancelSelect() {
      this.currentX = null;
      console.log(this.data.selectData)
      for (let i = 0; i < this.data.selectData.length; i++) {
        let ids = this.data.selectData[i].split('~')
        this.data.noonList[ids[0]].list[ids[1]].select = false
        this.setData({
          noonList: this.data.noonList
        })
      }
      this.data.selectData = []
      this.data.currentX = null
    },
    confirmSelect() {
      this.currentX = null;
      console.log(this.data.selectData)
      let correntSelectDate = '';
      let startTime = '';
      let endTime;
      let last = null;
      let firstclass = null;
      let idlist = [];
      for (let i = 0; i < this.data.selectData.length; i++) {
        let ids = this.data.selectData[i].split('~')
        console.log(this.data.noonList[ids[0]].list[ids[1]])
        correntSelectDate = this.data.noonList[ids[0]].list[ids[1]].date

        if (this.data.noonList[ids[0]].list[ids[1]]._id != null) {
          //存入ID方便后续操作
          idlist.push(this.data.noonList[ids[0]].list[ids[1]]._id)
          if (firstclass == null) {
            //如果选择的table中有课程，则保留第一条if
            firstclass = this.data.noonList[ids[0]].list[ids[1]]
          }
        }

        //计算并获取时间和日期
        if (last == null) {
          last = this.data.noonList[ids[0]]
          startTime = last.NoonName.split('-')[0]
          endTime = last.NoonName.split('-')[1]
        }
        else {
          if (last.noon > this.data.noonList[ids[0]]) {
            startTime = this.data.noonList[ids[0]].NoonName.split('-')[0]
            endTime = last.NoonName.split('-')[1]
          }
          else {
            startTime = last.NoonName.split('-')[0]
            endTime = this.data.noonList[ids[0]].NoonName.split('-')[1]
          }
        }
        if (i == (this.data.selectData.length - 1)) {
          console.log(correntSelectDate + ' ' + startTime + '-' + endTime)
          //当时间和日期计算完之后，打开设置界面
          this.showData(correntSelectDate + ' ' + startTime + '-' + endTime, firstclass, idlist)
        }
      }
    },

    showData(title, item, idlist) {
      if (item == undefined || item == null) {
        item = {
          name: this.data.pageCode.time011 + (this.data.checkedSingle ? this.data.pageCode.time012 : this.data.pageCode.time019),
          type: 1,
          total: 20,
          checkedSpell: false,
          price: 100
        }
      }
      console.log(this.data.selectData)
      this.setData({
        showModel: true,
        modelTitle: title,
        currentData: this.data.selectData,
        currentId: idlist,
        className: item.name,
        checkedSingle: item.type != 2,
        checkedSpell: item.type == 3,
        maxNumber: item.total,
        price: item.price
      })
    },

    clicktb: function (e) {
      console.log(e.currentTarget.dataset.id)
      console.log(e.currentTarget.dataset.index)
      console.log(e.currentTarget.dataset.date)
      console.log(e.currentTarget.dataset)
      console.log(e.currentTarget.dataset.item)
      let item = e.currentTarget.dataset.item
      if (item == undefined || item == null) {
        item = {
          name: this.data.pageCode.time011 + (this.data.checkedSingle ? this.data.pageCode.time012 : this.data.pageCode.time019),
          type: 1,
          total: 20,
          checkedSpell: false,
          price: 100
        }
      }
      this.setData({
        showModel: true,
        modelTitle: e.currentTarget.dataset.date,
        currentData: e.currentTarget.dataset.index,
        currentId: e.currentTarget.dataset.id,
        className: item.name,
        checkedSingle: item.type != 2,
        checkedSpell: item.type == 3,
        maxNumber: item.total,
        price: item.price
      })
    },
    hideModal(e) {
      this.setData({
        showModel: false
      })
    },
    async loadData() {
      this.showLoading('加载中...')
      const db = wx.cloud.database()

      //定义每次获取的条数​
      const MAX_LIMIT = 100;
      //先取出集合的总数
      const countResult = await db.collection('ClassInfo').where({
        '_openid': app.globalData.openid
      }).count()
      const total = countResult.total
      //计算需分几次取
      const batchTimes = Math.ceil(total / MAX_LIMIT)

      const arraypro = []

      for (let d = 0; d < batchTimes; d++) {
        const res = await db.collection('ClassInfo').where({
          '_openid': app.globalData.openid
        }).skip(d * MAX_LIMIT).limit(MAX_LIMIT).get()


        for (let i = 0; i < res.data.length; i++) {
          let x = 0;
          for (let c = 0; c < this.data.dateArray.length; c++) {
            if (this.data.dateArray[c].weekNum == res.data[i].weekNum) {
              x = c;
              if (res.data[i].repeat) {
                //根据weeknum获得x的值，因为x在变动
                this.data.noonList[res.data[i].y].list[x] = res.data[i];
              } else {
                if (res.data[i].date == this.data.noonList[res.data[i].y].list[x].date) {
                  this.data.noonList[res.data[i].y].list[x] = res.data[i];
                }
              }
            }
          }
          console.log(x)
        }
      }

      this.setData({
        noonList: this.data.noonList
      })
      this.hideLoading()
    },

    switchChange: function (e) {
      this.setData({
        repeat: !this.data.repeat
      })
    },
    // 课程名称
    classNameInput: function (e) {
      this.setData({
        className: e.detail.value
      })
    },
    changeType: function (e) {
      this.setData({
        checkedSingle: !this.data.checkedSingle,
        checkedSpell: false
      })
    }, priceInput: function (e) {
      this.setData({
        price: this.data.price
      })
    },
    changeSpell: function (e) {
      let num = this.data.pageCode.maxNum
      if (!this.data.checkedSpell) {
        num = this.data.pageCode.maxSpellNum
      }
      this.setData({
        checkedSpell: e.detail.value,
        maxNumber: num
      })
    },
    // 最大人数限制
    maxPeopleInput: function (e) {
      let num = e.detail.value
      this.setData({
        maxNumber: num
      })
    },

    deleteClass() {
      this.showLoading('正在写入课程')
      console.log(this.data.selectData)
      var that = this

      this.data.selectData.forEach(function (sditem, index) {
        console.log(sditem)
        that.Cancel(sditem, that)
      })
      this.resetClassData()
    },

    Cancel(sditem, e) {
      var that = e
      let ids;

      if (sditem != '') {
        console.log(sditem)
        ids = sditem.split('~')
      }

      if (that.data.noonList[ids[0]].list[ids[1]]._id == null) {
        that.resetClassData()
        return;
      }
      console.log(that.data.noonList[ids[0]].list[ids[1]]._id)
      const db = wx.cloud.database()
      db.collection('ClassInfo')
        .doc(that.data.noonList[ids[0]].list[ids[1]]._id)
        .remove().then(res => {
          if (ids.length == 2) {
            console.log(ids)
            that.data.noonList[ids[0]].list[ids[1]] = {
              keyue: false,
              date: that.data.noonList[ids[0]].list[ids[1]].date,
            }
            that.setData({
              noonList: that.data.noonList
            })
          }
        })
        .catch(console.error)

      that.resetClassData()
    },

    //存储课程
    async saveClass() {
      this.showLoading('正在写入课程')
      console.log(this.data.selectData)
      var that = this
      //加入标签，以当前时间戳为标签，后续查询时可对课程进行整合
      var tag = new Date().getTime()

      this.data.selectData.forEach(function (item) {
        console.log(item)
        that.Confirm(item, tag, that)
      })
      this.resetClassData()
    },

    async Confirm(current, tag, e) {
      let that = e
      console.log(current)
      let ids;
      //判断人数
      let maxNum = that.data.pageCode.maxNum
      let maxSpellNum = that.data.pageCode.maxSpellNum
      let num = that.data.maxNumber
      if (that.data.checkedSpell) {//私教拼团
        if (num > maxSpellNum || num < 1) {
          that.hideLoading()
          wx.showToast({
            title: that.data.pageCode.time018 + maxSpellNum,
          })
          return false;
        }
      } else {
        if (num > maxNum || num < 1) {
          that.hideLoading()
          wx.showToast({
            title: that.data.pageCode.time018 + maxNum,
          })
          return false;
        }
      }
      if (current != '') {
        ids = current.split('~')
      }
      if (ids.length == 2) {
        console.log(that.data.noonList[ids[0]].list[ids[1]]);
        let weekNum = that.getWeekNum(that.getWeekByDay(that.data.noonList[ids[0]].list[ids[1]].date))
        var noonNameTiem = that.data.sourceList[ids[0]].NoonName
        let classData = {
          keyue: true,
          date: that.data.noonList[ids[0]].list[ids[1]].date,
          weekNum: weekNum,
          showtype: '私教',
          type: 1,
          color: 'green',
          total: that.data.maxNumber,
          price: that.data.price,
          name: that.data.className,
          repeat: that.data.repeat,//是否重复
          createTime: new Date().getTime(),
          sellerId: app.globalData.sallerinfo._id, 
          y: ids[0],
          x: ids[1],
          noonTime:noonNameTiem
        };
        if (that.data.repeat) {
          if (that.data.checkedSingle) {
            if (that.data.checkedSpell) {//拼团私教有人数和价格
                classData.showtype = '拼客私教',
                classData.type = 3,
                classData.color = 'cyan'
            } else {
                classData.showtype = '私教',
                classData.type = 1,
                classData.color = 'green',
                classData.total = 1
            }
          } else {
              classData.showtype = '团体课',
              classData.type = 2,
              classData.color = 'blue'
          }
        } else {
          if (that.data.checkedSingle) {
            if (that.data.checkedSpell) {//拼团私教有人数和价格
                classData.showtype = '拼客私教',
                classData.type = 3,
                classData.color = 'cyan'
            } else {
                classData.showtype = '私教',
                classData.type = 1,
                classData.color = 'redLight',
                classData.total = 1
            }
          } else {
              classData.showtype = '团体课',
              classData.type = 2,
              classData.color = 'orange'
          }
        }

        that.data.noonList[ids[0]].list[ids[1]] = classData;

        const db = wx.cloud.database()

        let coatchInfo = await db.collection('Coatch').where({
          _openid: app.globalData.openid
        }).get()

        classData.coatchInfo = coatchInfo.data[0]

        classData.user = app.globalData.userInfo
        classData.openid = app.globalData.openid
        classData.tag = tag

        console.log(classData)
        if (that.data.noonList[ids[0]].list[ids[1]]._id == null || that.data.noonList[ids[0]].list[ids[1]]._id == undefined) {
          db.collection('ClassInfo').add({
            data: classData
          }).then(res => {
            console.log(res)
            that.data.noonList[ids[0]].list[ids[1]]._id = res._id
            that.setData({
              noonList: that.data.noonList
            })
          }).catch(console.error)
        } else {
          db.collection('ClassInfo').doc(that.data.noonList[ids[0]].list[ids[1]]._id).update({
            data: classData
          }).then(res => {
            console.log(res)
            that.data.noonList[ids[0]].list[ids[1]]._id = res._id
            that.setData({
              noonList: that.data.noonList
            })
          }).catch(console.error)
        }

      }
    },

    resetClassData: function () {
      this.hideLoading()
      this.setData({
        showModel: false,
        className: this.data.pageCode.time011 + (this.data.checkedSingle ? this.data.pageCode.time012 : this.data.pageCode.time019),
        checkedSingle: true,
        maxNumber: 20,
        checkedSpell: false,
        price: 100
      })
      this.data.selectData = []
      this.data.currentX = null
    }
  },

  lifetimes: {
    // 生命周期函数，可以为函数，或一个在methods段中定义的方法名
    attached: function () {
      let that = this
      wx.getSystemInfo({
        success: function (res) {
          let systemInfo = 0
          if (res.platform == "devtools") {
            that.data.StartClinicDate = that.getCurrentDate(new Date())
            that.data.EndClinicDate = that.getCurrentDate(new Date())
            systemInfo = 0
          } else if (res.platform == "ios") {
            that.data.StartClinicDate = that.getCurrentDate(new Date()).replace(/\-/g, "/")
            that.data.EndClinicDate = that.getCurrentDate(new Date()).replace(/\-/g, "/")
            systemInfo = 1
          } else if (res.platform == "android") {
            that.data.StartClinicDate = that.getCurrentDate(new Date())
            that.data.EndClinicDate = that.getCurrentDate(new Date())
            systemInfo = 2
          }
          that.setData({
            systemInfo: systemInfo,
            dataList: footdata.footDataList('datelist')
          })
          console.log(that.data.dataList)
          that.removal();
          console.log("=============systemInfo===============>" + res)
        }
      })
      console.log("========ready==========33")
    },
    moved: function () { },
    detached: function () { },
  },

  ready: function () {
    console.log("========ready==========11")
    language.getLanguage('timeSet').then(res => {
      console.log(res)
      this.setData({
        pageCode: res,
        className: res.time011
      })
    }),
      console.log("========ready==========22")
    this.loadData()
  },
})