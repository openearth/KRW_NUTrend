<template>
  <v-chart
    v-if="lineChartData"
    class="line-chart"
    :init-options="initOptions"
    :option="options"
    autoresize
  />
</template>

<script>

  import { mapState } from 'vuex'
  import { use } from 'echarts/core'
  import { CanvasRenderer } from 'echarts/renderers'
  import { LineChart } from 'echarts/charts'
  import {
    GridComponent,
    MarkAreaComponent,
    TitleComponent,
    TooltipComponent,
  } from 'echarts/components'
  import VChart from 'vue-echarts'

  import createChartMarkAreas from '~/lib/create-chart-mark-areas'
  import mapChartAreas from '~/lib/map-chart-areas'

  use([
    CanvasRenderer,
    GridComponent,
    LineChart,
    MarkAreaComponent,
    TitleComponent,
    TooltipComponent,
  ])

  export default {
    name: 'DotsChart',
    components: {
      VChart,
    },
    props: {
      title: {
        type: String,
        default: '',
      },
    },
    data() {
      return {
        initOptions: { height: '450px', width:'1000px' },
        seriesStyle: {
          symbolSize: 0,
          type: 'line',
          lineStyle: { width: 3 },
        },
        seriesColors: [ 'black', 'white', 'blue' ],
      }
    },
    computed: {
      ...mapState('charts', [
        'data',
      ]),
      baseOptions() {
        return {
          title: { text: this.title },
          tooltip: {
            trigger: 'axis',
          },
          grid: {
            top: '40px',
            right: '90px',
            bottom: '8px',
            left: '8px',
            containLabel: true,
            backgroundColor: '#fff',
          },
        }
      },
      lineChartData() {
        return this.data.find(data => data.name === 'lines')
      },
      areas() {
        return mapChartAreas(this.lineChartData.areas)
      },
      options() {
        return {
          ...this.baseOptions,
          xAxis: this.xAxis,
          yAxis: this.yAxis,
          series: [
            ...this.series,
            ...this.markAreas,
          ],
        }
      },
      xAxis() {
        return {
          type: 'time',
          min: '1991',
          max: '2022',
        }
      },
      yAxis() {
        return {
          type: 'value',
          min: parseFloat(this.areas[0].min),
          max: this.formatMaxY(parseFloat(this.areas[3].max)),
        }
      },
      series() {
        return this.getSeriesData(this.lineChartData.series)
      },
      markAreas() {
        return this.areas.map(area => createChartMarkAreas(area))
      },
    },
    methods: {
      getSeriesData(data) {
        return data.map((serie, index) => ({
          ...this.seriesStyle,
          data: serie,
          itemStyle: {
            color: this.seriesColors[index],
          },
        }))
      },
      formatMaxY(max) {
        const formattedMax = Math.ceil((max + 1))
        return formattedMax
      },
    },
  }
</script>
