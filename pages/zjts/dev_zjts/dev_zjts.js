var app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    ygl:'',
    info:{},
    cdzno:'',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var id = options.id;
    console.log(id);

    let param={
      cdzno:id,
      org_no: app.globalData.user_org_no
    }
    wx.request({
      url: app.httpUrl + '/yysTab/getDevInfo.x',
      data: param,
      success: (re) => {
          console.log(re.data);
          if (re.data.msg == 'ygl'){
            this.setData({
              ygl: '1',
            });
          }
          this.setData({
            cdzno: id,
            info: re.data.info,
          });
      }
    });
  },

  unbindDev(e){
    console.log("unbindDev==" + this.data.cdzno);
    
    wx.request({
      url: app.httpUrl + '/yysTab/goChaichu.x', // 该url是自己的服务地址，实现的功能是服务端拿到authcode去开放平台进行token验证
      data: {
        cdzno: this.data.cdzno,
        org_no: app.globalData.user_org_no,
        user_no: app.globalData.user_no,
      },
      success: (re) => {
        console.log(re);
        if (re.data.status == 'success') {
          wx.showModal({
            content: "拆除成功！",
            showCancel: false,
            success: (r) => {
              wx.switchTab({
                url: '../zjts',
              })
            }
          });
        } else {
          wx.showModal({
            content: "拆除失败，请重新拆除！",
            showCancel: false
          });
        }
        wx.showModal({
          content: str,
          showCancel: false
        });
      }
    });
  },

  goNext(e) {
    console.log("goNext");
    wx.navigateTo({
      url: 'dev_glcdz/dev_glcdz?id=' + this.data.cdzno,
    })
  },
})