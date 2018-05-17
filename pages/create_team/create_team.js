const $ = getApp().globalData
import initAreaPicker, { getSelectedAreaData } from '../../template/index';
import formatTime from "../../utils/util.js";
Page({
  data: {
    img: {
      logo: '/images/clogo.png',name: '/images/ctname.png', shortname: '/images/csname.png', display: '/images/cdis.png', ctime: '/images/ctime.png', type: '/images/ctype.png', type: '/images/ctype.png', forward: '/images/forward.png'
    },
    logo: '',
    provName: '点击选择',
    region: '',
    ctime: '点击选择',
    ctype: '点击选择',
    typeList: ['社区队', '社会队', '企业队', '政府机关','校园队'],
    typeSel: '点击选择',
    teamName: '',
    lock:false,
    showArea: false, // 是否显示地区选择
    confimShow:false,
    shortName: '',
    teamId:''
  },
  okArea: function () {
    this.setData({ showArea: false })
    this.setData({ 
      provName: getSelectedAreaData()[0].fullName, 
      region: getSelectedAreaData()[1].fullName,
      provCode: getSelectedAreaData()[0].code,
      regionCode: getSelectedAreaData()[1].code,
     })
  },
  changeItem: function (e) {
    
    if (e.currentTarget.dataset.type == 1){
      this.setData({ showArea: true })
    }else{
      this.setData({ ctime: e.detail.value })
    }
    // e.currentTarget.dataset.type == 1 ? this.setData({ provName: e.detail.value[0], region: e.detail.value[1]}) : this.setData({ctime: e.detail.value})
  },
  cencal () {
    this.setData({ showArea: false })
  },
  typeSel: function (e) {
    this.setData({typeSel: this.data.typeList[e.detail.value]})
  },
  onLoad(option){
    if (option.edit){
      wx.setNavigationBarTitle({
        title: '球队信息'
      })
      this.setData({ edit: option.edit})
      this.getTeamDetail(option.edit)
    }
    wx.hideShareMenu()
  },
  getTeamDetail (id) {
    wx.request({
      url: $.api + 'Team/findCreateTeamDetails',
      data: { crteid: id, userid: $.uid },
      header: { "Content-Type": "application/x-www-form-urlencoded" },
      method: 'POST',
      success: (res) => {
        let { code,rows} = res.data
        if (code == 1012) {
          let time = new Date(rows.foundDate.time)
          console.log(formatTime.formatTime(time), time);
          time = formatTime.formatTime(time).replace(/\//g, '-').substring(0, 10)
          this.setData({ 
            logo: 'http://img.haoq360.com'+rows.teamIocUrl,
            teamName: rows.teamName,
            shortName: rows.shortName,
            provName: rows.provName,
            provCode: rows.provCode,
            regionCode: rows.regionCode,
            region: rows.region,
            ctime: time,
            imgs: rows.teamIocUrl,
            typeSel: rows.teamNature
          })
          if (option.edit) {
            wx.setNavigationBarTitle({
              title: rows.teamName
            })
          }
        }
      },
    })
  },
  onShow: function () {
    var that = this
    initAreaPicker({
      hideDistrict: true, // 是否隐藏区县选择栏，默认显示
    });
    try {
      let avatar = wx.getStorageSync('Cutting')
      if (avatar) {
        that.setData({ logo: avatar })
        this.getImg(avatar)
        wx.removeStorageSync('Cutting')
      }
    } catch (e) { }
  },
  getImg (img){
    wx.uploadFile({
      url: $.api + 'user/uploadimg',
      filePath: img,
      name: 'img',
      header: { "Content-Type": "multipart/form-data" },
      success:  (res)=> {
        this.setData({ imgs: res.data})
        console.log(this.data.imgs)
      }
    })
  },
  uploadLogo: function () {
    var that = this
    wx.chooseImage({
      count: 1,
      success: function(res) {
        // that.setData({logo: res.tempFilePaths[0]})
        const src = res.tempFilePaths[0]
        wx.navigateTo({
          url: `../upload/upload?src=${src}`
        })
      },
    })
  },
  getName: function (e) {
    this.setData({teamName: e.detail.value})
  },
  getShortName: function (e) {
    this.setData({shortName: e.detail.value})
  },
  onShareAppMessage: function (res) {
    if (res.from === 'button') {
      // 来自页面内转发按钮
      this.setData({confimShow: false})
    }
    return {
      title: this.data.teamName,
      path: `/pages/team_detail/team_detail?id=${this.data.teamId}`,
      success:(res)=>{
        wx.redirectTo({
          url: '/pages/team_detail/team_detail?id=' + this.data.teamId,
        })
      }
    }
  },
  cencleConfim(){
    try {
      wx.setStorageSync('tabSel', '2')
      wx.switchTab({
        url: '/pages/mine/mine',
      })
    } catch (error) {}
  },
  toCreate: function () {
    if(this.data.lock){
      return
    }
    var that = this
    this.setData({ lock:true })
    if (that.data.logo == '') {
      wx.showToast({
        title: '请选择球队Logo',
         icon: 'none'
      })
      that.setData({ lock: false })
    } else {
      if (that.data.teamName == '') {
        wx.showToast({
          title: '请填写球队名称',
           icon: 'none'
        })   
        that.setData({ lock: false })    
      } else {
        if (that.data.shortName == '') {
          wx.showToast({
            title: '请填写球队简称',
             icon: 'none'
          })
          that.setData({ lock: false })            
        } else {
          if (that.data.region == '') {
            wx.showToast({
              title: '请选择所在区域',
               icon: 'none'
            })  
            that.setData({ lock: false })            
          } else {
            if (that.data.edit){
              wx.showLoading({
                title: '保存中',
              })
            }else{
              wx.showLoading({
                title: '创建中',
              })
            }
            var subData = {}
            subData.userid = $.uid
            subData.teamName = that.data.teamName
            subData.shortName = that.data.shortName
            that.data.typeSel == '点击选择' ? subData.teamNature = '' : subData.teamNature = that.data.typeSel
            that.data.ctime == '点击选择' ? subData.foundDate = '' : subData.foundDate = that.data.ctime
            subData.provName = that.data.provName
            subData.region = that.data.region
            subData.provCode = that.data.provCode
            subData.regionCode = that.data.regionCode
            subData.img = that.data.imgs
            if (that.data.edit){
              subData.crteid = that.data.edit
            }
            wx.request({
              url: $.api + 'team/saveOrUpdateCreateTeam',
              method: "POST",
              header: { "Content-Type": "application/x-www-form-urlencoded" },
              data: subData,
              success: function(res) {
                wx.hideLoading()
                that.setData({ lock: false })
                let ress = res.data
                if (ress.code == 1007) {
                  if(that.data.edit){
                    try {
                      wx.setStorageSync('tabSel', '2')
                      setTimeout(() => {
                        wx.switchTab({
                          url: '/pages/mine/mine',
                        })
                      }, 1000);
                    } catch (error) {}
                  }else{
                    that.setData({confimShow: true,teamId:ress.rows.teamId})
                  }
                } else {
                  wx.showToast({
                    title: ress.message,
                    icon: 'none'
                  })
                }
              }
            })
          }
        }
      }
    }
  }
})