const $ = getApp().globalData
import formatTime from "../../utils/util.js";
// pages/my_info/my_info.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    header: '',
    birthday: '出生年月',
    positionList: [{name:'门将', sel: 0},{name: '前锋', sel: 0}, {name: '中场', sel: 0},{name: '后卫', sel: 0}],
    casArray: [], // 身高
    casIndex: 0,
    weight:[], // 体重
    weightIndex:0,
    nowData:'',
    props: [{ title: '单刀克星', sel: 0 }, { title: '破坏者型', sel: 0 }, { title: '抢球利器', sel: 0 }, { title: '铁腰后闸', sel: 0 },
      { title: '灵魂人物', sel: 0 }, { title: '后防中坚', sel: 0 }, { title: '弧线专家', sel: 0 }, { title: '哈维附体', sel: 0 }, 
      { title: '护球高手', sel: 0 }],
    img: {
      header: '/images/header@3x.png',
      age: '/images/age.png',
      name: '/images/uname.png',
      sex: '/images/sex.png',
      born: '/images/brithday.png',
      height: '/images/height.png',
      weight: '/images/weight.png',
      pos: '/images/pos.png',
      tec: '/images/tec.png',
      forward: '/images/forward.png'
    }
  },


  bindCasPickerChange: function (e) {
    var userInfo = this.data.userInfo
    userInfo.height = this.data.casArray[e.detail.value].replace('cm', '')
    this.setData({ userInfo })
    this.setData({ casIndex: e.detail.value })
  },
  bindWeightPickerChange (e){
    var userInfo = this.data.userInfo
    userInfo.weight = this.data.weight[e.detail.value].replace('kg', '')
    this.setData({ userInfo })    
    this.setData({ weightIndex: e.detail.value })
  },
  onLoad: function (e) {
    let time = new Date()
    time = formatTime.formatTime(time).replace(/\//g, '-').substring(0,10)
    this.setData({ nowData: time })
    var that = this
    var wid = $.wid
    this.fileNumber(150, 221, 'casArray','cm') // 设置身高
    this.fileNumber(35, 131, 'weight','kg') // 设置身高
    that.setData({userId: e.uid})
    // 个人信息
    wx.request({
      url: $.api + 'user/queryUser',
      data: { unionid: wid },
      header: { "Content-Type": "application/x-www-form-urlencoded" },
      method: 'POST',
      success: function (res) {
        if (res.data.code == 2000) {
          var obj = {}
          obj.name = res.data.obj.nickname
          obj.header = res.data.obj.imgurl
          obj.height = res.data.obj.height
          obj.weight = res.data.obj.weight
          obj.startGoalYear = res.data.obj.startGoalYear
          obj.sex = res.data.obj.sex
          obj.birTime = res.data.obj.birTime
          obj.year = res.data.obj.authLevel
          var pos1 = res.data.obj.teamLocation1
          var pos2 = res.data.obj.teamLocation2
          var specialTech1 = res.data.obj.specialTech1
          var specialTech2 = res.data.obj.specialTech2         
          var posList = that.data.positionList
          var props = that.data.props
          posList.forEach(val => {
            if (val.name == pos1 || val.name == pos2) {
              val.sel = 1
            }
          })
          props.forEach(val => {
            if (val.title == specialTech1 || val.title == specialTech2) {
              val.sel = 1
            }
          })
          if (!that.defaltcasArray(`${obj.height}cm`)){
            obj.height=150
          }
          if (!that.defaltweightArray(`${obj.weight}kg`)){
            obj.weight=35
          }
          that.setData({userInfo: obj, positionList: posList, props: props})
        }
      },
    })
  },
  defaltcasArray(value){
    if (this.data.casArray.indexOf(value)>-1){
      let index = this.data.casArray.indexOf(value)
      this.setData({ casIndex: index })
    }else{
      return false
    }
  },
  defaltweightArray (value) {
    if (this.data.weight.indexOf(value) > -1) {
      let index = this.data.weight.indexOf(value)
      this.setData({ weightIndex: index })
    }else{
      return false
    }
  },
  fileNumber(small,big,name,unit){
    let data = []
    for (let index = small; index < big; index++) {
      data.push(`${index}${unit}`)
    }
    if (name =='casArray'){
      this.setData({ casArray: data })
    }else{
      this.setData({ weight: data })
    }
  },
  onShow: function () {
    var that = this
    try {
      let avatar = wx.getStorageSync('Cutting')
      if (avatar) {
        var userInfo = that.data.userInfo
        userInfo.header = avatar
        that.setData({ userInfo, headerFile: avatar})
        wx.removeStorageSync('Cutting')
      }
    } catch (e) { }
  },
  // 设置头像
  setHeader: function () {
    var that = this
    wx.chooseImage({
      count: 1,
      success: function(res) {
        // var userInfo = that.data.userInfo
        // userInfo.header = res.tempFilePaths[0]
        // that.setData({userInfo, headerFile: res.tempFiles[0]})
        const src = res.tempFilePaths[0]
        wx.navigateTo({
          url: `../upload/upload?src=${src}`
        })
      },
    })
  },
  // 选择性别
  setSex: function (e) {
    var obj = this.data.userInfo
    console.log(obj)
    obj.sex = e.currentTarget.dataset.sex
    this.setData({userInfo: obj})
  },
  setBrithday: function (e) {
    var obj = this.data.userInfo
    obj.birTime = e.detail.value
    this.setData({userInfo: obj})
  },
  // 多选
  setMultiple: function (e) {
    var that = this
    var ind = e.currentTarget.dataset.ind
    var i = e.currentTarget.dataset.index 
    // 多选位置
    if (ind == 1) {
      var positionList = that.data.positionList
      if (positionList[i].sel == 1) {
        positionList[i].sel = 0
        that.setData({positionList})
      } else {
        var len = 0
        positionList.forEach((val, order) => {
          if (val.sel == 1) {
            len++
          }
        })
        if (len == 2) {
          wx.showToast({
            title: '最多两个位置',
            icon: 'none'
          })
        } else {
          positionList[i].sel = 1
          that.setData({positionList})
        }
      }
    } else {
      var props = that.data.props
      if (props[i].sel == 1) {
        props[i].sel = 0
        that.setData({props})
      } else {
        var len = 0
        props.forEach(val => {
          if (val.sel == 1) {
            len++
          } 
        })
        if (len == 2) {
          wx.showToast({
            title: '最多两个特点',
            image: '/images/err.png'
          })
        } else {
          props[i].sel = 1
          that.setData({ props })
        }
      }
    }
  },
  getInput: function (e) {
    var that = this
    var userInfo = that.data.userInfo
    // console.log(e.currentTarget.dataset.index)
    switch (e.currentTarget.dataset.index) {
      case '0': 
        console.log(123)
        userInfo.weight = e.detail.value
        that.setData({ userInfo })        
      break
      case '1':
        userInfo.startGoalYear = e.detail.value
        that.setData({ userInfo })        
      break
      case '2':
        userInfo.name = e.detail.value
        that.setData({ userInfo })        
      break
      case '3':
        userInfo.height = e.detail.value
        that.setData({ userInfo })
      break        
    }
  },
  subData: function () {
    var that = this
    var posList = that.data.positionList
    var props = that.data.props
    var sw = 0
    if(this.data.birTime == ''){
      wx.showToast({
        title: '请选择出生年月',
        icon: 'none'
      })
      return 
    }
    // 判断位置
    var posArr = [], propsArr = [], teamLocation1 = '', teamLocation2 = '', specialTech1 = '', specialTech2 = ''
    posList.forEach(val => {
      console.log(val)
      if (val.sel == 1) {
        posArr.push(val.name)
      }
    })
    if (that.data.userInfo.name.trim()==''){
      wx.showToast({
        title: '请填写昵称',
        icon: 'none'
      })
      return 
    }
    if (posArr.length == 2) {
      teamLocation1 = posArr[0]
      teamLocation2 = posArr[1]
      sw++
    } else if (posArr.length == 1){
      teamLocation1 = posArr[0] 
      teamLocation2 = ''
      sw++         
    } else {
      wx.showToast({
        title: '至少一个位置',
        icon: 'none'
      })      
    }
    // 获取特点
    props.forEach(val => {
      if (val.sel == 1) {
        propsArr.push(val.title)
      }
    })
    console.log(propsArr)
    if (propsArr.length == 2) {
      specialTech1 = propsArr[0]
      specialTech2 = propsArr[1]
      sw++
    } else if (propsArr.length == 1) {
      specialTech1 = propsArr[0]
      specialTech2 = ''
      sw++
    } else {
      wx.showToast({
        title: '至少一个特点',
        icon: 'none'
      })
    }
    if (sw == 2) {
      console.log(sw)
      console.log(teamLocation1)
      console.log(that.data.userInfo.header)
      if (that.data.userInfo.name != '') {
        if (that.data.headerFile) {
          wx.uploadFile({
            url: $.api + 'user/updateUser',
            filePath: that.data.userInfo.header,
            name: 'imgurl',
            formData: {
              userid: that.data.userId,
              nickname: that.data.userInfo.name,
              startgoalyear: that.data.userInfo.startGoalYear,
              sex: that.data.userInfo.sex,
              birtime: that.data.userInfo.birTime,
              height: that.data.userInfo.height,
              weight: that.data.userInfo.weight,
              teamlocation1: teamLocation1,
              teamlocation2: teamLocation2,
              specialtech1: specialTech1,
              specialtech2: specialTech2
            },
            success: function (res) {
              wx.showToast({
                title: '修改成功',
              }),
              setTimeout(() => {
                wx.switchTab({
                  url: '/pages/mine/mine',
                })
              }, 1000);
            }
          })
        } else {
          wx.request({
            url: $.api + 'user/updateUser',
            data: {
              imgurl: '',
              userid: that.data.userId,
              nickname: that.data.userInfo.name,
              startgoalyear: that.data.userInfo.startGoalYear,
              sex: that.data.userInfo.sex,
              birtime: that.data.userInfo.birTime,
              height: that.data.userInfo.height,
              weight: that.data.userInfo.weight,
              teamlocation1: teamLocation1,
              teamlocation2: teamLocation2,
              specialtech1: specialTech1,
              specialtech2: specialTech2
            },
            header: { "Content-Type": "application/x-www-form-urlencoded" },
            method: 'POST',
            success: function (res) {
              let { code, message} = res.data
              if (code == 3000) {
                wx.showToast({
                  title: '修改成功',
                })
                setTimeout(() => {
                  wx.switchTab({
                    url: '/pages/mine/mine',
                  })
                }, 1000);
              }else{
                wx.showToast({
                  title: message,
                })
              }
            },
          })
        }
      } else {
        wx.showToast({
          title: '请填写昵称',
          icon: 'none'
        })
      }
    }
  }
})