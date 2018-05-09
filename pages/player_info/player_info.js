const $ = getApp().globalData
Page({

  /**
   * 页面的初始数据
   */
  data: {
    img: {
      position: '/images/position-big@2x.png',
      slidedown: '/images/slidedown@2x.png',
      search: '/images/search@3x.png',
      location: '/images/position-small@3x.png',
      player: '/images/player@3x.png'
    },
    state: [
      { title: '报名中', color: '#FA6D6C' },
      { title: '比赛中', color: '#62B623' },
      { title: '已结束', color: '#7BBCFC' }
    ],
    showSuspension: false,
    isme:false
  },
  toggetshowSuspension () {
    this.setData({ showSuspension: !this.data.showSuspension })
  },
  onLoad: function (e) {
    if (e.uid) {
      var uid = e.uid
      if (e.uid == $.uid){
        this.setData({ isme: true })
      }
      this.setData({ uid: e.uid })
    } else {
      var uid = $.uid
      this.setData({ uid: $.uid })
    }
    var that = this
    
    e.isManager ? this.setData({ isManager: e.isManager }) : this.setData({ isManager: 0 })
    e.state ? this.setData({urlState: e.state}) : this.setData({urlState: 0})
    e.intro ? this.setData({intro: e.intro}):this.setData({intro: -1})
    e.tid ? this.setData({tid:e.tid}) : this.setData({tid: -1})
    // 个人信息
    wx.request({
      url: 'https://xapi.haoq360.com/index.php/api/user/getPersonDetail',
      data: { userid: uid },
      header: { "Content-Type": "application/x-www-form-urlencoded" },
      method: 'POST',
      success: function (res) {
        console.log(res)
        if (res.data.code == 1021) {
          that.setData({ userInfo: res.data.rows.info })
          if (res.data.rows.teamList.length == 0) {
            that.setData({ noTeam: 1 })
          } else {
            that.setData({ team: res.data.rows.teamList })
          }

          if (res.data.rows.leagueList.length == 0) {
            that.setData({ noLeague: 1 })
          } else {
            that.setData({ competition: res.data.rows.leagueList })
          }

        }
      },
    })
  },
  /**
 * 用户点击右上角分享
 */
  onShareAppMessage: function () {
    var that = this
    return {
      path: '/pages/player_info/player_info?uid=' + that.data.uid
    }
  },
  toDetail: function (e) {
    var order = e.currentTarget.dataset.order
    var i = e.currentTarget.dataset.index
    order == 1 ? wx.navigateTo({
      url: '/pages/competition/competition?id=' + e.currentTarget.dataset.id,
    }) : wx.navigateTo({
      url: '/pages/team_detail/team_detail?id=' + e.currentTarget.dataset.id,
    })
  },
  check: function (e) {
    let that = this
    let formid = e.detail.formId
    var showTitle = ''
    e.currentTarget.dataset.yn == 0 ? showTitle = '拒绝' + that.data.userInfo.nickname + '入队' : showTitle = '将' + that.data.userInfo.nickname + '加入球队'
    wx.showModal({
      title: showTitle,
      success: function (res) {
          if (res.confirm) {
          wx.request({
            url: $.api + 'team/updateCreateTeamApply',
            data: { 
              userid: that.data.uid, 
              crteid: that.data.tid, 
              applyid: $.uid,
              opinion: e.currentTarget.dataset.yn,
              formid
            },
            header: { "Content-Type": "application/x-www-form-urlencoded" },
            method: 'POST',
            success: function (res) {
              let { code, message} = res.data
              wx.showToast({
                title: message,
              })
              if (code == 1017) {
               wx.setStorageSync( "admin","1" )
                wx.navigateBack({
                  delta: 1
                })
              }
            },
          })
        }
      }
    })
  },
  clear: function (e) {
    let type = e.currentTarget.dataset.type
    let that =this
    let formid = e.detail.formId
    wx.showModal({
      title: '将' + that.data.userInfo.nickname + '移出球队',
      success: function (res) {
        if (res.confirm) {
          wx.request({
            url: $.api + 'team/sighOut',
            data: { userid: that.data.uid, crteid: that.data.tid,formid },
            header: { "Content-Type": "application/x-www-form-urlencoded" },
            method: 'POST',
            success: function (res) {
              let { code, message } = res.data
              wx.showToast({
                title: message,
              })
              if (code == 1015) {
                if (type=='1'){
                  wx.navigateBack({
                    delta: 2
                  })
                }else{
                 wx.setStorageSync( "admin","1" )
                  wx.navigateBack({
                    delta: 1
                  })
                }
              }
            },
          })  
        }
      }
    })
  },
  toMover(e){
    let formid = e.detail.formId
    wx.showModal({
      title: '将领队移交给' + this.data.userInfo.nickname ,
      success:  (res) =>{
        if (res.confirm) {
          wx.request({
            url: $.api + 'team/addIdentity',
            data: { userid: this.data.uid, crteid: this.data.tid, myuserid: $.uid,formid },
            header: { "Content-Type": "application/x-www-form-urlencoded" },
            method: 'POST',
            success: function (res) {
              let { code, message } = res.data
              wx.showToast({
                title: message,
              })
              if (code == 1015) {
               wx.setStorageSync( "admin","1" )
                wx.navigateBack({
                  delta: 1
                })
              }
            },
          })
        }
      }
    })
  }
})
