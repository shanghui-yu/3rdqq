const $ = getApp().globalData
import initAreaPicker, { getSelectedAreaData } from '../../template/index';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isSubmit: 0,
    img: {
      banner: '/images/banner_post.png',
      forward: '/images/forward.png',
      success: '/images/success@3x.png',
      location: '/images/position-small@3x.png'
    },
    slogan: ['报名审核', '赛程管理', '直播管理', '赛事资讯', '运动意外险', '运动意外险', '……','等更多内容可pc端登陆'],
    provinceName: '请点击选择所在位置',
    cityName: '',
    selType: '请选择比赛类型',
    selNum: '请选择赛制',
    competitionType: ['联赛', '杯赛', '排位赛', '淘汰赛'], 
    numType: [3,4,5,6,7,8,9,10,11],
    fullName: '',
    comName: '',
    competition: {
      logo: '',
      startSign: '起始时间',
      endSign: '结束时间',
      startMatch: '起始时间',
      endMatch: '结束时间'
    },
    getLogo: 0,
    hasLive: false,
    hasAuthen: false,
    lock:false,
    showArea:true // 是否显示地区选择
  },
  onLoad: function (options) {
    var that = this 
    this.setData({ wh: wx.getSystemInfoSync().windowHeight+'px'})
  },
  onShow:function(){
    var that = this 
    initAreaPicker({
      hideDistrict: true, // 是否隐藏区县选择栏，默认显示
    });
    try {
      let avatar = wx.getStorageSync('Cutting')
      if (avatar) {
        var com = that.data.competition
        com.logo = avatar
        com.file = avatar
        that.setData({competition: com,getLogo: 1})
        wx.removeStorageSync('Cutting')
      }
    } catch (e) { }
  },
  getFullName: function (e) {
    this.setData({fullName: e.detail.value})
  },
  getName: function (e) {
    this.setData({comName: e.detail.value})
  },
  // 获取是否
  getIs: function (e) {
    var that = this
    if (e.currentTarget.dataset.order == 0) {
      that.setData({hasLive: e.detail.value})
    } else {
      that.setData({hasAuthen: e.detail.value})
    }
  }, 
  okArea:function(){
    this.setData({ showArea: true})
    this.setData({ provinceName: getSelectedAreaData()[0].fullName, cityName: getSelectedAreaData()[1].fullName })
  },
  // 所在区域
  changeLocation: function (e) {
    this.setData({ showArea: false})
    // var cityName = ''
    // e.detail.value[1] == '县' ? cityName = e.detail.value[2] : cityName = e.detail.value[1]
    // this.setData({ provinceName: e.detail.value[0], cityName: cityName})
  },
  cencal(){
    this.setData({ showArea: true })
  },
  // 提交数据
  create: function () {
    var that = this
    if (this.data.lock) {
      return
    }
    this.setData({ lock: true })
    if (that.data.fullName == '') {
      wx.showToast({
        title: '请填写赛事全称',
        image: '/images/err.png'
      })
      that.setData({ lock: false })
    } else {
      if (that.data.cityName == '') {
        wx.showToast({
          title: '请选择地区',
          image: '/images/err.png'
        })
        that.setData({ lock: false })
      } else {
        if (that.data.getLogo != 1) {
          wx.showToast({
            title: '请选择赛事Logo',
            image: '/images/err.png'
          })
          that.setData({ lock: false })
        } else {
          wx.showLoading({
            title: '创建中',
          })
          var subData = {}
          subData.referred = that.data.comName
          subData.name = that.data.fullName
          subData.provinceName = that.data.provinceName
          subData.cityName = that.data.cityName
          that.data.competition.startSign == '起始时间' ? subData.toSignUpStart = '' : subData.toSignUpStar = that.data.competition.startSign
          that.data.competition.endSign == '结束时间' ? subData.toSignUpEnd = '' : subData.toSignUpEnd = that.data.competition.endSign
          that.data.competition.startMatch == '起始时间' ? subData.eventUpTime = '' : subData.eventUpTime = that.data.competition.startMatch
          that.data.competition.endMatch == '结束时间' ? subData.eventEndTime = '' : subData.eventEndTime = that.data.competition.endMatch
          subData.userid = $.uid
          subData.fewPeopleSystem = that.data.selNum
          if (that.data.selType == '请选择赛事类型') {
            subData.species = ''
          } else {
            that.data.competitionType.forEach((val, index) => {
              if (val == that.data.selType) {
                subData.species = -(-index - 1)
              }
            })
          }
          that.data.hasLive ? subData.hasLive = 1 : subData.hasLive = 0
          that.data.hasAuthen ? subData.realName = 1 : subData.realName = 0
          console.log(subData)
          wx.uploadFile({
            url: $.api + 'league/gatherCreateLeague',
            filePath: that.data.competition.logo,
            name: 'img',
            formData: subData,
            success: function(res) {
              that.setData({ lock: false })
              wx.hideLoading()
              let ress = JSON.parse(res.data)
              if (ress.code == 1021) {
                that.setData({isSubmit: 1})
              } else {
                wx.showModal({
                  title: ress.message,
                  showCancel: false,
                  confirmColor: '#2B70F0'
                })
              }
            },
          })
        }
      }
    }
  },
  // 隐藏模态框
  hideWrap: function () {
    wx.switchTab({
      url: '/pages/mine/mine',
    })
  },
  // 获取赛事类型
  getType: function (e) {
    var tList = this.data.competitionType
    this.setData({selType: tList[e.detail.value]})
  },
  // 获取赛制
  getnumType: function (e) {
    var nList = this.data.numType
    this.setData({selNum: nList[e.detail.value]})
  },
  // 选择图片
  uploadImg: function () {
    var that = this
    wx.chooseImage({
      count: 1,
      success: function (res) {
        // var com = that.data.competition
        // com.logo = res.tempFilePaths[0]
        // com.file = res.tempFiles[0]
        // that.setData({competition: com,getLogo: 1})
        const src = res.tempFilePaths[0]

        wx.navigateTo({
          url: `../upload/upload?src=${src}`
        })
      }
    })
  },
  selectDate: function (e) {
    var that = this;
    console.log(e.currentTarget.dataset.line)
    var com = that.data.competition
    switch (Number(e.currentTarget.dataset.line)) {
      case 1:
        com.startSign = e.detail.value
      break
      case 2:
        com.endSign = e.detail.value
      break;
      case 3: 
        com.startMatch = e.detail.value
      break;
      case 4: 
        com.endMatch = e.detail.value
      break;
    }
    that.setData({competition: com})
  }
})