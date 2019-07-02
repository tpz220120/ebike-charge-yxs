var app = getApp();
Page({
  data: {
    inputShowed: false,
    inputVal: "",
    stList: [],
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

  onLoad(options) {
    console.log(options);
    if (typeof (options.name) != 'undefined'){
      var name = decodeURIComponent(options.name);// 解码
      console.log(name);
        this.setData({
          inputVal: name,
          inputShowed: true
        })
      this.showStlist(name, false);
    }else{
      this.showStlist('', false);
    }
   
  },

  showStlist(name, sfsx) {
    wx.showLoading({
      title: '正在加载中',
    })
    let that = this;
    wx.request({
      url: app.httpUrl + '/yysTab/getYysStationList.x', // 该url是自己的服务地址，实现的功能是服务端拿到authcode去开放平台进行token验证
      data: {
        org_no: app.globalData.user_org_no,
        name: name,
        limit: 99,// 99个站点
        sfpt: app.globalData.sfpt,
        inType:''
      },
      success: (re) => {
        console.log(re);
        var stList = re.data.stlist;
        for (var i = 0; i < stList.length; i++) {
          stList[i].up = '';
          var devDate = stList[i].devList;
          for (var j = 0; j < devDate.length;j++){
            devDate[j].showts = '';
          }
          var meterDate = stList[i].meterList;
          for (var k = 0; k < meterDate.length; k++) {
            meterDate[k].showdnb = '';
          }
        }

        that.setData({
          stList: stList
        })
        
        wx.hideLoading();
        if (sfsx) {
          wx.stopPullDownRefresh();
        }
      }
    });
  },
  goMain(e) {
    wx.switchTab({ url: '../main'});
  },

  onPullDownRefresh() {
    this.showStlist(this.data.inputVal, true);
  },

  upCz(event) {
    var index = event.currentTarget.dataset.index;
    var sfup = event.currentTarget.dataset.sfup;
    var up = 'stList[' + index + '].up';

    if (sfup === 'true') {
      this.setData({
        [up]: '',
      })
    } else {
      this.setData({
        [up]: 'true',
      })
    }
  },

  showtsxx(event) {
    var index = event.currentTarget.dataset.index;
    var devindex = event.currentTarget.dataset.devindex;
    var showts = event.currentTarget.dataset.showts;
    var tszt = 'stList[' + index + '].devList[' + devindex +'].showts';
    console.log(showts)
    if (showts == 'true') {
      this.setData({
        [tszt]: '',
      })
    } else {
      this.setData({
        [tszt]: 'true',
      })
    }
  },

  showmeter(event) {
    var index = event.currentTarget.dataset.index;
    var meterindex = event.currentTarget.dataset.meterindex;
    var showdnb = event.currentTarget.dataset.showdnb;
    console.log(event.currentTarget.dataset);
    var zt = 'stList[' + index + '].meterList[' + meterindex + '].showdnb';
    console.log(zt);
    if (showdnb === 'true') {
      this.setData({
        [zt]: '',
      })
    } else {
      this.setData({
        [zt]: 'true',
      })
    }
  },

  showLoad(event) {
    console.log(event);
    var index = event.currentTarget.dataset.index;
    var meterindex = event.currentTarget.dataset.meterindex;
    var p = event.currentTarget.dataset.progress;
    var meterno = event.currentTarget.dataset.meterno;

    var stObject = 'stList[' + index + '].meterList[' + meterindex + ']';
    wx.request({
      url: app.httpUrl + '/yysTab/sendMeterTask.x', // 该url是自己的服务地址，实现的功能是服务端拿到authcode去开放平台进行token验证
      data: {
        meterno: meterno
      },
      success: (re) => {
        if(re.data.status == 'success'){
          var progress = stObject + '.progress';
          var loadbj = stObject + '.showload';
          wx.showModal({
            content: '抄表命令已下发，请等待！',
            showCancel: false,
            success:(r)=>{
              this.setData({
                [progress]: 0,
                [loadbj]: '1',
              });
              this.next(stObject, p, meterno);
            }
          })
        }else{
          wx.showModal({
            content: '抄表命令下发失败，请联系管理员！',
            showCancel: false
          })
        }      
      }
    });
  },

  next: function (stObject, p, meterno){
    var loadbj = stObject + '.showload';
    var cbbj = stObject + '.showCb';
    var progress = stObject + '.progress';
    var cbDate = stObject + '.cbDate';
    var initD = stObject + '.cbInitD';
    var that = this;
    wx.request({
        url: app.httpUrl + '/yysTab/getMeterD.x', // 该url是自己的服务地址，实现的功能是服务端拿到authcode去开放平台进行token验证
        data: {
          meterno: meterno
        },
        success: (re) => {
          if (re.data.status == 'success') {
            that.setData({
              [cbbj]: '1',
              [progress]: 0,
              [loadbj]: '',
              [cbDate]: re.data.cbsj,
              [initD]: re.data.initD,
            });
            return true;
          } else {
            if (p >= 100) {
              that.setData({
                [cbbj]: '1',
                [progress]: 0,
                [loadbj]: '',
              });
              return true;
            }
            p = parseInt(p)+10;
            that.setData({
              [progress]: p
            });
            setTimeout(function () {
              that.next(stObject, p, meterno);
            }, 1000);
          }
        }
      });
    }
});