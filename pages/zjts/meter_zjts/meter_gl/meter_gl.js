var app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    dnbbh: '',
    zbss: '',
    stid:'',
    stInfo:{},
    selc:-1,
    selDev:'',
  },

  inputTyping: function (e) {
    this.setData({
      zbss: e.detail.value
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options);
    this.setData({
      dnbbh: options.dnbbh,
      stid: options.stid,
    })

    //根据电站id或者电站信息以及他下面的充电设备信息
    wx.request({
      url: app.httpUrl + '/yysTab/getYglDnbInfo.x',
      data: {
        stid: options.stid,
      },
      success: (re) => {
        console.log(re.data);
        this.setData({
          stInfo:re.data.info
        })
      }
    });
  },

  selDev(e) {
    this.setData({
      selc: e.currentTarget.dataset.index,
      selDev: e.currentTarget.dataset.devid
    });

    console.log(this.data);
  },

  goNext(e) {
    if (this.data.selDev == ''){
      wx.showModal({
        content: '请关联充电设备！',
        showCancel:false
      })
    } else if (this.data.zbss == ''){
      wx.showModal({
        content: '请输入装表示数！',
        showCancel: false
      })
    }else{
      wx.request({
        url: app.httpUrl + '/yysTab/dnbgl.x',
        data: {
          devid: this.data.selDev,
          stid: this.data.stid,
          meterno: this.data.dnbbh,
          zbss: this.data.zbss,
          user_no: app.globalData.user_no
        },
        success: (re) => {
          console.log(re.data);
          
          if(re.data.status == 'success'){
            wx.showModal({
              content: '电能表装接成功！',
              showCancel: false,
              success:(re)=>{
                wx.redirectTo({
                  url: '../../../main/mainlist/mainlist?name=' + encodeURIComponent(this.data.stInfo.cdzname),
                })
              }
            })
          }else{
            wx.showModal({
              content: '电能表装接失败，请重新装接！',
              showCancel: false,
              success: (re) => {
                wx.switchTab({
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