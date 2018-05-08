// pages/areaList/areaList.j
const cityList = [
  '呼和浩特',
  '呼和浩特',
  '呼和浩特',
  '呼和浩特',
  '呼和浩特',
  '呼和浩特',
  '呼和浩特',
  '呼和浩特',
  '呼和浩特',
  '呼和浩特',
]
const $ = getApp().globalData
Page({
  data: {
    img: {
       search: '/images/search@3x.png',
       close: '/images/close@3x.png'
    },
    selPro: '-1',
    cityList : [],
    province: [
      '内蒙古自治区',
      '内蒙古自治区',
      '内蒙古自治区',
      '内蒙古自治区',
      '内蒙古自治区',
      '内蒙古自治区',
      '内蒙古自治区',
    ],
    nowArea: '北京市'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (e) {
    var that = this
    if (e.dis) {
      that.setData({nowArea: e.dis})
    }
    wx.request({
      url: $.api + 'league/LeagueProvince',
      header: { 'Content-Type': 'application/json' }, 
      method: "POST",
      success: function (res) {
        console.log(res)
        if (res.data.length>0) {
          that.setData({ province: res.data})
        }
      }
    })
  },
  selProvince: function (e) {
    var index = e.currentTarget.dataset.index
    var code = e.currentTarget.dataset.code
    wx.request({
      url: $.api +  'league/LeagueCity',
      header: { "content-type": "application/x-www-form-urlencoded"}, 
      data: { provincecode: code},
      method: 'POST',
      success: function (res) {
        console.log(res)
      }
    })
    this.setData({selPro: index, cityList})
  },
  tosearch: function () {
    wx.switchTab({
      url: '',
    })
  }
})