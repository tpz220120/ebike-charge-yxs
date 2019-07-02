import * as echarts from '../../../ec-canvas/echarts';
var app = getApp();
let chart = null;


Page({
  data: {
    dInfo: {},
    id:'',
    type:'',
    ec: {
      lazyLoad: true // 延迟加载
      //onInit: initChartLine
    },
  },

  onLoad(option) {
    console.log(option);
    this.echartsComponnet = this.selectComponent('#mychart-dom-bar');
    this.setData({
      id:option.id, 
      type:option.type
    })
  },

  onShow(){
    this.showInfo(this.data.id, this.data.type);
  },

  showInfo(id,type) {
    wx.showLoading({
      title: '正在加载中',
    })
    let that = this;
    wx.request({
      url: app.httpUrl + '/yysXcxUserCenter/getCdxq.x', // 该url是自己的服务地址，实现的功能是服务端拿到authcode去开放平台进行token验证
      data: {
        type: type,
        id: id
      },
      success: (re) => {
        console.log(re);

        that.setData({
          dInfo: re.data.info

        })

        this.echartsComponnet.init((canvas, width, height) => {
          // 初始化图表
          const chart = echarts.init(canvas, null, {
            width: width,
            height: height
          });

          this.setOption(chart, re.data);
          this.chart = chart;

          return chart;
        });

        wx.hideLoading();
      }
    });
  },

  setOption: function (chart, data) {

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
        var option = {
          //color: ["#37A2DA", "#67E0E3"],
          legend: {
            data: ['充电功率'],
            top: 10,
            left: 'center',
            z: 100
          },
          grid: {
            containLabel: true
          },

          tooltip: {
            show: true,
            trigger: 'axis'
          },

          xAxis: [
            {
              type: 'category',
              boundaryGap: false,
              // axisLabel: {
              //   interval: 2
              // },
              data: data.xSer//['周一','周二','周三','周四','周五','周六','周日']
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
          series: [{
            name: '充电功率',
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

            data: data.ySer
          }]
        };

        chart.setOption(option);
  }
});