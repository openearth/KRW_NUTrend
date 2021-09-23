<template>
  <div class="app-chart">
    <div v-if="isLoading" class="app-chart__loader">
      <v-progress-circular
        :size="50"
        color="primary"
        indeterminate
      />
    </div>
    <div v-else class="app-chart__canvas">
      <p>{{ title }}</p>
      <v-chart
        :init-options="initOptions"
        :option="options"
        autoresize
      />
    </div>
  </div>
</template>

<script>
  import { mapState } from 'vuex'
  import { use } from 'echarts/core'
  import { CanvasRenderer } from 'echarts/renderers'
  import { LineChart } from 'echarts/charts'
  import {
    GridComponent,
    TooltipComponent,
    LegendComponent,
    MarkAreaComponent,
  } from 'echarts/components'
  import VChart from 'vue-echarts'

  import createChartMarkAreas from '~/lib/create-chart-mark-areas'

  use([
    CanvasRenderer,
    GridComponent,
    LineChart,
    TooltipComponent,
    LegendComponent,
    MarkAreaComponent,
  ])

  const TIMEOUT_DURATION = 1000 // 1 second

  export default {
    name: 'AppChart',
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
        isLoading: true,
        initOptions: {
          height: '400px',
        },
        baseOptions: {
          grid: {
            top: '32px',
            right: '85px',
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
        },
        seriesStyle: {
          symbol: 'circle',
          symbolSize: 10,
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
      ...mapState('graphs', [
        'graphData',
      ]),
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
          data: this.graphData.map(item => item.label),
        }
      },
      series() {
        return {
          ...this.seriesStyle,
          data: this.graphData.map(item => parseInt(item.value, 10)).filter(value => value > -1),
        }
      },
      markAreas() {
        return this.areas.map(area => createChartMarkAreas(area))
      },
    },
    created() {
      setTimeout(() => {
        this.isLoading = false
      }, TIMEOUT_DURATION)
    },
  }
</script>

<style lang="scss">
  .app-chart {
    padding: $spacing-default;
  }

  .app-chart__canvas {
    width: 100%;
    height: 100%;
  }

  .app-chart__loader {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 400px;
  }
</style>
