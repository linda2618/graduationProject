import { FunnelChart } from 'echarts/charts';

export default async function loadEcharts(callback) {
  const echarts = await import('echarts/lib/echarts');

  await Promise.all([
    import('echarts/lib/chart/bar'),
    import('echarts/lib/chart/line'),
    import('echarts/lib/chart/pie'),
    import('echarts/lib/chart/radar'),
    import('echarts/lib/chart/gauge'),
    import('echarts/lib/chart/sankey'),
    import('echarts/lib/chart/scatter'),
    import('echarts/lib/component/tooltip'),
    import('echarts/lib/component/title'),
    import('echarts/lib/component/legend'),
    import('echarts/lib/component/toolbox'),
    import('echarts/lib/component/dataZoom'),
    import('echarts/lib/component/markLine'),
    import('echarts/lib/component/visualMap'),
  ]);
  echarts.use([FunnelChart]);
  callback(echarts);
  return echarts;
}
