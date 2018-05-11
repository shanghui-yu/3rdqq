// pages/message/message.js
const $ = getApp().globalData
Page({
  /**
   * 页面的初始数据
   */
  data: {
    img: {
      read: '/images/read@3x.png',
      unread: '/images/unread@3x.png',
      isNull: '/images/no_match@3x.png',
    },
    typeList: ['', '球队', '联赛', '系统']
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log($.userInfo_3rd.userid)
    var that = this
    wx.request({
      url: $.api + 'user/findMessageAll',
      data: { userid: $.userInfo_3rd.userid, page: 1},
      header: { "Content-Type": "application/x-www-form-urlencoded" },
      method: 'POST',
      success: function(res) {
        console.log(res)
        if (res.data.code == 1021) {
          console.log(123)
          that.setData({messageList: res.data.rows, page: 2})
        }
      },
    })
  },
// 读取消息
  read: function (e) {
    var that = this
    // console.log(this.data.messageList)
    var messageid = e.currentTarget.dataset.id
    if (e.currentTarget.dataset.read == 0) {
      wx.request({
        url: $.api + 'user/tagRead',
        data: { messageid },
        header: { "Content-Type": "application/x-www-form-urlencoded" },
        method: 'POST',
        success: function (res) {
          console.log(res)
          if (res.data.code == 1021) {
            // that.data.messageList[e.currentTarget.dataset.index].isRead = 1
            var messageList = that.data.messageList
            messageList[e.currentTarget.dataset.index].isRead = 1
            that.setData({messageList})
          }
      }
      })  
    }

  },
  // 下拉加载
  onReachBottom: function () {
    var that = this
    var page = that.data.page
    console.log(page)
    wx.request({
      url: $.api + 'user/findMessageAll',
      data: { userid: $.userInfo_3rd.userid, page: page },
      header: { "Content-Type": "application/x-www-form-urlencoded" },
      method: 'POST',
      success: function (res) {
        console.log(res)
        if (res.data.code == 1021) {
          if (res.data.rows.length > 0) {
            var messageList = that.data.messageList
            messageList = messageList.concat(res.data.rows)
            that.setData({ messageList, page: ++page })
          } else {
            that.setData({tobottom: 1, page: page})
          }
        }
      },
    })    
  }
})