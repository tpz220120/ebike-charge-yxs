import * as echarts from '../../ec-canvas/echarts';
var app = getApp();
Page({
  data: {
    type:'month',
    tycdzs: '',//投运充电站数量
    tycdsbs: '',//投运充电设备数量
    tycdczs: '',//投运充电插座数量
    ljcdcs: '',//累计服务多少人次充电
    ljcdsr: '',//收取多少充电费用
    showD:'',
    ec: {
      lazyLoad: true // 延迟加载
    },
    ecLine:{
      lazyLoad: true // 延迟加载
    }
  },

  onLoad() {
  },

  onShow(){
    this.echartsComponnet = this.selectComponent('#mychart-dom-bar');
    this.echartsComponnetPie = this.selectComponent('#mychart-dom-bar2');
    this.showInfo();
    this.getData(); //获取数据
  },

  //充电收入与充电次数曲线
  getData: function () {
    this.echartsComponnet.init((canvas, width, height) => {
      // 初始化图表
      const chart = echarts.init(canvas, null, {
        width: width,
        height: height + 30
      });

      this.setOption(chart);
      
      return chart;
    });
  },
  showInfo() {
    wx.showLoading({
      title: '正在加载中',
    })
    let that = this;
    // 分析描述与组成，以及
    wx.request({
      url: app.httpUrl + '/yysTab/getZbsj.x',
      data: {
        orgno: app.globalData.user_org_no,
        sfpt: app.globalData.sfpt
      },
      success: (re) => {
        console.log(re.data);
        const zbjs = re.data;
        if (typeof (zbjs.PTS_CS_CNT) == 'undefined'){
          that.setData({
            tycdzs: 0,
            tycdsbs: 0,
            tycdczs: 0,
            ljcdcs: 0,
            ljcdsr: 0,
            showD: zbjs.data,
          });
        }else{
          that.setData({
            tycdzs: zbjs.PTS_CS_CNT,
            tycdsbs: zbjs.PTS_CD_CNT,
            tycdczs: zbjs.PTS_CP_CNT,
            ljcdcs: zbjs.CUMCRG_TOTAL_CNT,
            ljcdsr: zbjs.INCOME_TOTAL,
            showD: zbjs.data,
          });
        }
        // 电站建设情况饼图
        this.echartsComponnetPie.init((canvas, width, height) => {
          // 初始化图表
          const chart = echarts.init(canvas, null, {
            width: width,
            height: height+30
          });

          this.setPieOption(chart, zbjs);
          return chart;
        });

        wx.hideLoading();
      }
    });
  },

  // 年月切换时候
  reLine(e) {
    wx.showLoading({
      title: '正在加载中',
    })
    var type = e.currentTarget.dataset.type;
    this.setData({
      type: type,
    })

    this.echartsComponnet.init((canvas, width, height) => {
      // 获取组件的 canvas、width、height 后的回调函数
      // 在这里初始化图表
      const chart = echarts.init(canvas, null, {
        width: width,
        height: height + 30
      });
      this.setOption(chart);
      // 注意这里一定要返回 chart 实例，否则会影响事件处理等
      wx.hideLoading();
      return chart;
    });
  },
  setOption: function (chart) {
    var areaStyle = {
      normal: {
        color: {
          type: 'linear',
          x: 0,
          y: 0,
          x2: 0,
          y2: 1,
          colorStops: [{
            offset: 0.5, color: '#66caff' // 0% 处的颜色
          }, {
            offset: 1, color: 'rgba(255,255,255,0.1)' // 100% 处的颜色
          }],
          globalCoord: false // 缺省为 false
        }
      }
    };

    var areaStyle2 = {
      normal: {
        color: {
          type: 'linear',
          x: 0,
          y: 0,
          x2: 0,
          y2: 1,
          colorStops: [{
            offset: 0.5, color: '#8ae5d6' // 0% 处的颜色
          }, {
            offset: 1, color: 'rgba(255,255,255,0.1)' // 100% 处的颜色
          }],
          globalCoord: false // 缺省为 false
        }
      }
    };
    var that = this;
    wx.request({
      url: app.httpUrl + '/yysTab/getCdqs.x',
      data: {
        orgno: app.globalData.user_org_no,
        sfpt: app.globalData.sfpt,
        type: that.data.type
      },
      success: (re) => {
        console.log(re.data);
        var interval;

        if (that.data.type == 'month') {
          interval = 3;
        }else{
          interval =1;
        }
        var option = {
          //color: ["#37A2DA", "#67E0E3"],
          legend: {
            data: ['充电次数', '充电收入'],
            top: 10,
            left: 'center',
            z: 100
          },

          grid: {
            top: '12%',
            left: '3%',
            right: '3%',
            bottom: '10%',
            containLabel: true
          },

          tooltip: {
            trigger: 'axis',
            position: function (p) {
              // 位置回调
              // console.log && console.log(p);
              return [p[0] - 50, p[1] - 10];
            },
            axisPointer: {            // 坐标轴指示器，坐标轴触发有效
              type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
            }
          },

          xAxis: [
            {
              type: 'category',
              boundaryGap: false,
              axisLabel: {
                interval: interval
              },
              data: re.data.cdqsNums//['周一','周二','周三','周四','周五','周六','周日']
            }
          ],
          yAxis: {
            x: 'center',
            type: 'value',
            splitNumber: 3,
            splitLine: {
              lineStyle: {
                type: 'dashed'
              }
            }
            // show: false
          },
          //y轴数据又空时("",null等)，会出现点击空界面显示空白的情况
          series: [{
            name: '充电次数',
            type: 'line',
            smooth: true,
            data: re.data.cdqs.cdcs,
            itemStyle: {
              normal: {
                color: '#58dbc5',
              }
            },
            lineStyle: {
              normal: {
                color: '#58dbc5',
              }
            },
            areaStyle: areaStyle2,
          }, {
            name: '充电收入',
            type: 'line',
            smooth: true,
            // label: {
            //   normal: {
            //     show: true,
            //     position: 'top'
            //   }
            // },
            areaStyle: areaStyle,

            itemStyle: {
              normal: {
                color: '#5291ff',
              }
            },
            lineStyle: {
              normal: {
                color: '#5291ff',
              }
            },

            data: re.data.cdqs.cdys
          }]
        };

        chart.setOption(option);
        
      }
    });
  },

  setPieOption: function (chart, zbjs) {
    var option = {
      tooltip: {
        trigger: 'item',
        formatter: "{b}: {c}个插座"
      },
      legend: {
        orient: 'vertical',
        left: '3%',
        top: '10%',
        itemGap: 15,
        data: ['使用中', '未使用', '正在检修', '不可用/离线'],
        textStyle: {
          color: '#646464',
          fontSize: 12
        }
      },
      series: [
        {
          type: 'pie',
          center: ['60%', '50%'],
          radius: '60%',
          label: {
            normal: {
              show: true,
              position: 'outside',
              color: '#646464',
              formatter: '{d}%',
              fontFamily: 'NotoSansHans-Regular',
              fontSize: 12
            }
          },
          x: '50%',
          data: [
            {
              name: '使用中', value: zbjs.BEUSING_CP_CNT, itemStyle: {
                normal: { color: '#65C0FD' }
              }
            },
            {
              name: '未使用', value: zbjs.USABLE_CP_CNT, itemStyle: {
                normal: { color: '#76ECC0' }
              }
            },
            {
              name: '正在检修', value: zbjs.BEREPAIRING_CP_CNT, itemStyle: {
                normal: { color: '#FFDA61' }
              }
            },
            {
              name: '不可用/离线', value: zbjs.UNUSABLE_CP_CNT, itemStyle: {
                normal: { color: '#FF8166' }
              }
            }
          ]
        }
      ]
    };
    chart.setOption(option);
  },
});
