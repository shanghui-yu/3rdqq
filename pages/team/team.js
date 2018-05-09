const $ = getApp().globalData
Page({
  data: {
    // 搜索结果长度
    resLen: 1,
    // 图片
    img: {
      position: '/images/position-big@2x.png',
      slidedown: '/images/slidedown@2x.png',
      search: '/images/search@3x.png',
      location: '/images/position-small@3x.png',
      player: '/images/player@3x.png',
      isNull: '/images/no_match@3x.png',
      close: '/images/close@3x.png'
    },
    positionDis: '',
    changeDis: 0,
    page: 2,
    loading: false, // 加载状态
    status: 0, //状态 0代表定位，1代表地区，2代表搜索
    searchKey: '', //搜索内容
    address: {},
    catchStatus:true
  },
  onLoad: function () {
    // 添加搜索开关
    var that = this
    wx.showLoading({
      title: '加载中',
    })
    this.setData({wh:wx.getSystemInfoSync().windowHeight})
    // 获取经纬度
    wx.getLocation({
      success: function (res) {
        const subData = {}
        that.setData({ lat: res.latitude, lng: res.longitude })    
        if (res) {
          // 获取当前地理位置和比赛
          wx.request({
            url: $.api + 'Team/findTeam',
            data: { lat: res.latitude, lng: res.longitude, page: 1},
            method: 'POST',
            header: { "Content-Type": "application/x-www-form-urlencoded" },
            success: function (result) {
              console.log(result)
              if (result.data.code == 1000) {
                if (result.data.rows.length != 0) {
                  that.setData({ positionDis: result.data.city_name, team: result.data.rows })
                } else {
                  that.setData({ positionDis: result.data.city_name, noTeam: 1 })                  
                }
                wx.hideLoading()
              }
            }
          })
        }
      },
      fail: function (err) {
        wx.openSetting()
        // that.setData({ positionDis: '未知' })
      }
    })
    // 获取地区列表
    wx.request({
      url: $.api + 'league/LeagueProvince',
      header: { 'Content-Type': 'application/x-www-form-urlencoded' },
      method: "POST",
      success: function (res) {
        // console.log(res)
        if (res.data.length > 0) {
          that.setData({ province: res.data })
        }
      }
    })
  },
  // 跳转详情
  toDetail: function (e) {
    // console.log(e.currentTarget.dataset.id)
    wx.navigateTo({
      url: '/pages/team_detail/team_detail?id=' + e.currentTarget.dataset.id,
    })
  },
  // 搜索
  searchKey: function (e) {
    var that = this
    if (e.detail.value != '') {
      that.setData({ status: 2, searchKey: e.detail.value, loading: false, page: 2 })
      wx.request({
        url: $.api + 'Team/findTeam',
        data: { teamName: e.detail.value,page:1 },
        header: { "content-type": "application/x-www-form-urlencoded" },
        method: 'POST',
        success: function (res) {
          console.log(res)
          if (res.data.code == 1000) {
            if (res.data.rows.length == 0) {
              that.setData({isNull: 1, team: []})
            } else {
              that.setData({team:res.data.rows,searchKey: e.detail.value})
            }
          }
        },
      })      
    } else {
      // 获取经纬度
      wx.getLocation({
        success: function (res) {
          const subData = {}
          if (res) {
            // 获取当前地理位置和比赛
            wx.request({
              url: $.api + 'Team/findTeam',
              data: { lat: res.latitude, lng: res.longitude, page: 1},
              method: 'POST',
              header: { "Content-Type": "application/x-www-form-urlencoded" },
              success: function (result) {
                console.log(result)
                if (result.data.code == 1000) {
                  that.setData({ positionDis: result.data.city_name, team: result.data.rows,isNull: 0 })
                  wx.hideLoading()
                }
              }
            })
          }
        },
        fail: function (err) {
          wx.openSetting()
          // that.setData({ positionDis: '未知' })
        }
      })
    }
  },
  // 选择省份，返回大区列表
  selProvince: function (e) {
    var that = this
    var index = e.currentTarget.dataset.index
    var code = e.currentTarget.dataset.code
    wx.request({
      url: $.api + 'league/LeagueCity',
      header: { "content-type": "application/x-www-form-urlencoded" },
      data: { provincecode: code },
      method: 'POST',
      success: function (res) {
        console.log(res)
        if (res.data) {
          that.setData({ selPro: index, cityList: res.data })
        }
      }
    })
  },
  // 选择地区
  changeArea: function (e) {
    this.data.changeDis == 1 ? this.setData({changeDis: 0}) : this.setData({changeDis: 1})
    this.setData({ catchStatus: !this.data.catchStatus })
  },
  // 选择地区
  changeList: function (e) {
    var that= this
    console.log(e.currentTarget.dataset.code)
    console.log(e.currentTarget.dataset.id)
    var provinceCode = e.currentTarget.dataset.code
    var cityCode = e.currentTarget.dataset.id
    !provinceCode ? provinceCode = -1 :''
    !cityCode? cityCode = -1 : ''
    let address = {
      provinceCode,
      cityCode
    }
    that.setData({ status: 1, address, loading: false, page: 2 ,catchStatus:true})
    wx.request({
      url: $.api + 'Team/findTeam',
      data: { provinceCode, cityCode, page: 1},
      header: { "content-type": "application/x-www-form-urlencoded" },
      method: 'POST',
      success: function(res) {
        if (res.data.code == 1000) {
          if (e.currentTarget.dataset.name !== '全部') {
            that.setData({ positionDis: e.currentTarget.dataset.name })
          } else {
            that.setData({ positionDis: that.data.province[that.data.selPro].name })
          }
          that.setData({ team: res.data.rows,  changeDis: 0})
        }
      },
    })
  },
  toCreate: function () {
    if ($.phone){
      wx.navigateTo({
        url: '/pages/create_team/create_team',
      })
    }else{
      wx.navigateTo({
        url: '/pages/login/login',
      })
    }
  },
  // 取消搜索
  closeSearch: function () {
    this.setData({ searchKey: ''})
    this.onLoad()
  },
  Refresh: function () {
    if (this.data.loading) {
      return
    }
    this.setData({ loading: true,page: 1 })
    switch (this.data.status) {
      case 0:
        this.getMoreList('refesh')
        break;
      case 1:
        this.getMoreAddress('refesh')
        break;
      case 2:
        this.getMoreSearch('refesh')
        break;
    }
  },
  getMoreList (refesh){
    wx.showLoading({
      title: '加载中',
    })
    wx.request({
      url: $.api + 'Team/findTeam',
      data: { lat: this.data.lat, lng: this.data.lng, page: this.data.page  },
      method: 'POST',
      header: { "Content-Type": "application/x-www-form-urlencoded" },
      success:  (result)=> {
        if (result.data.code == 1000) {
          let team = this.data.team
          team = [...team, ...result.data.rows]
          if (refesh == 'refesh') {
            this.setData({ team: result.data.rows })
            wx.stopPullDownRefresh()
          } else {
            this.setData({ team })
          }
          wx.hideLoading()
          let nowpage = this.data.page
          nowpage = nowpage + 1
          this.setData({ page: nowpage })
          if (result.data.rows.length == 10) {
            this.setData({ loading: false })
          }
          if (result.data.rows.length < 10 && !refesh) {
            wx.showToast({
              title: '没有更多了',
              icon: 'none',
              duration: 2000
            })
          }
        }
      }
    })
  },
  getMoreAddress (refesh){
    wx.showLoading({
      title: '加载中',
    })
    wx.request({
      url: $.api + 'Team/findTeam',
      data: { provinceCode: this.data.address.provinceCode, cityCode: this.data.address.cityCode, page: this.data.page },
      header: { "content-type": "application/x-www-form-urlencoded" },
      method: 'POST',
      success:  (res)=> {
        if (res.data.code == 1000) {
          let team = this.data.team
          team = [...team, ...res.data.rows]
          if (refesh == 'refesh') {
            this.setData({ team: res.data.rows })
            wx.stopPullDownRefresh()
          } else {
            this.setData({ team })
          }
          wx.hideLoading()
          let nowpage = this.data.page
          nowpage = nowpage + 1
          this.setData({ page: nowpage })
          if (res.data.rows.length == 10) {
            this.setData({ loading: false })
          }
          if (res.data.rows.length < 10 && !refesh) {
            wx.showToast({
              title: '没有更多了',
              icon: 'none',
              duration: 2000
            })
          }
        }
      }
    })
  },
  getMoreSearch (refesh){
    wx.showLoading({
      title: '加载中',
    })
    wx.request({
      url: $.api + 'Team/findTeam',
      data: { teamName: this.data.searchKey, page: this.data.page },
      header: { "content-type": "application/x-www-form-urlencoded" },
      method: 'POST',
      success:  (result)=> {
        if (result.data.code == 1000) {
          let team = this.data.team
          team = [...team, ...result.data.rows]
          if (refesh == 'refesh') {
            this.setData({ team: result.data.rows })
            wx.stopPullDownRefresh()
          } else {
            this.setData({ team })
          }
          wx.hideLoading()
          let nowpage = this.data.page
          nowpage = nowpage + 1
          this.setData({ page: nowpage })
          if (result.data.rows.length == 10) {
            this.setData({ loading: false })
          }
          if (result.data.rows.length < 10 && !refesh) {
            wx.showToast({
              title: '没有更多了',
              icon: 'none',
              duration: 2000
            })
          }
        }
      }
    })      
  },
  ReachBottom () {
    if (this.data.loading) {
      return
    }
    this.setData({ loading: true })
    switch (this.data.status) {
      case 0:
        this.getMoreList()
        break;
      case 1:
        this.getMoreAddress()
        break;
      case 2:
        this.getMoreSearch()
        break;
    }
  }
})
