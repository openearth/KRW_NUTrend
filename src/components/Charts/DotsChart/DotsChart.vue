<template>
  <v-chart
    v-if="dotsChartData"
    class="dots-chart"
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
        initOptions: {
          height: '400px',
        },
        seriesStyle: {
          symbol: 'circle',
          symbolSize: 7,
          type: 'line',
          lineStyle: {
            width: 0,
          },
          itemStyle: {
            color: 'black',
          },
        },
        areas: [
          { name: 'Goed', color: 'rgb(181, 239, 181)', min: '3.5', max: '4.5' },
          { name: 'Matig', color: 'rgb(240, 240, 133)', min: '2.5', max: '3.5' },
          { name: 'Ontoereikend', color: 'rgb(255, 210, 128)', min: '1.5', max: '2.5' },
          { name: 'Slecht', color: 'rgb(233, 158, 160)', min: '0.5', max: '1.5' },
        ],
      }
    },
    computed: {
      ...mapState('charts', [
        'data',
      ]),
      baseOptions() {
        return {
          title: {
            text: this.title,
          },
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
          yAxis: {
            type: 'value',
            min: '0',
            max: '5',
          },
        }
      },
      dotsChartData() {
        return this.data.find(data => data.name === 'dots')
      },
      filterdData() {
        return this.dotsChartData.series
          .filter(item => item.value > -1)
      },
      options() {
        return {
          ...this.baseOptions,
          xAxis: this.xAxis,
          series: [
            this.series,
            ...this.markAreas,
          ],
        }
      },
      xAxis() {
        return {
          type: 'category',
          boundaryGap: false,
          data: this.filterdData.map(item => item.label),
        }
      },
      series() {
        return {
          ...this.seriesStyle,
          data: this.filterdData.map(item => parseFloat(item.value, 10)),
        }
      },
      markAreas() {
        return this.areas.map(area => createChartMarkAreas(area))
      },
    },
  }
</script>
