var app = getApp();
Page({
  data: {
    account:'0',
    tx_account:'',
    cardList: [],//卡数组
    cardIndex: 0,
    selCardNo:'',
    selCard_rel:'',
    info:[],
  },
  onLoad() {
    let that =this;
    // 查找账户信息，并初始化银行卡信息
    wx.request({
      url: app.httpUrl + '/yysXcxUserCenter/getSqxx.x', // 该url是自己的服务地址，实现的功能是服务端拿到authcode去开放平台进行token验证
      data: {
        org_no: app.globalData.user_org_no
      },

      success: (re) => {
        var res = re.data.info;
        // 授权成功并且服务器端登录成功
        that.setData({
          cardList: re.data.cardList,
          info: re.data.info,
          account: re.data.account,
          selCardNo: res[0].card_no,
          selCard_rel: res[0].card_rel,
        });
      },
      fail: () => {
        wx.hideLoading();
      },
    });
  },

  bindAccountChange: function (e) {
    this.setData({
      cardIndex: e.detail.value,
      selCardNo:this.data.info[e.detail.value].card_no,
      selCard_rel: this.data.info[e.detail.value].card_rel,
    })
  },

  getAll(e){
    this.setData({
      tx_account: this.data.account
    })
  },

  bindKeyInput: function (e) {
    this.setData({
      tx_account: e.detail.value
    });
  },

  goTsjy() {
    wx.navigateBack({
      delta: 1
    });
  },

  saveTxsq(){
    if (parseFloat(this.data.tx_account) <= 0 || this.data.tx_account == ''){
      wx.showModal({
        title: '提示',
        content: '提现金额必须大于0！',
        showCancel:false
      })
    } else if (parseFloat(this.data.tx_account) > parseFloat(this.data.account)) {
      wx.showModal({
        title: '提示',
        content: '提现金额要小于当前账户里的余额！',
        showCancel: false
      })
    }else{
      let that = this;
      wx.showModal({
        title: '提示',
        content: '确认提取 ' + this.data.tx_account + ' 元到 ' + this.data.cardList[this.data.cardIndex] +'吗？',
        success:function(res){
          
          if(res.confirm){
            wx.request({
              url: app.httpUrl + '/yysXcxUserCenter/goTxsq.x', // 该url是自己的服务地址，实现的功能是服务端拿到authcode去开放平台进行token验证
              data: {
                org_no: app.globalData.user_org_no,
                txje: that.data.tx_account,
                card_no: that.data.selCardNo,
                user_no: app.globalData.user_no,
                card_rel: that.data.selCard_rel
              },
              success: (re) => {
                var res = re.data.status;
                if (res == 'accountfail'){
                  wx.showModal({
                    title: '提示',
                    content: '提现金额必须小于当前账户余额！',
                    showCancel: false
                  })
                } else if (res == 'fail'){
                  wx.showModal({
                    title: '提示',
                    content: '提现申请提交失败,请联系管理员！',
                    showCancel: false
                  })
                } else if (res == 'success'){
                  wx.showModal({
                    title: '提示',
                    content: '提现申请已提交，请等待审核！',
                    showCancel: false,
                    success: function (res) {
                      wx.navigateBack({
                        delta: 1
                      })
                    }
                  })
                }
                
                
              },
              fail: () => {
              },
            });
          }else if(res.cancle){

          }
        }
      })
    }
  }
});
