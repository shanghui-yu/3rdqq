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
    
    tabSel: 1
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
    console.log($, 546);
    
    console.log(wid);
    that.setData({ uid })
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
            this.setData({ noTeam: 1 })
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
    if (!$.phone){
      wx.navigateTo({
        url: '/pages/login/login',
      })
      return
    }
    var that = this
    var wid = $.wid
    // 个人信息
    wx.request({
      url: 'https://xapi.haoq360.com/index.php/api/user/queryUser',
      data: { unionid: wid },
      header: { "Content-Type": "application/x-www-form-urlencoded" },
      method: 'POST',
      // dataType: 'json',
      // responseType: 'text',
      success: function (res) {
        console.log(res)
        if (res.data.code == 2000) {
          var obj = {}
          obj.name = res.data.obj.nickname
          obj.header = res.data.obj.imgurl
          that.setData({ userInfo: obj })
          $.userInfo_3rd = res.data.obj
          // 参加球队
          wx.request({
            url: $.api + 'user/findWoCreateTeam',
            data: { userid: res.data.obj.userid, page: 1 },
            header: { "Content-Type": "application/x-www-form-urlencoded" },
            method: 'POST',
            success: function (res1) {
              console.log(res1)
              if (res1.data.code == 1021) {
                if (res1.data.rows.length == 0) {
                  that.setData({ noTeam: 1 })
                } else {
                  that.setData({ team: res1.data.rows })
                }
              }
            },
          })
          // 参加联赛
          wx.request({
            url: $.api + 'user/findMyLeague',
            data: { userid: res.data.obj.userid },
            header: { "Content-Type": "application/x-www-form-urlencoded" },
            method: 'POST',
            success: function (res1) {
              console.log(res1)
              if (res1.data.code == 1021) {
                if (res.data.rows == 0) {
                  that.setData({ noMatch: 1 })
                } else {
                  that.setData({ competition: res1.data.rows })
                }
              }
            },
          })
        }
      },
    })
  },
  tabChange: function (e) {
    console.log(e.currentTarget.dataset.index);
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
    var that = this;
    var i = e.currentTarget.dataset.index
    console.log(e.currentTarget)
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
    // console.log(123)
    wx.stopPullDownRefresh()
  }
})