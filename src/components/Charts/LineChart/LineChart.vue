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
        initOptions: { height: '400px' },
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
      filterdData() {
        return this.getFilteredData(this.lineChartData.series)
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
          type: 'category',
          boundaryGap: false,
          data: this.getXAxisData(this.filterdData),
        }
      },
      yAxis() {
        return {
          type: 'value',
          min: this.areas[0].min,
          max: this.areas[3].max,
        }
      },
      series() {
        return this.getSeriesData(this.filterdData)
      },
      markAreas() {
        return this.areas.map(area => createChartMarkAreas(area))
      },
    },
    methods: {
      getFilteredData(series) {
        return series.map((serie) => serie.filter(item => item.value > -1))
      },
      getXAxisData(data) {
        const flattenedData = data
          .map(serie => serie.map(item => parseFloat(item.label, 10)))
          .flat()
          .sort()
        return [ ...new Set(flattenedData) ]
      },
      getSeriesData(data) {
        return data.map((serie, index) => ({
          ...this.seriesStyle,
          data: serie.map(item => parseFloat(item.value, 10)),
          itemStyle: {
            color: this.seriesColors[index],
          },
        }))
      },
    },
  }
</script>
