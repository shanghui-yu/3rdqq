// pages/competition/competition.js
import formatTime from "../../utils/util.js";
const $ = getApp().globalData
Page({
  data: {
    img: {
      position: '/images/position-big@2x.png',
      slidedown: '/images/slidedown@2x.png',
      search: '/images/search@3x.png',
      location: '/images/position-small@3x_1.png',
      num: '/images/player@3x_1.png',
      register: '/images/authentication@3x.png',
      down: '/images/down@3x.png'
    },
    tabSel: 0,
    cardSel: 0,
    // 导航栏目
    // nav: ['队员', '射手榜', '对阵表', '入队审核'],
    // 射手榜title
    shooterTitle: ['排名', '球员', '进球数'],
    player:[
      { realName: '', photoUrl:'',}
    ],
    showSuspension: false,
    confim:{
      show:false,
      title:'',
      mes:''
    },
    teamCardChange:0,
    teamCardChangetwo:false
  },
  toggetshowSuspension () {
    this.setData({ showSuspension: !this.data.showSuspension })
  },
  onLoad: function (e) {
    if (e.share){
      this.setData({ share: e.share })
    }
    this.setData({ teamId: e.id })
    this.getTeamPeople()
    // 获取球队详情
    this.getTeamDetail()
  },
  getTeamPeople(){
    wx.showLoading({
      title: '加载中',
    })
    wx.request({
      url: $.api + 'Team/getTeamPlayers',
      data: { teamId: this.data.teamId },
      header: { "Content-Type": "application/x-www-form-urlencoded" },
      method: 'POST',
      success:  (res)=> {
        if (res.data.code == 1021) {
          this.setData({ player: res.data.rows })
          wx.hideLoading()
        }else{
          this.setData({ player: [] })
        }
      },
    })
  },
  getTeamDetail(){
    wx.request({
      url: $.api + 'Team/findCreateTeamDetails',
      data: { crteid: this.data.teamId, userid: $.uid },
      header: { "Content-Type": "application/x-www-form-urlencoded" },
      method: 'POST',
      success:  (res)=> {
        if (res.data.code == 1012) {
          this.setData({ team: res.data.rows })
          if (res.data.rows.userid == '领队'|| res.data.rows.userid=='队务') {
            this.setData({ myTeam: 1, nav: ['队员', '射手榜', '对阵表', '入队审核'] })
          } else {
            this.setData({ myTeam: 0, nav: ['队员', '射手榜', '对阵表'] })
          }
        }
      },
    })
  },
  onShow(){
    try {
      var admin = wx.getStorageSync('admin')
      if (admin) {
        this.getTeamPeople()
        this.getTeamDetail()
        this.getShenqing()
        wx.removeStorageSync('admin')
      }
    } catch (error) {}
  },
  getShenqing(){
    wx.request({
      url: $.api + 'team/findCreateTeamApply',
      data: { crteid: this.data.teamId, userid: $.uid },
      header: { "Content-Type": "application/x-www-form-urlencoded" },
      method: 'POST',
      success:  (res)=> {
        if (res.data.code == 1016) {
          if (res.data.rows) {
            this.setData({ applyPlayer: res.data.rows })
          } else {
            this.setData({ noApply: 1 })
          }
        }else{
          this.setData({ applyPlayer: [] })
        }
      }
    })      
  },
  changeTab: function (e) {
    var that = this
    if (e.currentTarget.dataset.index == 1) {
      wx.request({
        url: $.api + 'Team/findGoalsList',
        data: { crteid: that.data.teamId },
        header: { "Content-Type": "application/x-www-form-urlencoded" },
        method: 'POST',
        success: function (res) {
          if (res.data.code == 1039) {
            that.setData({ shooter: res.data.rows })
          }else{
            that.setData({ shooter: [] })
          }
        },
      })
    } else if (e.currentTarget.dataset.index == 2) {
      wx.request({
        url: $.api + 'Team/findTeamScheduleNew',
        data: { crteid: that.data.teamId },
        header: { "Content-Type": "application/x-www-form-urlencoded" },
        method: 'POST',
        success: function (res) {
          if (res.data.code == 1021) {
            res.data.rows.forEach((val, index) => {
              if (index == 0) {
                val.down = 1
              } else {
                val.down = 0
              }
            })
            let datas = that.filedata(res.data.rows)
            that.setData({ year: datas })
          }else{
            that.setData({ year:[] })
          }
        },
      })
    } else if (e.currentTarget.dataset.index == 3) {
      this.getShenqing()     
    }
    this.setData({ tabSel: e.currentTarget.dataset.index })
  },
  filedata(data){
    let  weeks = ['周日','周一','周二','周三','周四','周五','周六']
    if (data&& data.length) {
      data.forEach(element => {
        element.league.forEach(element => {
          let time = new Date(element.gameDate.time)
          let weekDay = weeks[time.getDay()]
          element.times = time.toLocaleDateString() + weekDay+ element.gameTime
          element.scheTitle = element.scheTitle.substring(0, 6)
          if (element.state) {
            element.state = element.state.replace(':', '-')
          }
        });
      })
      return data
    }
  },
  slide: function (e) {
    var ind = e.currentTarget.dataset.index
    var com = this.data.com
    com[ind].down == 1 ? com[ind].down = 0 : com[ind].down = 1
    this.setData({ com })
  },
  sildeYear: function (e) {
    var ind = e.currentTarget.dataset.index
    var year = this.data.year
    year[ind].down == 1 ? year[ind].down = 0 : year[ind].down = 1
    this.setData({ year })
  },
  changeCard: function (e) {
    var card = e.currentTarget.dataset.card
    this.setData({teamCardChange:card})
    var that = this
    if (card == 0) {
      that.setData({ cardSel: 0 })
    } else {
      that.setData({ cardSel: 1 })
      if (this.data.teamCardChangetwo){
        return
      }
      wx.showLoading({
        title: '加载中',
      })
      wx.request({
        url: $.api + 'Team/getTeamUserplayers',
        data: { teamId: that.data.teamId },
        header: { "Content-Type": "application/x-www-form-urlencoded" },
        method: 'POST',
        success: function (res) {
          if (res.data.code == 1021) {
            res.data.rows.forEach(function (val, index) {
              if (index == 0) {
                val.down = 1
              } else {
                val.down = 0
              }
            })
            wx.hideLoading()
            that.setData({
              com: res.data.rows,
              teamCardChangetwo:true
            })
          }else{
            that.setData({
              com: [],
              teamCardChangetwo: true
            })
          }
        },
      })
    }
  },
  onShareAppMessage: function () {
    var that = this
    return {
      title:this.data.team.teamName,
      path: '/pages/team_detail/team_detail?id=' + that.data.teamId + "&share=1",
      success: function (res) {
      },
    }
  },
  // 看看球员详情
  check: function (e) {
    var that = this
    var id = e.currentTarget.dataset.id
    var state = ''
    if (id != $.uid && that.data.team.userid == '领队') {
      state = 1
    } else {
      state = 0
    }
    wx.navigateTo({
      url: '/pages/player_info/player_info?uid=' + e.currentTarget.dataset.id + '&state=' + state + '&intro=' + e.currentTarget.dataset.type + '&tid=' + that.data.teamId + '&isManager=' + e.currentTarget.dataset.ismanager + '&teamName=' + this.data.team.teamName,
    })
  },
  getTeam(e){
    if ($.phone) {
      let json = {
        show: true,
        title: '您将申请加入',
        mes: this.data.team.teamName
      }
      this.setData({ confim: json, formId: e.detail.formId })
    }else{
      wx.navigateTo({
        url: '/pages/login/login',
      })
    }
  },
  cencleConfim () {
    let json = this.data.confim
    json.show = false
    this.setData({ confim: json})
  },
  apply: function () {
    var that = this
    wx.request({
      url: $.api + 'team/saveCreateTeamApply',
      data: { crteid: that.data.teamId, userid: $.uid, formId: that.data.formId},
      header: { "Content-Type": "application/x-www-form-urlencoded" },
      method: 'POST',
      success: function (res) {
        let json = that.data.confim
        json.show = false
        that.setData({ confim: json })
        if (res.data.code == 1015) {
          wx.showToast({
            title: '申请成功',
          })
        } else {
          wx.showModal({
            title: res.data.message,
            showCancel: false,
            confirmColor: "#2B70F0"
          })
        }
      },
    })    
  }
})

