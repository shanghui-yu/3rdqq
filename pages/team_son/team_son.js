const $ = getApp().globalData
// pages/my_info/my_info.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    page:1,
    loading:false,
    detail:{},
    wh:'',
    state:'',
    competition:[]
  },
  onLoad (e) {
    let wh = wx.getSystemInfoSync().windowWidth / 16 * 9+'px'
    if (e.state) {
      this.setData({  state: e.state })
    }
    this.setData({ wh })
    this.getSonList(e.id)
    this.getSonDetail(e.id)
  },
  getSonDetail (leagueId){
    wx.request({
      url: $.api + 'league/getParentLeagueDetails',
      data: { leagueId},
      header: { "Content-Type": "application/x-www-form-urlencoded" },
      method: 'POST',
      success: (res) => {
        let { rows, code } = res.data
        if (code == '1021' && rows) {
          this.setData({ detail: rows })
        }
      }
    })
  },
  toJoin () {
    wx.showToast({
      title: '请下载Hao球APP报名赛事',
      icon: 'none',
      duration: 2000
    })
  },
  getSonList (leagueId){
    wx.request({
      url: $.api + 'league/findLeagueByParentLeagueId',
      data: { leagueId, page:this.data.page,rows:20},
      header: { "Content-Type": "application/x-www-form-urlencoded" },
      method: 'POST',
      success:  (res)=> {
        let { rows, code} =res.data
        if (code == '1021'){
          if (rows && rows.length){
            let competition = this.data.competition
            competition = [...competition, ...rows]
            this.setData({ competition })
            if (rows.length == 10) { //没有下一页数据关闭加载
              let nowpage = this.data.page
              nowpage = nowpage+1
              this.setData({ loading: false, page: nowpage})
            }
          }
        }
      }
    })
  },
  // 跳转详情
  toDetail(e) {
    if (e.currentTarget.dataset.isson) {
      wx.navigateTo({
        url: '/pages/team_son/team_son?id=' + e.currentTarget.dataset.id,
      })
    } else {
      wx.navigateTo({
        url: '/pages/competition/competition?id=' + e.currentTarget.dataset.id,
      })
    }
  },
  onReachBottom () {
    // if (!this.data.loading){
    //   this.setData({ loading:true })
    //   this.getSonList()
    // }
  }
})