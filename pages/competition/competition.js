// pages/competition/competition.js
const $ = getApp().globalData
Page({
  data: {
    // 杯赛
    cupList: [
      {
        title: '排位赛 （1-2）',
        teams: [
          { name: '青岛中青英联', ishost: 0, logo: '/images/logo.png' },
          { name: '大连龙卷风', ishost: 1, logo: '/images/logo.png' },
        ],
        result: '1-0'
      }, {
        title: '排位赛 （1-2）',
        teams: [
          { name: '青岛中青英联', ishost: 0, logo: '/images/logo.png' },
          { name: '大连龙卷风', ishost: 1, logo: '/images/logo.png' },
        ],
        result: '1-0'
      },
      {
        title: '排位赛 （1-2）',
        teams: [
          { name: '青岛中青英联', ishost: 0, logo: '/images/logo.png' },
          { name: '大连龙卷风', ishost: 1, logo: '/images/logo.png' },
        ],
        result: '1-0'
      },
      {
        title: '排位赛 （1-2）',
        teams: [
          { name: '青岛中青英联', ishost: 0, logo: '/images/logo.png' },
          { name: '大连龙卷风', ishost: 1, logo: '/images/logo.png' },
        ],
        result: '1-0'
      },
      {
        title: '排位赛 （1-2）',
        teams: [
          { name: '青岛中青英联', ishost: 0, logo: '/images/logo.png' },
          { name: '大连龙卷风', ishost: 1, logo: '/images/logo.png' },
        ],
        result: '1-0'
      }
    ],
    // 联赛
    groupList: [
      {
        group: 'C',
        teams: [
          { name: '青岛中青英联花队', times: '3', win: '3', lose: '2', pointwin: '1', pointlose: '3', getPoint: 8, lostPoint: 0, sum: 8, point: 8 },
          { name: '青岛中青英联花队', times: '3', win: '3', lose: '2', pointwin: '1', pointlose: '3', getPoint: 8, lostPoint: 0, sum: 8, point: 8 },
          { name: '青岛中青英联花队', times: '3', win: '3', lose: '2', pointwin: '1', pointlose: '3', getPoint: 8, lostPoint: 0, sum: 8, point: 8 },
          { name: '青岛中青英联花队', times: '3', win: '3', lose: '2', pointwin: '1', pointlose: '3', getPoint: 8, lostPoint: 0, sum: 8, point: 8 },
        ]
      },
      {
        group: 'D',
        teams: [
          { name: '青岛中青英联花队', times: '3', win: '3', lose: '2', pointwin: '1', pointlose: '3', getPoint: 8, lostPoint: 0, sum: 8, point: 8 },
          { name: '青岛中青英联花队', times: '3', win: '3', lose: '2', pointwin: '1', pointlose: '3', getPoint: 8, lostPoint: 0, sum: 8, point: 8 },
          { name: '青岛中青英联花队', times: '3', win: '3', lose: '2', pointwin: '1', pointlose: '3', getPoint: 8, lostPoint: 0, sum: 8, point: 8 },
          { name: '青岛中青英联花队', times: '3', win: '3', lose: '2', pointwin: '1', pointlose: '3', getPoint: 8, lostPoint: 0, sum: 8, point: 8 },
        ]
      },
      {
        group: 'E',
        teams: [
          { name: '青岛中青英联花队', times: '3', win: '3', lose: '2', pointwin: '1', pointlose: '3', getPoint: 8, lostPoint: 0, sum: 8, point: 8 },
          { name: '青岛中青英联花队', times: '3', win: '3', lose: '2', pointwin: '1', pointlose: '3', getPoint: 8, lostPoint: 0, sum: 8, point: 8 },
          { name: '青岛中青英联花队', times: '3', win: '3', lose: '2', pointwin: '1', pointlose: '3', getPoint: 8, lostPoint: 0, sum: 8, point: 8 },
          { name: '青岛中青英联花队', times: '3', win: '3', lose: '2', pointwin: '1', pointlose: '3', getPoint: 8, lostPoint: 0, sum: 8, point: 8 },
        ]
      },
      {
        group: 'F',
        teams: [
          { name: '青岛中青英联花队', times: '3', win: '3', lose: '2', pointwin: '1', pointlose: '3', getPoint: 8, lostPoint: 0, sum: 8, point: 8 },
          { name: '青岛中青英联花队', times: '3', win: '3', lose: '2', pointwin: '1', pointlose: '3', getPoint: 8, lostPoint: 0, sum: 8, point: 8 },
          { name: '青岛中青英联花队', times: '3', win: '3', lose: '2', pointwin: '1', pointlose: '3', getPoint: 8, lostPoint: 0, sum: 8, point: 8 },
          { name: '青岛中青英联花队', times: '3', win: '3', lose: '2', pointwin: '1', pointlose: '3', getPoint: 8, lostPoint: 0, sum: 8, point: 8 },
        ]
      },
      {
        group: 'G',
        teams: [
          { name: '青岛中青英联花队', times: '3', win: '3', lose: '2', pointwin: '1', pointlose: '3', getPoint: 8, lostPoint: 0, sum: 8, point: 8 },
          { name: '青岛中青英联花队', times: '3', win: '3', lose: '2', pointwin: '1', pointlose: '3', getPoint: 8, lostPoint: 0, sum: 8, point: 8 },
          { name: '青岛中青英联花队', times: '3', win: '3', lose: '2', pointwin: '1', pointlose: '3', getPoint: 8, lostPoint: 0, sum: 8, point: 8 },
          { name: '青岛中青英联花队', times: '3', win: '3', lose: '2', pointwin: '1', pointlose: '3', getPoint: 8, lostPoint: 0, sum: 8, point: 8 },
        ]
      }
    ],
    img: {
      position: '/images/position-big@2x.png',
      slidedown: '/images/slidedown@2x.png',
      search: '/images/search@3x.png',
      location: '/images/position-small@3x.png'
    },
    tabSel: 0,
    // 积分赛表格title
    tableTitle: ['排名', '球队', '场次', '胜/平/负', '进/失', '净胜', '积分'],
    checkLine: [
      { title: '即将直播', color: '#FA6D6C'},
      { title: '直播回放', color: '#62B623'},
      { title: '正在直播', color:'#7BBCFC'}
    ],
    // 导航栏目
    nav: ['赛程', '积分榜', '射手榜', '球队'],
    // 射手榜title
    shooterTitle: ['排名', '球员', '球队', '进球数'],
    competition: { 
      logo: '/images/logo.png',
      title: '如果你无法简洁的表达你的想法那只能说明你还不够了解它', 
      position: '内蒙古 呼和浩特', 
      id: 123, 
      status: '1',
    }, 
    loading:false,
    showSuspension:false,
    message:''
  },
  onLoad: function (e) {
    var that = this
    if (e.share) {
      this.setData({ share: e.share })
    }
    if (e.state) {
      this.setData({ state: e.state })
    }
    that.setData({ comId: e.id})
    // 获取赛事的基本信息
    if (e.id) {
      wx.showLoading({
        title: '加载中',
      })
      wx.request({
        url: $.api + 'league/findLeagueDetails',
        method: 'POST',
        header: { "Content-Type": "application/x-www-form-urlencoded" },
        data: { leagueId: e.id},
        success: function (res) {
          if (res.data.code == 1023 && res.data.rows) {
            res.data.rows.leagueIoc = 'http://img.haoq360.com' + res.data.rows.leagueIoc
            that.setData({ competition: res.data.rows})
          }else{
            that.setData({ competition: {}, message: res.data.message})
          }
        }
      })
      // 获取赛程信息
      wx.request({
        url: $.api + 'league/findSchedules',
        method: 'POST',
        header: { "Content-Type": "application/x-www-form-urlencoded" },
        data: { leagueId: e.id, flag: 2 },
        success: function (res) {
          wx.hideLoading()
          if (res.data.code == 1033) {
            res.data.rows.forEach((val) => {
              val.date = Object.keys(val)[0]
            })
            that.setData({ dayList: res.data.rows})
          } else {
            that.setData({ dayList: [], message: res.data.message })
          }
        }
      })      
    }
  },
  toJoin(){
    wx.showToast({
      title: '请下载Hao球APP报名赛事',
      icon: 'none',
      duration: 2000
    })
  },
  toggetshowSuspension(){
    this.setData({showSuspension:!this.data.showSuspension})
  },
  changeTab: function (e) {
    this.setData({tabSel: e.currentTarget.dataset.index})
    var that = this
    
    // 积分榜
    if (e.currentTarget.dataset.index == 1 && !this.data.point) {
      wx.showLoading({
        title: '加载中',
      })
      wx.request({
        url: $.api + 'league/findLeagueScores',
        method: 'POST',
        header: { "Content-Type": "application/x-www-form-urlencoded" },
        data: { leagueId: that.data.comId},
        success: function (res) {
          if (res.data.code == 1021) {
            that.setData({point: res.data.rows})
            wx.hideLoading()
          }
        }
      })
    } else if (e.currentTarget.dataset.index == 2 && !this.data.shooter) {
      wx.showLoading({
        title: '加载中',
      })
      var shooterPage = 1
      wx.request({
        url: $.api + 'league/findTopCcorer',
        method: 'POST',
        header: { "Content-Type": "application/x-www-form-urlencoded" },
        data: { leagueId: that.data.comId,page: shooterPage},
        success: function(res) {
          if (res.data.code == 1039) {
            shooterPage++
            that.setData({shooter:res.data.rows, shooterPage})
            wx.hideLoading()
          } else {
            that.setData({ shooter: [] })
          }
        },
      })
    } else if (e.currentTarget.dataset.index == 3 && !this.data.teamList) {
      wx.showLoading({
        title: '加载中',
      })
      wx.request({
        url: $.api + 'league/findLeagueCreateTeam',
        data: { leagueId: that.data.comId},
        method: 'POST',
        header: { "Content-Type": "application/x-www-form-urlencoded" },
        success: function(res) {
          if (res.data.code == 1029) {
            that.setData({teamList: res.data.rows})
            wx.hideLoading()
          } else {
            that.setData({ teamList: []})
          }
        }
      })
    } else if (e.currentTarget.dataset.index == 0){
      wx.hideLoading()
    }
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
  getMorePage (flag, date,refresh){
    wx.showLoading({
      title: '加载中',
    })
    wx.request({
      url: $.api + 'league/findSchedules',
      method: 'POST',
      header: { "Content-Type": "application/x-www-form-urlencoded" },
      data: { leagueId: this.data.comId, flag, date  },
      success:  (res)=> {
        wx.hideLoading()
        if (refresh){
          wx.stopPullDownRefresh()
        }
        if (res.data.code == 1033 && res.data.rows) {
          res.data.rows.forEach((val) => {
            val.date = Object.keys(val)[0]
          })
          let dayList = this.data.dayList
          if (refresh){
            let datas = res.data.rows.reverse()
            dayList = [...datas, ...dayList]
          }else{
            dayList =  [...dayList, ...res.data.rows]
          }
          this.setData({ dayList: dayList,loading:false })
        }
      }
    })  
  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    if (this.data.tabSel=='0'&&this.data.dayList.length){
      let index = this.data.dayList.length-1
      this.getMorePage(1, this.data.dayList[0].date,'refresh')
    }else{
      wx.stopPullDownRefresh()
    }
  },
  toase(){
    wx.showToast({
      title: '下载Hao球APP查看更多',
      icon: 'none',
      duration: 2000
    })
  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom () {
    if (this.loading){
      return
    }
    this.loading = true
    if (this.data.tabSel == '0' && this.data.dayList.length>10) {
      this.getMorePage(3, this.data.dayList[index].date)
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    var that = this
    return {
      title:that.data.competition.name,
      path: '/pages/competition/competition?id=' + that.data.comId + "&share=1"
    }
  }
})