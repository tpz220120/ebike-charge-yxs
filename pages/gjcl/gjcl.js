var app = getApp();
var sliderWidth = 96; // 需要设置slider的宽度，用于计算中间位置
Page({
  data: {
    tabs: ["未处理", "已处理", "已归档"],
    activeIndex: 0,
    sliderOffset: 0,
    sliderLeft: 0,
    winfo: [],
    wcount: 0,
    yinfo: [],
    ycount: 0,
    ginfo: [],
    gcount: 0
  },
  onLoad: function () {
    var that = this;
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          sliderLeft: (res.windowWidth / that.data.tabs.length - sliderWidth) / 2,
          sliderOffset: res.windowWidth / that.data.tabs.length * that.data.activeIndex
        });
      }
    });
  },
  onShow() {
    var that = this;
    wx.showLoading();
    console.log(app.globalData);
    wx.request({
      url: app.httpUrl + '/yysXcxUserCenter/initGjcl.x', // 该url是自己的服务地址，实现的功能是服务端拿到authcode去开放平台进行token验证
      data: {
        user_no: app.globalData.user_no,
        sfpt: app.globalData.sfpt
      },

      success: (re) => {
        console.log(re.data);
        that.setData({
          winfo: re.data.winfo,
          wcount: re.data.wcount,
          yinfo: re.data.yinfo,
          ycount: re.data.ycount,
          ginfo: re.data.ginfo,
          gcount: re.data.gcount
        });
        
        wx.hideLoading();
      },
      fail: () => {
        wx.hideLoading();
      },
    });
  },

  tabClick: function (e) {
    console.log(e);
    this.setData({
      sliderOffset: e.currentTarget.offsetLeft,
      activeIndex: e.currentTarget.id
    });
  },

  gjclmx(e) {
    console.log(e);
    wx.navigateTo({
      url: 'gjclmx/gjclmx?id=' + e.currentTarget.dataset.gjclid + "&type=" + e.currentTarget.dataset.type
    });
  }
});
