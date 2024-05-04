<template>
  <div
    ref="charts"
    :style="style"
  />
</template>

<script>
/**
 * 该组件增加了对option和option的timestamp的属性的watch，然后对图表setOption
 * 增加了对window resize事件的监听，然后resize图表
*/
import loadEcharts from './echarts';
import theme from './theme';
import { listener, handleCopy } from './copyUtil.js';

export default {
  mixins: [listener],
  props: {
    width: {
      type: String,
      default: '',
    },
    height: {
      type: String,
      default: '',
    },
    option: {
      type: Object,
      default: null,
    },
    // 双击拷贝数据功能
    dbclickCopy: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      myChart: null,
      observer: null,
    };
  },
  computed: {
    style() {
      return {
        width: this.width,
        height: this.height,
      };
    },
  },
  watch: {
    option: {
      handler() {
        if (this.myChart && this.option) {
          this.myChart.setOption(this.option, true);
        }
      },
      deep: true,
    },
    'option.timestamp': function watchFn() {
      if (this.myChart) this.myChart.setOption(this.option, true);
    },
    height() {
      if (this.myChart) this.myChart.resize({ height: this.height });
    },
  },
  mounted() {
    loadEcharts((echarts) => {
      echarts.registerTheme('walden', theme);
      if (!this.$refs.charts) return;
      this.myChart = echarts.init(this.$refs.charts, 'walden');
      this.myChart.on('finished', () => {
        this.$emit('finished');
      });
      this.myChart.setOption(this.option);
      this.$emit('created', this.myChart);
      if (this.dbclickCopy) {
        this.myChart.on('dblclick', this.copySeriesData.bind(this));
      }

      this.myChart.on('legendselectchanged', (params) => {
        // 获取点击图例的选中状态
        const isSelected = params.selected[params.name];
        // 在控制台中打印
        // eslint-disable-next-line no-console
        console.log((isSelected ? '选中了' : '取消选中了') + params.name);
        // 打印所有图例的状态
        // console.log(params.selected);
        this.$emit('legendSelectd', params.selected);
      });

      this.myChart.on('click', (params) => {
        this.$emit('handleClick', params);
      });
    });

    this.resizeHandle = this.debounce(() => {
      if (this.myChart) { this.myChart.resize(); }
    }, 300);
    this.observerCb = this.debounce((mutationList) => {
      mutationList.forEach((mutation) => {
        if (mutation.type === 'attributes') { this.resizeHandle(); }
      });
    }, 300);

    const targetNode = document.getElementById('bodySidebar');
    const config = { attributes: true, childList: true, subtree: true };
    this.observer = new MutationObserver(this.observerCb);
    // 保证targetNode为node节点
    if (targetNode) {
      this.observer.observe(targetNode, config);
    }

    window.addEventListener('resize', this.resizeHandle);
    window.addEventListener('CustomResize', this.resizeHandle);
    window._resize = this.resizeHandle();
  },
  beforeDestroy() {
    if (this.myChart) this.myChart.off('dblclick');
    window.removeEventListener('resize', this.resizeHandle);
    window.addEventListener('CustomResize', this.resizeHandle);
    this.observer.disconnect();
  },
  methods: {
    copySeriesData(seriesItem) {
      const option = this.myChart.getOption();
      const { dataIndex } = seriesItem;
      const { series } = option;
      const noLegend = !option.legend[0];
      let legendSelectedMap;
      if (!noLegend) {
        legendSelectedMap = option.legend[0].selected;
      }
      const textArr = series.reduce((arr, seriesOne) => {
        const indicName = seriesOne.name;
        if (noLegend || legendSelectedMap[indicName] !== false) {
          let value = seriesOne.data[dataIndex];
          value = typeof value === 'object' ? value.value : value;
          arr.push(`${indicName}:${value}`);
        }
        return arr;
      }, [seriesItem.name]);
      handleCopy(textArr.join('\n'));
    },
    debounce(func, wait) {
      let timeout;
      return (...args) => {
        clearTimeout(timeout);
        return new Promise((resolve, reject) => {
          timeout = setTimeout(async () => {
            timeout = null;

            try {
              resolve(await func.apply(this, args));
            } catch (ex) {
              reject(ex);
            }
          }, wait);
        });
      };
    },
    onEvent(eName, cb) {
      this.myChart.on(eName, cb);
    },
    getlegendselect() {
      if (this.myChart) {
        //----
        this.myChart.on('legendselectchanged', (params) => {
          // 获取点击图例的选中状态
          const isSelected = params.selected[params.name];
          // 在控制台中打印
          // eslint-disable-next-line no-console
          console.log((isSelected ? '选中了' : '取消选中了') + params.name);
          // 打印所有图例的状态
          // console.log(params.selected);
          this.$emit('legendSelectd', params.selected);
        });
      }
    },
  },
};
</script>
