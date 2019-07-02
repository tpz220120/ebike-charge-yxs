var app = getApp();
Page({
  data: {
    inputShowed: false,
    inputVal: "",
    showList: [],
    selc:'10000',
    selstid:'',
    cdsbno:'',
  },
  showInput: function () {
    this.setData({
      inputShowed: true
    });
  },
  hideInput: function () {
    this.setData({
      inputVal: "",
      inputShowed: false
    });
  },
  clearInput: function () {
    this.setData({
      inputVal: ""
    });
  },
  inputTyping: function (e) {
    this.setData({
      inputVal: e.detail.value
    });
  },
  confirm: function (e) {
    this.showStlist(e.detail.value, false);
  },

  onLoad(options) {
    var cdzno = options.id;
    this.setData({
      cdsbno: cdzno
    });
   this.showStlist('', false);
  },

  showStlist(name, sfsx) {
    wx.showLoading({
      title: '正在加载中',
    })
    let that = this;
    wx.request({
      url: app.httpUrl + '/yysXcxUserCenter/getGlcdzList.x', // 该url是自己的服务地址，实现的功能是服务端拿到authcode去开放平台进行token验证
      data: {
        name: name,
        org_no: app.globalData.user_org_no,
        limit: 30,// 99个站点
      },
      success: (re) => {
        console.log(re);

        that.setData({
          showList: re.data.reList,
        })
        
        wx.hideLoading();
        if (sfsx) {
          wx.stopPullDownRefresh();
        }
      }
    });
  },
  getSel(e) {
    this.setData({
      selc: e.currentTarget.dataset.indexsel,
      selstid: e.currentTarget.dataset.paramid
    });
  },

  glcdz(){
    var stid = this.data.selstid;
    var cdsbno = this.data.cdsbno;
    if(stid == ''){
      wx.showModal({
        content: '请选择充电站进行关联！',
        showCancel:false
      })
    }else{
      wx.showLoading({
        title: '正在关联，请等待！',
      });
      wx.request({
        url: app.httpUrl + '/yysTab/Glcdz.x', // 该url是自己的服务地址，实现的功能是服务端拿到authcode去开放平台进行token验证
        data: {
          cdsbno: cdsbno,
          cdzid: stid,
          org_no: app.globalData.user_org_no,
          user_no: app.globalData.user_no,
        },
        success: (re) => {
          console.log(re);
          var str;
          wx.hideLoading();
          if (re.data.status == 'success'){
            wx.showModal({
              content: "关联成功！",
              showCancel: false,
              success: (r) =>{
                wx.switchTab({
                  url: '../../zjts',
                })
              }
            });
          }else{
            wx.showModal({
              content: "关联失败，请重新选择关联！",
              showCancel: false
            });
          }
        }
      });
    }
  },

  onPullDownRefresh() {
    this.showStlist('', true);
  },
});