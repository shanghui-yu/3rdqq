const $ = getApp().globalData
Page({
  data: {
    // 展示/搜索模式求换
    changeArea: '0',
    isNull: 0,
    searchKey: '',
    // 图片
    img: {
      position: '/images/position-big@2x.png',
      slidedown: '/images/slidedown@2x.png',
      search: '/images/search@3x.png',
      isNull: '/images/no_match@3x.png',
      location: '/images/position-small@3x.png'
    },
    cityList: [],
    positionDis: '',
    competition: [],
    page:2,
    loading:false, // 加载状态
    status:0, //状态 0代表定位，1代表地区，2代表搜索
    state: [
      { title: '已结束', color: '#7BBCFC' },
      { title: '报名中', color: '#FA6D6C'},
      { title: '比赛中', color: '#62B623' },
    ],
    address:{},
    catchStatus:true
  },
  onLoad: function () {
    var that = this
    wx.showLoading({
      title: '加载中',
    })
    this.setData({wh:wx.getSystemInfoSync().windowHeight})
    // 获取经纬度
    wx.getLocation({
      success: function(res) {
        const subData = {}
        that.setData({ lat: res.latitude, lng: res.longitude })       
        if (res) {
          // 获取当前地理位置和比赛
          wx.request({
            url: $.api + 'league/findLeague',
            data: { lat: res.latitude, lng: res.longitude,p: 1},
            method: 'POST',
            header: { "Content-Type": "application/x-www-form-urlencoded" },
            success: function (result) {
              if (result.data.code == 1021) {
                if (result.data.rows.length == 0) {
                  that.setData({ noMatch: 1, positionDis: result.data.city_name})
                } else {
                  var selCity = 0
                  result.data.cityCode == '' ? selCity = -1 : selCity = result.data.cityCode
                  that.setData({ positionDis: result.data.city_name, competition: result.data.rows, pageState1: 1, selProvince: result.data.provinceCode ,selCity})       
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
        console.log(res)
        if (res.data.length > 0) {
          that.setData({ province: res.data })
        }
      }
    })
    // 添加搜索开关
    // var that = this
    // var competiotionList = that.data.competition;
    // competiotionList.forEach((val, index) => {
    //   val.isSearch = 1
    // })
    // that.setData({competition: competiotionList})
  },
  // 跳转详情
  toDetail: function (e) {
    if (e.currentTarget.dataset.isson){
      wx.navigateTo({
        url: '/pages/team_son/team_son?id=' + e.currentTarget.dataset.id + '&state=' + e.currentTarget.dataset.state,
      })
    }else{
      wx.navigateTo({
        url: '/pages/competition/competition?id=' + e.currentTarget.dataset.id + '&state=' + e.currentTarget.dataset.state,
      })
    }
  },
  // 搜索
  searchKey: function (e) {
    var that = this
    var key = e.detail.value
    // console.log(key)
    // wx.showLoading({
    //   title: '搜索中...',
    // })
    that.setData({isNull: 0})
    if (key != '') {
      var page = 1
      that.setData({ status: 2, searchKey: key,loading:false,page:2})
      wx.request({
        url: $.api + 'league/findLeague',
        header: { "content-type": "application/x-www-form-urlencoded" },
        data: { leagueName: key, page: 1 },
        method: "POST",
        success: function (res) {
          if (res.data.code == 1021) {
            page++
            var isNull = 0
            res.data.rows.length == 0 ? isNull = 1 : isNull = 0 
            that.setData({competition: res.data.rows, isSearch: 1,searchKey: key, page, isNull})
            // wx.hideLoading()
          }
        }
      })
    }else {
      // 获取经纬度
      wx.getLocation({
        success: function (res) {
          console.log(res.latitude)
          const subData = {}
          if (res) {
            // 获取当前地理位置和比赛
            var statePage1 = 1
            wx.request({
              url: $.api + 'league/findLeague',
              data: { lat: res.latitude, lng: res.longitude, p: statePage1 },
              method: 'POST',
              header: { "Content-Type": "application/x-www-form-urlencoded" },
              success: function (result) {
                console.log(result)
                if (result.data.code == 1021) {
                  that.setData({ positionDis: result.data.city_name, competition: result.data.rows })
                  // wx.hideLoading()
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
  // 选择地址
  getDisList: function () {
    this.data.changeArea == 1 ? this.setData({changeArea: 0}) : this.setData({changeArea: 1}) 
    this.setData({ catchStatus: !this.data.catchStatus })
  },
  // 选择省份，返回大区列表
  selProvince: function (e) {
    var that = this
    var index = e.currentTarget.dataset.index
    var code = e.currentTarget.dataset.code
    console.log(code)
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
  // 选择地区  返回比赛列表
  changeList: function (e) {
    var that = this
    var page = 1
    var provinceCode = e.currentTarget.dataset.provincecode
    var cityCode = e.currentTarget.dataset.id
    console.log(cityCode)
    console.log(provinceCode)
    let address= {
      provinceCode,
      cityCode
    }
    that.setData({ status: 1, address,loading: false, page: 2 })
    !provinceCode ? provinceCode = -1 : ''
    !cityCode ? cityCode = -1 : ""
    console.log(cityCode)
    console.log(provinceCode)
    console.log(e.currentTarget.dataset.name,123)
    that.setData({ catchStatus: true })
    wx.request({
      url: $.api + 'league/findLeague',
      data: { provinceCode, cityCode, page },
      header: { "content-type": "application/x-www-form-urlencoded" },
      method: "POST",
      success: function (res) {
        if (res.data.code == 1021) {
          if (res.data.rows.length != 0) {
            page++
            that.setData({ competition: res.data.rows, page, changeArea: 0, selProvince: provinceCode, selCity: cityCode, city_name:res.data.city_name, noMatch: 0 })
            // if (that.data.selPro) {
            //   that.setData({ positionDis: that.data.province[that.data.selPro].name, isSearch: 0, isNull: 0 })
              if (e.currentTarget.dataset.name !== '全部') {
                that.setData({ positionDis: e.currentTarget.dataset.name})
              } else {
                that.setData({ positionDis: that.data.province[that.data.selPro].name})
              }
            }
          // } else {
          //   that.setData({ isNull: 1, changeArea: 0,selPro: -1 })
          // }
        } 
      }
    })
  },
  // 创建赛事
  toCreate: function () {
    if ($.phone){
      wx.navigateTo({
        url: '/pages/create_competition/create_competition',
      })
    }else{
      wx.navigateTo({
        url: '/pages/login/login',
      })
    }
  },
  onShareAppMessage: function () {
    
  },
  Refresh: function () {
    if (this.data.loading){
      return 
    }
    this.setData({ page:1,loading: true })
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
  // 取消搜索
  closeSearch: function () {
    var that = this
    var page = 1
    this.setData({ searchKey:''})
    wx.request({
      url: $.api + 'league/findLeague',
      data: { provinceCode: that.data.selProvince, cityCode:that.data.selCity, page },
      header: { "content-type": "application/x-www-form-urlencoded" },
      method: "POST",
      success: function (res) {
        if (res.data.code == 1021) {
          if (res.data.rows.length != 0) {
            page++
            that.setData({ competition: res.data.rows, page, changeArea: 0, city_name: res.data.city_name, noMatch: 0,isNull: 0 })
            // if (that.data.selPro) {
            //   that.setData({ positionDis: that.data.province[that.data.selPro].name, isSearch: 0, isNull: 0 })
          }
          // } else {
          //   that.setData({ isNull: 1, changeArea: 0,selPro: -1 })
          // }
        }
      }
    })
  },
  getMoreList (refesh){  // 定位翻页加载
    wx.showLoading({
      title: '加载中',
    })
    wx.request({
      url: $.api + 'league/findLeague',
      data: { lat: this.data.lat, lng: this.data.lng, p:this.data.page },
      method: 'POST',
      header: { "Content-Type": "application/x-www-form-urlencoded" },
      success:  (result)=> {
        if (result.data.code == 1021) {
          let competition = this.data.competition
          competition = [...competition, ...result.data.rows]
          if (refesh =='refesh') {
            this.setData({ competition: result.data.rows })
            // wx.stopPullDownRefresh()
          }else{
            this.setData({ competition })
          }
          wx.hideLoading()
          let nowpage = this.data.page
          nowpage = nowpage + 1
          this.setData({ page: nowpage })
          if (result.data.rows.length == 10) {
            this.setData({ loading: false })
          }
          if (result.data.rows.length < 10 && !refesh){
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
  getMoreSearch (refesh) {   // 搜索翻页加载
    wx.showLoading({
      title: '加载中',
    })
    wx.request({
      url: $.api + 'league/findLeague',
      data: { leagueName: this.data.searchKey, p: this.data.page },
      method: 'POST',
      header: { "Content-Type": "application/x-www-form-urlencoded" },
      success: (result) => {
        if (result.data.code == 1021) {
          let competition = this.data.competition
          competition = [...competition, ...result.data.rows]
          if (refesh == 'refesh') {
            this.setData({ competition: result.data.rows })
            // wx.stopPullDownRefresh()
          } else {
            this.setData({ competition })
          }
          wx.hideLoading()
          let nowpage = this.data.page
          nowpage = nowpage + 1
          this.setData({ page: nowpage })
          if (result.data.rows.length == 10) {
            this.setData({ loading: false})
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
      url: $.api + 'league/findLeague',
      data: { provinceCode: this.data.address.provinceCode, cityCode: this.data.address.cityCode, p: this.data.page },
      header: { "content-type": "application/x-www-form-urlencoded" },
      method: "POST",
      success:  (res)=> {
        if (res.data.code == 1021) {
          let competition = this.data.competition
          competition = [...competition, ...res.data.rows]
          if (refesh == 'refesh') {
            this.setData({ competition: res.data.rows })
            // wx.stopPullDownRefresh()
          } else {
            this.setData({ competition })
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
  ReachBottom () {
    if (this.data.loading){
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
