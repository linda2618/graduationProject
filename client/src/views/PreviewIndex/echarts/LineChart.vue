<template>
    <div class="line-wrap">
        <Vcharts ref="chart" :option="option" height="350px" width="1060px" />
    </div>
</template>

<script>
import Vcharts from '../../../components/echarts/index.vue';

export default {
    components: {
        Vcharts,
    },
    data() {
        return {
            option: {
                left: '10%', // 距离左侧边界
                tooltip: {
                    axisPointer: {
                        type: 'line',
                        lineStyle: {
                            width: 0.5, // 指示线的宽度
                            color: 'rgba(230, 230, 230)', // 指示线的颜色
                            type: 'dotted',
                        },
                    },
                    trigger: 'axis',
                    backgroundColor: 'rgba(0, 0, 0, .7)', // 设置背景颜色
                    textStyle: {
                        color: 'white', // 设置文字颜色
                    },
                    formatter: this.formatter,
                },
                xAxis: [
                    {
                        type: 'category',
                        data: ['-'],
                        name: '商品及单价',
                        nameLocation: 'middle',
                        nameTextStyle: {
                            // 文字样式
                            fontSize: '15px',
                            color: 'rgba(118, 113, 113)',
                            padding: [6, 6, 6, 940],
                        },
                        axisPointer: {
                            value: 'Sun',
                            lineStyle: {
                                color: '#7581BD',
                                width: 2,
                            },
                        },
                    },
                    {
                        data: [],
                        position: 'bottom',
                        offset: 25,
                        axisLine: {
                            show: false,
                        },
                        axisTick: {
                            show: false,
                        },
                        isLabel: {
                            show: false,
                        },
                    },
                ],
                yAxis: {
                    type: 'value',
                    axisLabel: {
                        formatter: '{value}%',
                    },
                    splitLine: {
                        show: true,
                        lineStyle: {
                            type: 'dashed', // 设为虚线
                            // 可以进一步自定义虚线的具体样式
                        },
                    },
                    name: '销售额占比',
                    nameLocation: 'middle',
                    nameGap: 28, // 与轴线间距
                    nameTextStyle: {
                        // 文字样式
                        fontSize: '14px',
                        color: 'rgba(118, 113, 113)',
                        padding: [0, 0, 20, 170],
                    },
                },
                series: [
                    {
                        data: [],
                        type: 'bar',
                        color: '#61A5E8',
                        symbolSize: 3,
                        symbol: 'circle',
                        lineStyle: {
                            normal: {
                                color: '#61A5E8', // 设置实线的颜色
                            },
                        },
                        areaStyle: {
                            color: {
                                type: 'linear',
                                x: 0,
                                y: 0,
                                x2: 0,
                                y2: 1,
                                colorStops: [
                                    {
                                        offset: 0, color: '#409eff', //   0% 处的颜色
                                    }, {
                                        offset: 1, color: 'rgba(184, 217, 251)', // 100% 处的颜色
                                    }],
                                global: false, // 缺省为 false
                            },
                        },
                        smooth: true,
                        markLine: {
                            symbol: 'none',
                            data: [
                                {
                                    xAxis: 7,
                                    label: {
                                        position: 'end',
                                        formatter: '销售量第一',
                                        color: '#000',
                                    },
                                    lineStyle: { color: '#ccc' },
                                },
                                {
                                    xAxis: 2,
                                    label: {
                                        position: 'end',
                                        formatter: '销售量倒数第一',
                                        color: '#000',
                                    },
                                    lineStyle: { color: '#ccc' },
                                }
                            ],
                        },
                    },
                ],
            },
            priceDetails: [
                {
                    rank: 29,
                    price: 2.3,
                    adCostRatio: '232.30%',
                    priceInc: '土豆',
                    exposeNum: 8666630,
                    exposeInc: 0.2574,
                },
                {
                    rank: 28,
                    price: 4.8,
                    adCostRatio: '241.79%',
                    priceInc: '茄子',
                    exposeNum: 13446427,
                    exposeInc: 0.1521,
                },
                {
                    rank: 27,
                    price: 5.5,
                    adCostRatio: '249.35%',
                    priceInc: '娃娃菜',
                    exposeNum: 12003221,
                    exposeInc: 0.0284,
                },
                {
                    rank: 26,
                    price: 5.6,
                    adCostRatio: '249.69%',
                    priceInc: '菠菜',
                    exposeNum: 0,
                    exposeInc: 0.2342,
                },
                {
                    rank: 25,
                    price: 7.7,
                    adCostRatio: '254.95%',
                    priceInc: '瓜子',
                    exposeNum: 5578502,
                    exposeInc: 0.5220,
                },
                {
                    rank: 24,
                    price: 8.8,
                    adCostRatio: '256.07%',
                    priceInc: '萝卜',
                    exposeNum: 2114282,
                    exposeInc: 0.6188,
                },
                {
                    rank: 23,
                    price: 10,
                    adCostRatio: '263.96%',
                    priceInc: '焦糖瓜子',
                    exposeNum: 0,
                    exposeInc: 0.3421,
                },
                {
                    rank: 21,
                    price: 9.9,
                    adCostRatio: '288.01%',
                    priceInc: '黄瓜',
                    exposeNum: 1065273,
                    exposeInc: 0.9087,
                },
                {
                    rank: 20,
                    price: 9.9,
                    adCostRatio: '288.89%',
                    priceInc: '白菜',
                    exposeNum: 5639682,
                    exposeInc: 0.8168,
                },
                {
                    rank: 19,
                    price: 15,
                    adCostRatio: '307.58%',
                    priceInc: '葡萄干',
                    exposeNum: 2349867,
                    exposeInc: 0.6987,
                },
                {
                    rank: 14,
                    price: 19.9,
                    adCostRatio: '335.15%',
                    priceInc: '苹果',
                    exposeNum: 12130337,
                    exposeInc: 0.7393,
                },
                {
                    rank: 14,
                    price: 35,
                    adCostRatio: '335.15%',
                    priceInc: '草鱼',
                    exposeNum: 12130337,
                    exposeInc: 0.0393,
                },
                {
                    rank: 13,
                    price: 39.9,
                    adCostRatio: '336.36%',
                    priceInc: '草莓',
                    exposeNum: 0,
                    exposeInc: 0.3498,
                },
                {
                    rank: 11,
                    price: 40,
                    adCostRatio: '372.95%',
                    priceInc: '牛奶草莓',
                    exposeNum: 12125631,
                    exposeInc: 0.3389,
                },
                {
                    rank: 10,
                    price: 69,
                    adCostRatio: '412.07%',
                    priceInc: '碧根果',
                    exposeNum: 0,
                    exposeInc: 0.0789,
                },
                {
                    rank: 9,
                    price: 89,
                    adCostRatio: '418.56%',
                    priceInc: '开心果',
                    exposeNum: 15979099,
                    exposeInc: 0.0991,
                },
                {
                    rank: 8,
                    price: 139,
                    adCostRatio: '436.05%',
                    priceInc: '榴莲',
                    exposeNum: 12349720,
                    exposeInc: 0.1081,
                },
            ]
        };
    },
    mounted() {
        this.setOptionAxis();
    },
    methods: {
        // 封装数据，用于x轴/y轴展示
        setOptionAxis() {
            this.option.xAxis[0].data = this.priceDetails.map((item) => `${item.priceInc}`);
            this.option.xAxis[1].data = this.priceDetails.map((item) => item.price);
            this.option.series[0].data = this.priceDetails.map((item) => (item.exposeInc * 100).toFixed(2));
            
            // const max = Math.max(
            //     ...this.option.series[0].data.map((value) => value ),
            // );
            // const min = Math.min(
            //     ...this.option.series[0].data.map((value) => value),
            // );
            // const maxIndex = this.option.series[0].data.findIndex((value) => {
            //     const ratio = value
            //     return ratio === max;
            // });
            // const minIndex = this.option.series[0].data.findIndex((value) => {
            //     const ratio = value
            //     return ratio === min;
            // });
            // this.setOptionSeries(maxIndex, minIndex);
        },

        setOptionSeries(priceIndex, ecpmIndex) {
            this.option.series[0].markLine.data.push({
                xAxis: 10,
                label: {
                    position: 'end',
                    formatter: '销售量第一',
                    color: '#000',
                },
                lineStyle: { color: '#ccc' },
            });
            this.option.series[0].markLine.data.push({
                xAxis: 5.5,
                label: {
                    position: 'end',
                    formatter: '销售量倒数第一',
                    color: '#000',
                },
                lineStyle: { color: '#ccc' },
            });
        },

        // 浮窗展示数据
        formatter(data) {
            // 根据dataIndex获取对应数据
            const { dataIndex } = data[0];
            console.log(data, data[0], dataIndex, 'data-data')
            return `<div>
                123123
                </div>
            `;
        },
    },
};
</script>

<style lang="scss" scoped>
.line-wrap {
    position: relative;
}

@media screen and (max-width: 600px) {
    .nameTextStyle {
        font-size: 12px;
        padding: 0 0 20px 10%;
    }
}
</style>
