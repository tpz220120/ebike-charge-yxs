var app = getApp();
Page({
  data: {
    info: [],
    count: 0,
    sfpt: app.globalData.sfpt
  },
  onShow() {
    var that = this;
    wx.showLoading();
    var org_no = app.globalData.user_org_no;
    if (app.globalData.sfpt == '1') {
      org_no = '';
    }

    wx.request({
      url: app.httpUrl + '/yysXcxUserCenter/getTxjl.x', // 该url是自己的服务地址，实现的功能是服务端拿到authcode去开放平台进行token验证
      data: {
        org_no: org_no
      },

      success: (re) => {
        // 授权成功并且服务器端登录成功
        wx.hideLoading();
        that.setData({
          info: re.data.info,
          count: re.data.count
        });
      },
      fail: () => {
        wx.hideLoading();
      },
    });
  },

  sqtx(e) {
    wx.navigateTo({
      url: 'newtxsq/newtxsq'
    });
  }
});
