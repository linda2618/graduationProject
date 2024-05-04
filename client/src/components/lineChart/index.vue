<template>
  <div class="line-wrap">
    <span
      v-if="lineData.name"
      class="title"
    >{{ lineData.name }}</span>
    <Vcharts
      :option="options"
      :style="[styleObj]"
    />
  </div>
</template>

<script>
import Vcharts from 'src/components/echarts';
import { DEF_LINE_CHART_OPTIONS } from '@/const/chart';

export default {
  components: {
    Vcharts,
  },
  props: {
    lineData: {
      type: Object,
      default: () => ({}),
    },
    list: {
      type: Array,
      default: () => ([]),
    },
    option: {
      type: Object,
      default: () => ({}),
    },
    styleObj: {
      type: Object,
      default: () => ({
        height: '400px',
        width: '100%',
      }),
    },
  },
  computed: {
    options() {
      // 可以通过lineData快捷设置经常需要改变的 xAxis.name 、 yAxis.name 、 tooltip.formatter
      if (this.lineData.xName) DEF_LINE_CHART_OPTIONS.xAxis.name = this.lineData.xName;
      if (this.lineData.yName) DEF_LINE_CHART_OPTIONS.yAxis.name = this.lineData.yName;
      if (this.lineData.formatter) {
        DEF_LINE_CHART_OPTIONS.tooltip.formatter = this.lineData.formatter;
      }
      return { ...DEF_LINE_CHART_OPTIONS, ...this.option, ...this.$attrs };
    },
  },
  watch: {
    lineData: {
      handler() {
        this.renderChart();
      },
      deep: true,
    },
    list: {
      handler() {
        this.renderChart();
      },
      deep: true,
      immediate: true,
    },
  },
  methods: {
    renderChart() {
      this.options.xAxis.data = this.list.map((i) => i.name);
      if (this.options.series.length === 1) {
        this.options.series[0].data = this.list.map((i) => i.value);
        const maxLine = Math.max(...this.list.map((i) => i.value));
        this.options.yAxis.max = maxLine * 2;
      } else {
        // 根据series中data的值设置多条线的数据中options中yAxis.max的值
        const arr = this.options.series.map((i) => i.data).flat();
        const maxLine = Math.max(...arr);
        this.options.yAxis.max = Math.ceil(maxLine * 1.2);
      }
    },
  },
};
</script>
<style lang="less" scoped>
.line-wrap {
  position: relative;
}

.title {
  position: absolute;
  font-size: 16px;
  text-align: center;
  width: 100%;
}
</style>
