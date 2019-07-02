Page({
  data: {
    title: '',
    resultView: '',
    button: '返回调试页',
    onButtonTap: 'handleBack',
    devno:'',
    czh: '',
    sfxs:''
  },
  handleBack(e) {
    const { dataset } = e.currentTarget;
    wx.showToast({
      content: '1秒后返回调试页',
      success: res => {
        setTimeout(() => {
          // wx.navigateBack({
          //   delta:1
          //});
          wx.switchTab({ url: '../zjts/zjts' });
          //wx.redirectTo({ url: dataset.href });
        }, 500);
      },
    });
  },
  onLoad(option) {
    // 根据页面传过来的参数自定义显示内容
    var st = option.status;
    console.log(st);
    if (st == '0') {
      this.setData({
        title: '温馨提醒',
        resultView: '调试插座时请扫插座二维码！',
      })
    } else if (st == '1') {
      this.setData({
        title: '温馨提醒',
        resultView: '装接充电桩时请扫设备二维码',
      })
    } else if (st == '2') {
      this.setData({
        title: '温馨提醒',
        resultView: '装接电能表时请扫电能表上条形码',
      })
    } else if (st == '7') {
      this.setData({
        title: '调试插座温馨提醒',
        resultView: '该充电插座二维码无效或该充电插座不在管辖范围内！',
        devno: option.devno,
        czh: option.czh,
        sfxs:'1'
      })
    }else if (st == '8') {
      this.setData({
        title: '调试插座温馨提醒',
        resultView: '该充电插座不可用（设备离线），请确定设备为在线状态！',
        devno: option.devno,
        czh: option.czh,
        sfxs: '1'
      })
    } else if (st == '9') {
      this.setData({
        title: '调试插座温馨提醒',
        resultView: '该充电插座正在检修，请确定设备为在线状态！',
        devno: option.devno,
        czh: option.czh,
        sfxs: '1'
      })
    }else if (st == 'wx') {
      this.setData({
        title: '温馨提醒',
        resultView: '该二维码无效！',
      })
    } else if (st == 'buro_not_match'){
      this.setData({
        title: '温馨提醒',
        resultView: '请扫描本单位下的设备码！',
      })
    }
  }
  ,
});
