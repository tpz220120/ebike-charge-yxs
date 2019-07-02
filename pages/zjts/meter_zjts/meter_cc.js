var app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    dnbbh: '',
    stid:'',
    stInfo:{},
    cbss:''
  },

  inputTyping: function (e) {
    this.setData({
      cbss: e.detail.value
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
      this.setData({
        dnbbh: options.no,
        stid: options.stid
      })

      //获取电站以及电能表信息
    wx.request({
      url: app.httpUrl + '/yysTab/getDnbGlInfo.x',
      data: {
        stid: options.stid,
        meterno: options.no
      },
      success: (re) => {
        console.log(re.data);
        this.setData({
          stInfo:re.data.info
        })
      }
    });
  },

  unbindMeter(e) {
    if (this.data.cbss == '') {
      wx.showModal({
        content: '请输入拆表示数！',
        showCancel: false
      })
    } else {
      wx.request({
        url: app.httpUrl + '/yysTab/dnbcc.x',
        data: {
          meterno: this.data.dnbbh,
          user_no: app.globalData.user_no
        },
        success: (re) => {
          console.log(re.data);

          if (re.data.status == 'success') {
            wx.showModal({
              content: '装接电能表成功！',
              showCancel: false,
              success: (re) => {
                wx.navigateTo({
                  url: '../../zjts',
                })
              }
            })
          }
        }
      });
    }
  },
})