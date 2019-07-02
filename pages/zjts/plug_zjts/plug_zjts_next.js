var app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    devno: '',
    czh: '',
    plugno: '',
    plugid: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      devno: options.devno,
      czh: options.czh,
      plugno: options.plugno,
      plugid: options.plugid,
    });
  },

  tsjg(e) {
    wx.request({
      url: app.httpUrl + '/yysTab/goTsjg.x', // 该url是自己的服务地址，实现的功能是服务端拿到authcode去开放平台进行token验证
      data: {
        user_no: app.globalData.user_no,
        plugid: this.data.plugid,
        tsjg: e.currentTarget.dataset.jg
      },
      success: (re) => {
        console.log(re);
        if (re.data.msg == 'tscg'){
          wx.showModal({
            title: '成功',
            content: '插座调试结果为成功！',
            showCancel:false,
            success: (r) => {
              wx.switchTab({
                url: '../zjts',
              })
            }
          })
        } else if (re.data.msg == 'tssb'){
          wx.showModal({
            title: '失败',
            content: '插座调试结果为失败！',
            showCancel: false,
            success: (r) => {
              wx.switchTab({
                url: '../zjts',
              })
            }
          })
        }
      }
    });
  },
})