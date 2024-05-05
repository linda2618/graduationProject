<template>
  <div>
    <h2>累计本月农产品的销售情况！如下：</h2>
    <div class="chart">
      <span class="chart-title">商品销售额展示</span>
      <BidAreaChart v-if="bar" />
      <LineChart v-if="line" />
    </div>
    <div class="title">
      <el-button type="info" class="search_button" @click="goBar">折线图展示</el-button>
      <el-button type="success" class="search_button" @click="goLine">柱状图展示</el-button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import BidAreaChart from './AreaChart.vue';
import LineChart from './LineChart.vue'

const bar = ref(true)
const line = ref(false)
const goBar = () => {
  line.value = false
  bar.value = true
}
const goLine = () => {
  bar.value = false
  line.value = true
}
</script>

<style lang="scss" scoped>
h2 {
  margin: 50px 0;
  color: rgba(144,
    147,
    153);
}

.chart {
  margin-top: 10px;
  position: relative;

  .chart-title {
    position: absolute;
    top: 10px;
    left: 30px;
    color: rgba(144,
          147,
          153);
  }
}
</style>
