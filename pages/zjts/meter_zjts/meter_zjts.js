var app = getApp();
Page({
  data: {
    inputShowed: false,
    inputVal: "",
    glList: [],
    wglList: [],
    selc: -1,
    selcyz: -1,
    selstid: '',
    seltab:0,
    dnbbh:''
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
    this.setData({
      dnbbh: options.no
    })
  },

  onShow(){
    this.showStlist('', false);
  },

  showStlist(name, sfsx) {
    wx.showLoading({
      title: '正在加载中',
    })
    let that = this;
    wx.request({
      url: app.httpUrl + '/yysTab/selStForDnbzj.x', // 该url是自己的服务地址，实现的功能是服务端拿到authcode去开放平台进行token验证
      data: {
        name: name,
        org_no: app.globalData.user_org_no,
        limit: 30,// 99个站点
      },
      success: (re) => {
        console.log(re);

        that.setData({
          glList: re.data.glList,
          wglList: re.data.wglList,
        })
        wx.hideLoading();
      }
    });
  },
  getSel(e) {
    console.log(e);
    this.setData({
      selc: e.currentTarget.dataset.indexsel,
      selstid: e.currentTarget.dataset.paramid,
      selcyz: -1 //已装表打标记，未装表标记取消
    });
  },

  getSelYz(e) {
    console.log(e);
    this.setData({
      selc: -1,
      selstid: e.currentTarget.dataset.paramid,
      selcyz: e.currentTarget.dataset.indexsel //已装表打标记，未装表标记取消
    });
  },

  goSelTab(e) {
    console.log(e);
    this.setData({
      seltab: e.currentTarget.dataset.selnum,
    });
  },

  goNext(e) {
      wx.navigateTo({
        url: 'meter_gl/meter_gl?stid=' + this.data.selstid + '&dnbbh=' + this.data.dnbbh,
      })
  },
});