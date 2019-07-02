var app = getApp();
//地图展示附近100km之内的99个电站，无论地图缩放还是变大，如果中心点不变化不重新加载
Page({
  data: {
    stid: '',
    scale: 16,
    sbzs:'',
    cdrc:'',
    longitude: '',
    latitude: '',
    markers: [],
    mainHeight: 500,
    sfjz: false,///刚开始数据是否加载完成，防止regionMap重复调用
    regionover: true,///一次regionMap结束后不能重复调用
    regionjd: '',//上一次移动的经度
    regionwd: '',//上一次移动的维度
    ifshow: false,
  },

  onShow() {
    this.showMainMap();
  },

  showMainMap: function () {
    wx.showLoading();
    var that = this;
    var param = {
      org_no: app.globalData.user_org_no,
      sfpt: app.globalData.sfpt,
      name: '', 
      limit: 99,// 99个站点
      inType: 'map',
   }

    //查找此运营商下面100km内所有的电站列表
    wx.request({
      url: app.httpUrl + '/yysTab/getYysStationListSy.x',
      data: param,
      success: (re) => {
        var latitude = that.data.latitude;
        var longitude = that.data.longitude;
        var insStDate = new Array();
        console.log(re.data);
        if (re.data != null && re.data.stlist.length != 0) {
          var st = re.data.stlist;
          //var includeDate = new Array();
          var k = 0;
          for (var i = 0; i < st.length; i++) {
            var stDate = st[i];
            var market = new Object();
            market.id = stDate.id;
            market.latitude = stDate.latitude;
            market.longitude = stDate.longitude;
            if (latitude == ''){
              latitude = stDate.latitude;
              longitude = stDate.longitude;
            }
            market.width = 36;
            market.height = 45;
            if (stDate.zxtj > 0){
                market.iconPath = '/image/mark-kx.png';
            }else{
                market.iconPath = '/image/mark-lx.png';
            }
            
            insStDate[i] = market;
          }

          // 地图中心的market
          var marketc = new Object();
          marketc.id = 'center';
          marketc.latitude = latitude;
          marketc.longitude = longitude;
          marketc.width = 20;
          marketc.height = 33;
          marketc.iconPath = '/image/mark-dw.png';
          insStDate[st.length] = marketc; 
        }else{
          latitude = '30.280724';
          longitude = '120.123103';
          // 地图中心的market
          var marketc = new Object();
          marketc.id = 'center';
          //如果没有电站列表，显示华星世纪大楼的定位
          marketc.latitude = latitude;
          marketc.longitude = longitude;
          marketc.width = 20;
          marketc.height = 33;
          marketc.iconPath = '/image/mark-dw.png';
          insStDate[0] = marketc;
        }

        console.log(insStDate);
        that.setData({
          //includePoints:includeDate,
          markers: insStDate,
          latitude: latitude,
          longitude: longitude
        });

        // 使用 wx.createMapContext 获取 map 上下文
        that.mapCtx = wx.createMapContext('map');

        that.setData({
          mainHeight: app.globalData.apiH,
          sfjz: true,
        })

        if (typeof (re.data.cdrc) == 'undefined') {
          that.setData({
            sbzs: 0,
            cdrc: 0,
          });
        } else {
          that.setData({
            sbzs: re.data.sbzs,
            cdrc: re.data.cdrc
          });
        }
        wx.hideLoading();
      },
      fail: () => {
        // 根据自己的业务场景来进行错误处理
        wx.hideLoading();
      },
    });
  },
  regionchange(e) {
    // 上一次跟本次移动的经纬度一致的情况下，不重复调用
    console.log(e);
    // 注意：如果缩小或者放大了地图比例尺以后，请在 onRegionChange 函数中重新设置 data 的
    // scale 值，否则会出现拖动地图区域后，重新加载导致地图比例尺又变回缩放前的大小。
    if (e.type === 'end' && this.data.sfjz && this.data.regionover && e.causedBy === 'drag') {
      this.setData({
        //includePoints:includeDate,
        regionover: false
      });
      wx.showLoading();
      var that = this;
      // 根据中心点获取坐标
      this.mapCtx.getCenterLocation({
        success: function (res) {
          wx.request({
            url: app.httpUrl + '/yysTab/getStationListReg.x', // 该url是自己的服务地址，实现的功能是服务端拿到authcode去开放平台进行token验证
            data: {
              longitude: res.longitude,
              latitude: res.latitude,
              org_no: app.globalData.user_org_no,
              sfpt: app.globalData.sfpt,
              limit: 99,// 99个站点
              dis: 100,// 100km
            },
            success: (re) => {
              if (re.data != null) {
                var st = re.data.stlist;
                var insStDate = new Array();
                var k = 0;
                for (var i = 0; i < st.length; i++) {
                  var stDate = st[i];
                  var market = new Object();
                  market.id = stDate.id;
                  market.latitude = stDate.latitude;
                  market.longitude = stDate.longitude;
                  market.width = 36;
                  market.height = 45;
                  if (stDate.zxtj > 0) {
                    market.iconPath = '/image/mark-kx.png';
                  } else {
                    market.iconPath = '/image/mark-lx.png';
                  }
                  insStDate[i] = market;
                }

                // 地图中心的market
                var marketc = new Object();
                marketc.id = 'center';
                marketc.latitude = res.latitude;
                marketc.longitude = res.longitude;
                marketc.width = 20;
                marketc.height = 33;
                marketc.iconPath = '/image/mark-dw.png';
                insStDate[st.length] = marketc;

                that.setData({
                  markers: insStDate,
                  longitude: res.longitude,
                  latitude: res.latitude,
                  regionover: true,
                });

                wx.hideLoading();
              }
            },
            fail: () => {
              // 根据自己的业务场景来进行错误处理
              wx.hideLoading();
            },
          });
        }
      })
    }
  },

  goMainBtn(e) {
    var id = e.currentTarget.dataset.id;
    // 定位
    var that = this;
      // 投诉建议
    if (id == 1) {
      wx.navigateTo({ url: '../tsjy/tsjy' });
    } else if (id == 2) {
      // 告警工单
      wx.navigateTo({ url: '../gjcl/gjcl' });
    } 
  },

  goList(e) {
    wx.navigateTo({ url: 'mainlist/mainlist?longitude=' + this.data.longitude + '&latitude=' + this.data.latitude });
  },
  goUserCenter(e) {
    // 我的
    wx.navigateTo({ url: '../user/user'});
  },
});
