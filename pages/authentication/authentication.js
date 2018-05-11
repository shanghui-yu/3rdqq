const $ = getApp().globalData
Page({
  data: {
    // authenticationPass: -1,
    img: {
      symbol: '/images/server@3x.png',
      slide: '/images/down@3x.png'
    },
    subRealName: '',
    subCardId: '',
    cardType: ['身份证 (推荐使用)', '护照 (仅限外籍人员)', '户口本页', '港澳通行证', '台湾通行证', '军官证', '士兵证', '武警警官证'],
    selType: 0,
    uploadImg: [
      [
        {ex: '/images/header.png', info: '上传照片'},
        { ex: 'http://img.haoq360.com/img/20180226/201802261444420599858245.png', info: '上传证件照片' },
        { ex: 'http://img.haoq360.com/img/20180226/201802261444550556296219.png', info: '上传证件照片' },
      ],
      [
        { ex: '/images/header.png', info: '上传照片' },
        { ex: 'http://img.haoq360.com/img/20180226/201802261445070918559288.jpg', info: '上传证件照片' },
      ],
      [
        { ex: '/images/header.png', info: '上传照片' },
        { ex: 'http://img.haoq360.com/img/20180226/201802261445160941542559.jpg', info: '上传证件照片'}        
      ],
      [
        { ex: '/images/header.png', info: '上传照片' },
        { ex: 'http://img.haoq360.com/img/20180226/201802261445290856368072.jpg', info: '上传证件照片' } 
      ],
      [
        { ex: '/images/header.png', info: '上传照片' },
        { ex: 'http://img.haoq360.com/img/20180226/201802261445380989573195.jpg', info: '上传证件照片' }         
      ],
      [
        { ex: '/images/header.png', info: '上传照片' },
        { ex: 'http://img.haoq360.com/img/20180226/201802261445500512572574.png', info: '上传证件照片' }
      ],
      [
        { ex: '/images/header.png', info: '上传照片' },
        { ex: 'http://img.haoq360.com/img/20180226/201802261445500512572574.png', info: '上传证件照片' }
      ], 
      [
        { ex: '/images/header.png', info: '上传照片' },
        { ex: 'http://img.haoq360.com/img/20180226/201802261446210896064930.jpg', info: '上传证件照片' }
      ], 
      
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    // 获取认证信息
    // 个人信息
    wx.request({
      url: 'https://xapi.haoq360.com/index.php/api/user/queryUser',
      data: { unionid: $.wid },
      header: { "Content-Type": "application/x-www-form-urlencoded" },
      method: 'POST',
      // dataType: 'json',
      // responseType: 'text',
      success: function (res) {
        console.log(res)
        if (res.data.code == 2000) {
          // -1 未提交 0 已提交（待审核），1 已认证， 2 未通过
          that.setData({ authenticationPass: res.data.obj.authType})
          if (res.data.obj.authType == 1) {
            that.setData({ 
              cardId: res.data.obj.cardId, 
              realname: res.data.obj.realname,
              photoUrl: 'http://img.haoq360.com' + res.data.obj.photoUrl
            })
          } else if (res.data.obj.authType == 2) (
            that.setData({ reason: res.data.obj.objection})
          )
          if (res.data.obj.authType != -1 && res.data.obj.authType != 1){
            that.uploadInfo(res.data.obj)
          }
        }
      },
    })
  },
  uploadInfo (obj){
    let index = null
    if(obj.cardType == '0'){
      index = 0
    }else{
      index = obj.cardType -1
    }
    let jec = this.data.uploadImg
    let datas = [obj.photoUrl, obj.cardImg1, obj.cardImg2]
    jec[index] = this.forObject(datas, jec[index])
    this.setData({
      selType: index,
      uploadImg: jec,
      subRealName: obj.realname,
      subCardId: obj.cardId
    })
  },
  forObject (data, olddata){
    if(olddata && olddata.length){
      olddata.forEach((element,index )=> {
        console.log(element, index,6);
        element.file = data[index] 
      });
    }
    return olddata
  },
  changeType: function (e) {
    this.setData({ selType: e.detail.value})
  },
  cancelModal: function () {
    this.authenticationPass == 0 ? wx.navigateBack() : this.setData({ authenticationPass: -1 })
  },
  // 获取输入
  getInput: function (e) {
    e.currentTarget.dataset.index == 0 ? this.setData({ subRealName: e.detail.value }) : this.setData({ subCardId: e.detail.value})
  },
  // 上传图片
  uploadImg: function (e) {
    console.log(e.currentTarget.dataset.index, this.data.selType);
    
    var that = this    
    wx.chooseImage({
      count: 1,
      success: function(res) {
        // console.log(res.tempFilePaths[0])
        // var nameList = ['photoUrl', 'cardImg', 'cardImgTwo']
        try {
          const src = res.tempFilePaths[0]
          if(that.data.selType == '0' && e.currentTarget.dataset.index == '0'){
            wx.setStorageSync("Imgindex", e.currentTarget.dataset.index)
            wx.navigateTo({
              url: `../upload/upload?src=${src}`
            })
          }else{
            that.uplodFileFc(e.currentTarget.dataset.index, src)
          }
          // wx.setStorageSync("Imgindex", e.currentTarget.dataset.index)
          // wx.navigateTo({
          //   url: `../upload/upload?src=${src}`
          // })
        } catch (error) {
        }
      },
    })
  },
  onShow(){
    try {
      let index = wx.getStorageSync("Imgindex")
      let avatar = wx.getStorageSync('Cutting')
      if (index!=undefined && avatar){
        this.uplodFileFc(index, avatar)
        wx.removeStorageSync("Imgindex")
        wx.removeStorageSync('Cutting')
      }
    } catch (error) {
    }
  },
  uplodFileFc (index, avatar){
    var nameList = ['photoUrl', 'cardImg', 'cardImgTwo']
    wx.uploadFile({
      url: $.api + 'user/uploadimg',
      filePath: avatar,
      name: nameList[index],
      header: { "Content-Type": "application/x-www-form-urlencoded" },
      success:  (res1) =>{
        if (res1.data) {
          var uploadImg = this.data.uploadImg
          var selType = this.data.selType
          uploadImg[selType][index].file = res1.data
          this.setData({ uploadImg })
          if (this.data.selType == '0' && index == '1') {
            this.checkShenfen(res1.data)
          }
        }
      },
    })
  },
  checkShenfen(src){
    wx.request({
      url: $.api + 'user/getIdCardInfo',
      data: { cardImg: src },
      header: { "Content-Type": "application/x-www-form-urlencoded" },
      method: 'POST',
      success: (res) => {
        let { code, rows} = res.data
        if (code =='1021'){
          this.setData({ subRealName: rows.name, subCardId:rows.id_card_number})
        }
      }
    })
  },
  // 上传
  subData: function () {
    var that = this
    if (that.data.subRealName == '') {
      wx.showToast({
        title: '请输入真实姓名',
        image: '/images/err.png'
      })
    } else {
      if (that.data.subCardId == '') {
        wx.showToast({
          title: '请输入证件号码',
          image: '/images/err.png'
        })        
      } else {
        var sel = that.data.selType
        var list = that.data.uploadImg
        var testLen = 0
        list[sel].forEach(val => {
          if (val.file) {
            testLen++
          }
        })
        if (testLen == list[sel].length) {
          var cardImgTwo = ''
          list[sel].length == 2 ? cardImgTwo = '' : cardImgTwo = list[sel][2].file
          var subData = {}
          subData.userid = $.uid
          subData.cardImg = list[sel][1].file
          subData.cardImgTwo = cardImgTwo
          subData.cardTypeId = Number(sel) + 1
          subData.idCard = that.data.subCardId
          subData.photoUrl = list[sel][0].file
          subData.realName = that.data.subRealName
          console.log(subData)
          wx.request({
            url: $.api + 'user/saveOrUpdate',
            data: subData,
            header: { "content-type": "application/x-www-form-urlencoded" },
            method: 'POST',
            success: function(res) {
              if (res.data.code != 1201) {
                wx.showModal({
                  title: res.data.message,
                  showCancel: false,
                  confirmColor: "#2B70F0"
                })
              } else {
                wx.showToast({ title: '提交成功' })
                setTimeout(() => {
                  wx.switchTab({
                    url: '/pages/mine/mine',
                  })
                }, 1000);
              }
            },
          })
        } else {
          wx.showToast({
            title: '请上传证件图片',
            image: '/images/err.png'
          })
        }
      }
    }
  }
})