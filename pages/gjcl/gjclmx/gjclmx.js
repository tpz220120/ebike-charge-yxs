var app = getApp();

Page({
  data: {
    info: [],
    dcount: '',
    dinfo: [],
    type: '',
    sfpt: app.globalData.sfpt,
    imgcount: 0,
    hidden: true,
    animContentData: [],
    textareav: '',
    xh: '',
    id: '',
  },
  onLoad(option) {
    const animation = wx.createAnimation({
      duration: 200,
      timingFunction: 'cubic-bezier(.55, 0, .55, .2)',
    });
    this.contentAnim = animation;
    animation.translateY(0).step();
    this.setData({
      animContentData: animation.export(),
    });
    wx.showLoading();
    wx.request({
      url: app.httpUrl + '/yysXcxUserCenter/initGjclmx.x', // 该url是自己的服务地址，实现的功能是服务端拿到authcode去开放平台进行token验证
      data: {
        id: option.id,
        type: option.type
      },
      success: (re) => {
        // 授权成功并且服务器端登录成功
        wx.hideLoading();
        var info = re.data.info;
        if (re.data.imgcount > 1) {
          info.csworkorderAttach = info.csworkorderAttach.split(',')[0];
        }

        this.setData({
          info: info,
          dinfo: re.data.dinfo,
          dcount: re.data.dcount,
          type: option.type,
          xh: re.data.xh,
          id: option.id,
        });
      },
      fail: () => {
        wx.hideLoading();
      },
    });
  },

  rePage(e) {
    this.setData({
      hidden: !this.data.hidden,
    })
    this.createContentShowAnim();
  },

  qrfk(e) {
    if (this.data.textareav == '') {
      wx.showModal({
        content: '请您输入处理意见！',
        showCancel: false
      });
    } else {
      this.gjcl();
    }
  },

  gjcl: function () {
    // 运营商投诉建议处理
    var param = {
      id: this.data.id,
      sm: this.data.textareav,
      xh: this.data.xh,
      user_no: app.globalData.user_no,
      user_name: app.globalData.user_name,
    }

    console.log(param);
    wx.request({
      url: app.httpUrl + '/yysXcxUserCenter/goGjPtcl.x', // 该url是自己的服务地址，实现的功能是服务端拿到authcode去开放平台进行token验证
      data: param,
      success: (re) => {
        var a;
        if (re.data.status == '1') {
          a = '处理已提交！'
        } else {
          a = '处理提交失败，请联系管理员！'
        }

        wx.showModal({
          content: a,
          showCancel: false,
          success() {
            if (re.data.status == '1') {
              wx.navigateBack({
                delta: 1
              });
            }
          }
        });
      },
      fail: () => {
        wx.hideLoading();
      },
    });
  },

  bindTextAreaBlur: function (e) {
    this.setData({
      textareav: e.detail.value
    })
  },
  createContentHideAnim: function () {
    this.contentAnim.translateY('100%').step();
    this.setData({
      animContentData: this.contentAnim.export(),
    });
  },

  createContentShowAnim: function () {
    const animation = wx.createAnimation({
      duration: 200,
      timingFunction: 'cubic-bezier(.55, 0, .55, .2)',
    });
    this.contentAnim = animation;
    animation.translateY(0).step();
    this.setData({
      animContentData: animation.export(),
    });
  },
  onModalCloseTap() {
    this.createContentHideAnim();
    setTimeout(() => {
      this.setData({
        hidden: true,
      });
    }, 210);
  },
});
