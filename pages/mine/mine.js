// pages/mine/mine.js
const $ = getApp().globalData
Page({

  /**
   * 页面的初始数据
   */
  data: {
    img: {
      location: '/images/position-small@3x.png',
      player: '/images/player@3x.png'
    },
    state: [
      { title: '报名中', color: '#FA6D6C' },
      { title: '比赛中', color: '#62B623' },
      { title: '已结束', color: '#7BBCFC' }
    ],
    // userInfo: {
    //   header: '/images/logo.png',
    //   name: '用户名'
    // },
    nav: [
      { icon: '/images/myIndex@3x.png', title: '我的主页' },
      { icon: '/images/myData@3x.png', title: '我的资料' },
      { icon: '/images/authentication@3x.png', title: '实名认证' },
      { icon: '/images/message@3x.png', title: '我的消息' },
    ],
    
    tabSel: 1,
    showUser:false,
    authorize:true
  },
  onLoad: function (option) {
    try {
      let tabSel = wx.getStorageSync('tabSel')
      if (tabSel){
        this.setData({ tabSel })
        wx.removeStorageSync('tabSel')
      }
    } catch (error) {
    }
    var that = this
    var wid = $.wid
    var uid = $.uid
    this.checkUser()
    if (uid) {
      that.setData({ uid })
    }
    // 个人信息
    wx.request({
      url: 'https://xapi.haoq360.com/index.php/api/user/queryUser',
      data: { unionid: wid },
      header: { "Content-Type": "application/x-www-form-urlencoded" },
      method: 'POST',
      success: function (res) {
        if (res.data.code == 2000) {
          var obj = {}
          obj.name = res.data.obj.nickname
          obj.header = res.data.obj.imgurl
          that.setData({ userInfo: obj })
          $.userInfo_3rd = res.data.obj
          // 参加球队
          that.getMyteam()
          // 参加联赛
          that.getMyLeague()
        }
      },
    })
  },
  getMyteam(){
    wx.request({
      url: $.api + 'user/findWoCreateTeam',
      data: { userid: this.data.uid, page: 1 },
      header: { "Content-Type": "application/x-www-form-urlencoded" },
      method: 'POST',
      success: (res1)=> {
        if (res1.data.code == 1021) {
          if (res1.data.rows.length == 0) {
            this.setData({ noTeam: 1,team:[] })
          } else {
            this.setData({ team: res1.data.rows })
          }
        }
      },
    })
  },
  getMyLeague(){
    wx.request({
      url: $.api + 'user/findMyLeague',
      data: { userid: this.data.uid },
      header: { "Content-Type": "application/x-www-form-urlencoded" },
      method: 'POST',
      success:  (res1)=> {
        if (res1.data.code == 1021) {
          if (res1.data.rows == 0) {
            this.setData({ noMatch: 1, competition:[]})
          } else {
            this.setData({ competition: res1.data.rows })
          }
        }
      },
    })
  },
  onShow: function () {
    this.checkUser()
    var that = this
    var wid = $.wid
    // 个人信息
    wx.request({
      url: 'https://xapi.haoq360.com/index.php/api/user/queryUser',
      data: { unionid: wid },
      header: { "Content-Type": "application/x-www-form-urlencoded" },
      method: 'POST',
      success: function (res) {
        if (res.data.code == 2000) {
          var obj = {}
          obj.name = res.data.obj.nickname
          obj.header = res.data.obj.imgurl
          that.setData({ userInfo: obj })
          $.userInfo_3rd = res.data.obj
           // 参加球队
           that.getMyteam()
           // 参加联赛
           that.getMyLeague()
        }
      },
    })
  },
  checkUser() {
    wx.getSetting({
      success: (res) => {
        if (!res.authSetting['scope.userInfo']) {
          wx.checkSession({
            success:(res)=>{
              this.setData({ showUser: true,authorize:false })
            }
          })
        }
      }
    })
  },
  setUid(o){
    let sessionKey = wx.getStorageSync('sessionKey')
    wx.request({
      url: 'https://xapi.haoq360.com/index.php/api/user/Decrypt',
      data: { sessionKey, encryptedData: o.encryptedData, iv:o.iv},
      header: { "Content-Type": "application/x-www-form-urlencoded" },
      method: 'POST',
      success: (res3)=> {
        if (res3.data.code == 2000) {
          if (res3.data.obj.phone){
            $.phone = res3.data.obj.phone
          }else{
            wx.navigateTo({
              url: '/pages/login/login',
            })
          }
          $.uid = res3.data.obj.userid
          $.wid = res3.data.obj.weixinId
          this.onLoad()
        }
      },
    })
  },
  userinfo: function (res){
    if (res.detail.userInfo) {
      this.setData({ showUser: false })
      this.setUid(res.detail)
    } else {
      this.setData({ showUser: true })
    }
  },
  clicks(e){
    this.setData({ showUser: !this.data.showUser })
    if(e.currentTarget.dataset=='0'&& !this.data.authorize){
      wx.switchTab({
        url: '/pages/index/index'
      })
    }
  },
  tabChange: function (e) {
    if (e.currentTarget.dataset.index=='1'){
      this.getMyLeague()
    }else{
      this.getMyteam()
    }
    this.setData({ tabSel: Number(e.currentTarget.dataset.index) })

  },
  createCompetition: function () {
    wx.navigateTo({
      url: '/pages/create_competition/create_competition',
    })
  },
  toEdit: function (e) {
    if(!$.phone){
      wx.navigateTo({
        url: '/pages/login/login',
      })
      return
    }
    var that = this;
    var i = e.currentTarget.dataset.index
    switch (i) {
      case 0:
        wx.navigateTo({
          url: '/pages/player_info/player_info?uid=' + $.userInfo_3rd.userid,
        })
        break;
      case 1:
        wx.navigateTo({
          url: '/pages/my_info/my_info?uid=' + $.userInfo_3rd.userid
        })
        break;
      case 2:
        wx.navigateTo({
          url: '/pages/authentication/authentication',
        })
        break;
      case 3:
        wx.navigateTo({
          url: '/pages/message/message',
        })
    }
  },
  toDetail: function (e) {
    if (e.currentTarget.dataset.card != 1) {
      wx.navigateTo({
        url: '/pages/team_detail/team_detail?id=' + e.currentTarget.dataset.id,
      })
    }else{
      if (e.currentTarget.dataset.isson) {
        console.log(e.currentTarget.dataset.parentid);
        
        wx.navigateTo({
          url: '/pages/team_son/team_son?id=' + e.currentTarget.dataset.parentid + '&state=' + e.currentTarget.dataset.state,
        })
      } else {
        wx.navigateTo({
          url: '/pages/competition/competition?id=' + e.currentTarget.dataset.id + '&state=' + e.currentTarget.dataset.state,
        })
      }
    }
    // e.currentTarget.dataset.card != 1 ? wx.navigateTo({
    //   url: '/pages/team_detail/team_detail?id=' + e.currentTarget.dataset.id,
    // }) : wx.navigateTo({
    //   url: '/pages/competition/competition?id=' + e.currentTarget.dataset.id,
    // })
  },
  getTeam: function (e) {
    if(!$.phone){
      wx.navigateTo({
        url: '/pages/login/login',
      })
      return
    }
    switch (e.currentTarget.dataset.index) {
      case '1':
        wx.switchTab({
          url: '/pages/team/team',
        })
        break;
      case '2':
        wx.navigateTo({
          url: '/pages/create_team/create_team',
        })
        break;
      case '3':
        wx.switchTab({
          url: '/pages/index/index',
        })
        break;
      case'4':
        wx.navigateTo({
          url: '/pages/create_competition/create_competition',
        })
        break;
    }
  },
  onPullDownRefresh: function () {
    wx.stopPullDownRefresh()
  }
})