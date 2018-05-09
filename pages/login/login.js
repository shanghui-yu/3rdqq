const $ = getApp().globalData
Page({

  /**
   * 页面的初始数据
   */
  data: {
    img: {
      logo1: '/images/logo1.png',phone: '/images/phone@3x.png', key: '/images/key@3x.png' 
    },
    getCode: '获取验证码',
    phone:'',
    code:'',
    codeLock:false,
    submitLock:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },
  getCode: function () {
    let phone = this.data.phone
    if (this.data.codeLock || phone.trim().length<11) {
      return
    }
    this.setData({ codeLock: true })
    var that = this
    if (that.data.getCode == '获取验证码') {
      var shortTime = 60
      that.getCodeNum()  
      that.setData({getCode: shortTime + 's'})
      that.data.timer = setInterval(function () {
        if (shortTime != 0) {
          shortTime --
          that.setData({getCode: shortTime + 's'})
        } else {
          that.setData({ getCode: '获取验证码', codeLock: false})
          clearInterval(that.data.timer )
        }
      }, 1000)
    } else {
      console.log(1)
    }
  },
  changePhone (event){
    this.setData({ phone: event.detail.value})
  },
  changeCode (event){
    this.setData({ code: event.detail.value })
  },
  getCodeNum(){
    wx.request({
      url: $.api + 'user/findCode',
      data: { phone: this.data.phone },
      header: { "Content-Type": "application/x-www-form-urlencoded" },
      method: 'POST',
      success: (res)=> {
        let { code, message} = res.data
        wx.showToast({
          title: message,
          icon: 'none',
          duration: 2000
        })
      }
    })
  },
  submitPhone(){
    if (this.data.submitLock) {
      return
    }
    this.setData({ submitLock: true })
    wx.showLoading({
      title: '加载中',
    })
    wx.request({
      url: $.api + 'user/validateCode',
      data: { phone: this.data.phone, code: this.data.code, userid: $.uid },
      header: { "Content-Type": "application/x-www-form-urlencoded" },
      method: 'POST',
      success: (res) => {
        this.setData({ submitLock: false })
        wx.hideLoading()
        let { code, message } = res.data
        if (code =='1021'){
          $.phone = this.data.phone
          $.uid = this.data.userId
          wx.navigateBack({
            delta: 1
          })
        }
        // else{
        //   this.setData({ getCode: '获取验证码', codeLock: false, submitLock:false })
        //   this.data.timer && clearInterval(this.data.timer)
        // }
        wx.showToast({
          title: message,
          icon: 'none',
          duration: 2000
        })
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