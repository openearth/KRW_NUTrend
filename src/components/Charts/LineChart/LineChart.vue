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
        initOptions: { height: '450px', width:'1200px' },
        seriesStyle: {
          symbolSize: 0,
          type: 'line',
          lineStyle: { width: 3 },
        },
        seriesName: [ '3-jarig \nZomergemiddelde', 'Jaargemiddelde', 'Zomergemiddelde' ],
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
      lineChartData() {
        return this.data.find(data => data.name === 'lines')
      },
      areas() {
        return mapChartAreas(this.lineChartData.areas, this.maxValue)
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
          max: this.maxValue,
        }
      },
      series() {
        return this.getSeriesData(this.lineChartData.series)
      },
      maxValue() {
        return this.getMaxValueOfSeries(this.lineChartData.maxValues)
      },
      markAreas() {
        return this.areas.map(area => createChartMarkAreas(area))
      },
    },
    methods: {
      getSeriesData(data) {
        return data.map((serie, index) => ({
          ...this.seriesStyle,
          name: this.seriesName[index],
          data: serie,
          itemStyle: {
            color: this.seriesColors[index],
          },
        }))
      },
      getMaxValueOfSeries(values) {
        let floatValues = values.map(parseFloat)

        return Math.ceil(Math.max(...floatValues))
      },
      formatMaxY(max) {
        const formattedMax = Math.ceil((max + 1))
        return formattedMax
      },
    },
  }
</script>
