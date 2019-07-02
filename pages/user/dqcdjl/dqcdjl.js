var app = getApp();
Page({
  data: {
    inputShowed: false,
    inputVal: "",
    showList: [],
    reCount: -1
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

  onLoad() {
    this.showStlist('', false);
  },

  showStlist(name, sfsx) {
    wx.showLoading({
      title: '正在加载中',
    })
    let that = this;
    wx.request({
      url: app.httpUrl + '/yysXcxUserCenter/getDqcdList.x', // 该url是自己的服务地址，实现的功能是服务端拿到authcode去开放平台进行token验证
      data: {
        org_no: app.globalData.user_org_no,
        sfpt: app.globalData.sfpt,
        param: name,
        limit: 99,// 默认99条记录
      },
      success: (re) => {
        that.setData({
          showList: re.data.reList,
          reCount: re.data.reList.length
        })

        wx.hideLoading();
        if (sfsx) {
          wx.stopPullDownRefresh();
        }
      }
    });
  },
  goDetail(e) {
    console.log(e.currentTarget.dataset.paramid);
    wx.navigateTo({ url: '../cdxq/cdxq?type=dq&id=' + e.currentTarget.dataset.paramid });
  },

  onPullDownRefresh() {
    this.showStlist(this.data.inputVal, true);
  },
});