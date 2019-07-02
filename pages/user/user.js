var app = getApp();

Page({
  data: {
    user_no:'',
    user:'',
    account_num:'0',
    dqcd_num:'0',
  },
  onLoad() {
    this.setData({
      user_no:app.globalData.user_no
    })
  },

  onShow() {
    // app.globalData.hasLogin = true;
    // app.globalData.user_org_no = '88000242';
    // app.globalData.user_name = 'tpz测试';
    if (!app.globalData.hasLogin){
       wx.showModal({
         title: '提示',
         content: '用户已注销，请重新登录！',
         success(){
           wx.redirectTo({
             url: '../login/login',
           })
         },
         showCancel: false
       })
    }else{
      var org_no = app.globalData.user_org_no;
      if (app.globalData.sfpt == '1'){
        org_no = '';
      }

      console.log(org_no);
      wx.request({
        url: app.httpUrl + '/yysXcxUserCenter/initUser.x', 
        data: {
          org_no: org_no
        },
        success: (re) => {
          // 授权成功并且服务器端登录成功
          console.log(re);
          this.setData({
            account_num: re.data.account_num,
            dqcd_num: re.data.dqcd_num
          });
        },
        fail: () => {
        },
      });
    }
    
  },
  handleListItemTap(e) {
    var i = e.currentTarget.dataset.index;
    if(i ==0){
      wx.navigateTo({ url: 'ysmx/ysmx' });
    }else if(i ==1){
      wx.navigateTo({ url: '../tsjy/tsjy'});
    }else if(i ==2){
      wx.navigateTo({ url: '../gjcl/gjcl' });
    }else if(i ==3){
      wx.navigateTo({ url: 'dqcdjl/dqcdjl' });
    }else if(i ==4){
      wx.navigateTo({ url: 'hiscd/hiscd' });
    }else if(i ==5){
      wx.navigateTo({ url: 'about/about' });
    }else if (i == 6) {
      wx.navigateTo({ url: 'txsq/txsq' });
    }else{
      wx.showModal({
        content: '此功能暂未开放！',
        showCancel: false
      });
    }
  },

  login_out:function(){
    wx.showModal({
      title: '注销提醒',
      content: '确定注销当前账号？',
      success(res){
        if (res.confirm) {
          app.globalData.hasLogin = false;
          app.globalData.user_no = '';
          app.globalData.sfpt = '';
          app.globalData.user_org_no = '';
          wx.redirectTo({
            url: '../login/login',
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  }
});
