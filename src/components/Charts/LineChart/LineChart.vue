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
    LegendComponent,
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
    LegendComponent,
  ])

  export default {
    name: 'LinesChart',
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
        initOptions: { height: '450px', width:'1200px' },
        seriesStyle: {
          symbolSize: 0.5,
          type: 'line',
          lineStyle: { width: 3 },
        },
        seriesColors: [ 'magenta', 'cyan', 'black' ],
      }
    },
    computed: {
      ...mapState('charts', [
        'data',
      ]),
      ...mapState('filters', [
        'selectedParticle',
      ]),
      baseOptions() {
        return {
          title: { text: this.title },
          tooltip: {
            trigger: 'axis',
          },
          grid: {
            top: '40px',
            right: '280px',
            bottom: '8px',
            left: 10,
            containLabel: true,
            backgroundColor: '#fff',
          },
          legend: {
            orient: 'vertical',
            right: '5%',
            padding: [ 40,10,10,20 ],
            itemGap:20,
            itemWidth: 20,
            itemHeight: 10,
            icon: 'rect',
            itemStyle: {
              borderColor: '#000000',
              borderType: 'solid',
              borderWidth: 0.5,
            },
          },
        }
      },
      seriesName() {
        if (this.selectedParticle === 'din') {
          return [ '3-jarig \nWintergemiddelde', 'Jaargemiddelde', 'Wintergemiddelde' ] 
        } else if (this.selectedParticle === 'nh4' || this.selectedParticle === 'no3') {
          return [ 'Jaargemiddelde', 'Zomergemiddelde', 'Wintergemiddelde' ]
        } else {
          return [ '3-jarig \nZomergemiddelde', 'Jaargemiddelde', 'Zomergemiddelde' ]
        }
      },

      lineChartData() {
        const chartData = this.data.find(data => data.name === 'lines')
        return chartData
      },
      areas() {
        if (!this.lineChartData.areas) {
          return []
        }
        return mapChartAreas(this.lineChartData.areas, this.maxValue)
      },
      options() {
        return {
          ...this.baseOptions,
          xAxis: this.xAxis,
          yAxis: this.yAxis,
          series: [
            ...this.series,
            ...(this.markAreas.length > 0 ? this.markAreas : []),
          ],
        }
      },
      xAxis() {
        return {
          type: 'time',
          min: '1991',
          max: '2025',
        }
      },
      yAxis() {
        return {
          type: 'value',
          min: this.areas && this.areas.length > 0 
            ? parseFloat(this.areas[0].min)
            : 0,
          max: this.maxValue,
        }
      },
      series() {
        const seriesData = this.getSeriesData(this.lineChartData.series)
        return seriesData
      },
      maxValue() {
        return this.getMaxValueOfSeries(this.lineChartData.maxValues)
      },
      minValue() {
        return this.getMinValueOfSeries(this.lineChartData.minValues)
      },
      markAreas() {
        if (!this.areas) {
          return []
        }
        return this.areas.map(area => createChartMarkAreas(area))
      },
    },
    methods: {
      getSeriesData(data) {
        const result = data.map((serie, index) => ({
          ...this.seriesStyle,
          name: this.seriesName[index],
          data: serie,
          itemStyle: {
            color: this.seriesColors[index],
          },
        }))
        return result
      },
      getMaxValueOfSeries(values) {
        let floatValues = values.map(parseFloat)

        return this.roundMax(Math.max(...floatValues))
      },
      getMinValueOfSeries(values) {
        if (!values || !values.length) {
          return 0
        }
        let floatValues = values.map(parseFloat)

        return Math.min(...floatValues)
      },
      formatMaxY(max) {
        const formattedMax = Math.ceil((max + 1))
        return formattedMax
      },
      roundMax(number) {
        let power = Math.pow(10, 1)
        return Math.ceil(number * power) / power
      },
    },
  }
</script>
