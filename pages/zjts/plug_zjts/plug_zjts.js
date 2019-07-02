var app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    devno: '',
    czh:'',
    plugno:'',
    plugid:'',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options);
    var cdczno = options.plugno;
    this.setData({
      plugno: cdczno,
      devno: options.devno,
      czh: options.czh,
      plugid: options.plugid,
    })
  },

  goNext(e) {
    wx.request({
      url: app.httpUrl + '/yysTab/goMnxf.x', // 该url是自己的服务地址，实现的功能是服务端拿到authcode去开放平台进行token验证
      data: {
        plugno: this.data.plugno,
        org_no: app.globalData.user_org_no,
        user_no:app.globalData.user_no
      },
      success: (re) => {
        console.log(re);

        wx.navigateTo({
          url: 'plug_zjts_next?plugno=' + this.data.plugno + '&plugid=' + this.data.plugid
            + '&devno=' + this.data.devno + '&czh=' + this.data.czh,
        })
      }
    });
  },
})