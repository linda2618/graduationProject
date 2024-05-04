export const DEF_LINE_CHART_TOOLTIP = {
  axisPointer: {
    type: 'line', // 显示垂直线
    lineStyle: {
      color: '#ccc', // 指示线的颜色，可自定义
      width: 1, // 指示线的宽度，可自定义
      type: 'solid', // 指示线的类型，可为 'solid', 'dashed', 'dotted'
    },
  },
  trigger: 'axis', // 当鼠标悬停在某个数据点上时，垂直于横坐标轴的位置（或横坐标刻度上）会触发显示提示框
  backgroundColor: 'rgba(0, 0, 0, .7)', // 设置背景颜色
  textStyle: {
    color: 'white', // 设置文字颜色
  },
};

export const DEF_LINE_CHART_OPTIONS = {
  left: '10%', // 距离左侧边界
  tooltip: DEF_LINE_CHART_TOOLTIP,
  xAxis: {
    type: 'category',
    data: [],
    name: '日期',
    nameLocation: 'end',
    nameTextStyle: { // 文字样式
      color: '#334155',
    },
  },
  yAxis: {
    type: 'value',
    splitLine: {
      show: true,
      lineStyle: {
        type: 'dashed', // 设为虚线
        // 可以进一步自定义虚线的具体样式
      },
    },
    name: '请求数',
    nameLocation: 'end',
    nameGap: 15, // 与轴线间距
    nameTextStyle: { // 文字样式
      color: '#334155',
    },
  },
  series: [
    {
      data: [15000, 230, 224, 218, 135, 147, 260],
      type: 'line',
      color: '#61A5E8',
      symbolSize: 7,
      symbol: 'circle',
      // smooth: true,
      lineStyle: {
        normal: {
          color: '#61A5E8', // 设置实线的颜色
        },
      },
    },
  ],
};