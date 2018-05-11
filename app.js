//app.js
// var that = this
App({
  onLaunch: function () {
    var that = this
    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        console.log(res,5666)
        if (res.code) {
          wx.request({
            url: 'https://xapi.haoq360.com/index.php/api/user/get_Unionid',
            method: 'POST',
            data: {code:res.code},
            header: { "Content-Type": "application/x-www-form-urlencoded" },
            success: function (res1) {
              console.log(res1,666666)
              // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
              var sessionKey = res1.data.session_key
              wx.getUserInfo({
                success: function(res2) {
                  // console.log(that)
                  // that.globalData.userInfo = res2.userInfo
                  console.log(res2,22222)
                  wx.request({
                    url: 'https://xapi.haoq360.com/index.php/api/user/Decrypt',
                    data: { sessionKey, encryptedData: res2.encryptedData, iv:res2.iv},
                    header: { "Content-Type": "application/x-www-form-urlencoded" },
                    method: 'POST',
                    success: function(res3) {
                      if (res3.data.code == 2000) {
                        if (res3.data.obj.phone){
                          that.globalData.phone = res3.data.obj.phone
                        }
                        that.globalData.uid = res3.data.obj.userid
                        that.globalData.wid = res3.data.obj.weixinId
                      }
                    },
                  })
                  // 可以将 res 发送给后台解码出 unionId
                  // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
                  // // 所以此处加入 callback 以防止这种情况
                  // if (this.userInfoReadyCallback) {
                  //   this.userInfoReadyCallback(res)
                  // }
                }
              })              
            }
          })
        }
      }
    })
  },
  globalData: {
    api: 'https://xapi.haoq360.com/index.php/api/',
    userInfo: {},
    // userId: 'LO20160412161412815356'
  }
})