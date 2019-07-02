var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
  },

  scanwx(e) {
    if (app.globalData.sfpt == '1') {
      wx.showModal({
        title: '温馨提示',
        content: '请登录运营商账号装接！',
        showCancel: false
      })
    }else{
      let type = e.currentTarget.dataset.type;
      // 测试用
      // wx.navigateTo({
      //   url: 'dev_zjts/dev_zjts?id=700000000005',
      // })
      // 测试用
      // if (type == 'imei') {
      //   wx.request({
      //     url: app.httpUrl + '/yysTab/sfygldnb.x',
      //     data: {
      //       meterno: '23232',
      //       org_no: app.globalData.user_org_no
      //     },
      //     success: (re) => {
      //       if (re.data.sfgl == '1') {
      //         // 装接电能表--已关联跳转到拆除页面
      //         wx.navigateTo({
      //           url: 'meter_zjts/meter_cc?no=' + '23232' + '&stid=' + re.data.stid,
      //         })
      //       } else {
      //         // 装接电能表--未关联跳转到装接页面
      //         wx.navigateTo({
      //           url: 'meter_zjts/meter_zjts?no=' + '23232',
      //         })
      //       }


      //     }
      //   })
      // }
      // return;
      // 扫码充电
      wx.scanCode({
        scanType: ['barCode', 'qrCode', 'datamatrix'],
        success: (res) => {
          console.log(res.result);
          if (type == 'imei') {
            //查看电能表是否已关联
            wx.request({
              url: app.httpUrl + '/yysTab/sfygldnb.x',
              data: {
                meterno: res.result,
                org_no: app.globalData.user_org_no
              },
              success: (re) => {
                if (re.data.sfgl == '1') {
                  // 装接电能表--已关联跳转到拆除页面
                  wx.navigateTo({
                    url: 'meter_zjts/meter_cc?no=' + res.result + '&stid=' + re.data.stid,
                  })
                } else {
                  // 装接电能表--未关联跳转到装接页面
                  wx.navigateTo({
                    url: 'meter_zjts/meter_zjts?no=' + res.result,
                  })
                }
              }
            })
          } else {
            if (res.result.split('?').length != 2) {
              wx.navigateTo({ url: '../tipview/tipview?status=wx' });
            } else {
              var cs = res.result.split('?')[1];

              if (cs.split("&").length == 1) {
                var name = cs.split("=")[0];
                var id = cs.split("=")[1];
                // 调试插座
                if (type == 'plug') {
                  if (name != 'cdczno') {
                    wx.navigateTo({ url: '../tipview/tipview?status=0' });
                  } else {
                    // 插座校验
                    wx.request({
                      url: app.httpUrl + '/yysTab/goTs.x', // 该url是自己的服务地址，实现的功能是服务端拿到authcode去开放平台进行token验证
                      data: {
                        plugno: id,
                        org_no: app.globalData.user_org_no
                      },
                      success: (re) => {
                        console.log(re);
                        if (re.data.status == 'success') {
                          wx.navigateTo({
                            url: 'plug_zjts/plug_zjts?devno=' + re.data.devno + '&czh=' + re.data.czh + '&plugno=' + re.data.plugno + '&plugid=' + re.data.plugid
                          })
                        } else {
                          wx.navigateTo({ url: '../tipview/tipview?status=' + re.data.status + '&devno=' + re.data.devno + '&czh=' + re.data.czh });
                        }
                      }
                    });

                  }
                }
                // 装接充电桩
                if (type == 'dev') {
                  if (name != 'device') {
                    wx.navigateTo({ url: '../tipview/tipview?status=1' });
                  } else {
                    wx.request({
                      url: app.httpUrl + '/yysTab/goDevVal.x',
                      data: {
                        cdzno: id,
                        org_no: app.globalData.user_org_no
                      },
                      success: (re) => {
                        console.log(re.data);
                        if (re.data.msg == 'fail') {
                          wx.navigateTo({
                            url: '../tipview/tipview?status=wx',
                          })
                        } else if (re.data.msg == 'buroerror') {
                          wx.navigateTo({
                            url: '../tipview/tipview?status=buro_not_match',
                          })
                        } else {
                          wx.navigateTo({
                            url: 'dev_zjts/dev_zjts?id=' + id,
                          })
                        }
                      }
                    });
                  }
                }

              } else {
                wx.navigateTo({ url: '../tipview/tipview?status=wx' });
              }
            }
          }
        },
      });
    }
  },
})