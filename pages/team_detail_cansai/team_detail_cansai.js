const $ = getApp().globalData
Page({

  /**
   * 页面的初始数据
   */
  data: {
    detail:{}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options);
    this.getdetail(options.leagueid, options.toteamid)
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },
  check(e){
    console.log(122)
    var that = this
    var id = e.currentTarget.dataset.id
    var state = ''
    // if (id != $.uid && that.data.team.userid == '领队') {
    //   state = 1
    // } else {
    //   state = 0
    // }
    wx.navigateTo({
      url: '/pages/player_info/player_info?uid=' + e.currentTarget.dataset.id,
    })
  },
  getdetail: function (leagueid, toteamid) {
    wx.showLoading({
      title: '加载中',
    })
    wx.request({
      url: $.api + 'team/findVirtualTeamPlayer',
      data: { leagueid, toteamid },
      header: { "Content-Type": "application/x-www-form-urlencoded" },
      method: 'POST',
      success:  (res)=> {
        wx.hideLoading()
        let { code, obj, message} = res.data
        console.log(code, obj, message)
        if(code=="1021"){
          this.setData({ detail:obj})
          wx.setNavigationBarTitle({
            title: obj.teamName
          })
        }
        
      }
    })
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

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})