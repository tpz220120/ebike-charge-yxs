var app = getApp();
var sliderWidth = 96; // 需要设置slider的宽度，用于计算中间位置
Page({
  data: {
    tabs: ["日收入", "月收入"],
    activeIndex: 0,
    sliderOffset: 0,
    sliderLeft: 0,
    rinfo: [],
    rcount: 0,
    yinfo: [],
    ycount: 0,
    month:'',
    selday: '',
    startDate: '',
    endDate: '',
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

  getM(e) {
    console.log('picker发送选择改变，携带值为', e.detail.value);
    this.setData({
      month: e.detail.value
    })

    this.getYsmx(e.detail.value, 'month');
  },

  getD(e) {
    console.log('picker发送选择改变，携带值为', e.detail.value);
    this.setData({
      selday: e.detail.value
    })

    this.getYsmx(e.detail.value,'day');
  },

  onShow() {
    var t = new Date();
    var year = t.getFullYear();
    var month = t.getMonth() + 1;
    if (month >= 1 && month <= 9) {
      month = "0" + month;
    }
    var current = year + "-" + month;
    var currentYear = year;
    var start = (year - 1) + "-01-01";
    var end = current + "-01";
    this.setData({
      month: currentYear,
      selday: current,
      startDate: start,
      endDate: end,
    });  

    // let type;
    // if (this.data.activeIndex == 0){
    //   type = 'day';
    // }else{
    //   type = 'month';
    // }
    this.getYsmx(current, 'day');  
    this.getYsmx(currentYear, 'month');  
  },

  goMonthSel(e){
    console.log(e.currentTarget.dataset.rq);
    this.setData({
      selday: e.currentTarget.dataset.rq,
      activeIndex:0,
    })

    var that = this;
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          sliderLeft: (res.windowWidth / that.data.tabs.length - sliderWidth) / 2,
          sliderOffset: res.windowWidth / that.data.tabs.length * that.data.activeIndex
        });
      }
    });
    this.getYsmx(e.currentTarget.dataset.rq, 'day');
  },

  getYsmx: function (date,type) {
    var that = this;
    wx.showLoading();
    wx.request({
      url: app.httpUrl + '/yysXcxUserCenter/getYssj.x', // 该url是自己的服务地址，实现的功能是服务端拿到authcode去开放平台进行token验证
      data: {
        org_no: app.globalData.user_org_no,
        sfpt: app.globalData.sfpt,
        selrq: date,
        type: type,
      },
      success: (re) => {
        console.log(re.data);
        // 授权成功并且服务器端登录成功
        wx.hideLoading();
        if(type == 'day'){
          that.setData({
            rinfo: re.data.info,
            rcount: re.data.count,
          });
        }else{
          that.setData({
            yinfo: re.data.info,
            ycount: re.data.count,
          });
        }
        
      },
      fail: () => {
        wx.hideLoading();
      },
    });
  },

  tabClick: function (e) {
    this.setData({
      sliderOffset: e.currentTarget.offsetLeft,
      activeIndex: e.currentTarget.id
    });
  },
});
