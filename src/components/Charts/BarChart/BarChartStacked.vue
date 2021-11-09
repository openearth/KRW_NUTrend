<template>
  <v-chart
    v-if="chartData && legend.length"
    class="scatter-chart"
    :init-options="initOptions"
    :option="options"
    autoresize
  />
</template>
<script>
  import { mapState } from 'vuex'
  import { use } from 'echarts/core'
  import { CanvasRenderer } from 'echarts/renderers'
  import { BarChart } from 'echarts/charts'

  import {
    GridComponent,
    TitleComponent,
    LegendComponent,
    TooltipComponent,
  } from 'echarts/components'

  import VChart from 'vue-echarts'

  use([
    CanvasRenderer,
    GridComponent,
    BarChart,
    TitleComponent,
    LegendComponent,
    TooltipComponent,
  ])
 
  export default {
    name: 'BarChartStackedAreas',
    components: {
      VChart,
    },
    props: {
      title: {
        type: String,
        default: '',
      },
      chartData: {
        type: Object,
        default: null,
      },
    },
    data() {
      return {
        initOptions: { height: '400px' },
      }
    },
    computed: {
      ...mapState('layers', [ 'legend' ]),
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
          legend: {
            orient: 'vertical',
            x: 'right',
            right: '20%',
          },
        }
      },     
      options() {
        return {
          ...this.baseOptions,
          xAxis: this.xAxis,
          yAxis: this.yAxis,
          series: this.series,
        }
      },
      yAxis() {
        return {
          type: 'category',
          data: this.chartData.labels,
        }
      },
      xAxis() {
        return {
          type: 'value', 
        }
      },
      series() {
        const sample = [
          {
            name: 'Goed',
            type: 'bar',
            stack: 'total',
            label: {
              show: true,
            },
            emphasis: {
              focus: 'series',
            },
            data: this.chartData.goedData,
            color: this.legend.find(item => item.label==='goed').color,
          },
          {
            name: 'Matig',
            type: 'bar',
            stack: 'total',
            label: {
              show: true,
            },
            emphasis: {
              focus: 'series',
            },
            data: this.chartData.matigData,
            color: this.legend.find(item => item.label==='matig').color,
          },
          {
            name: 'Ontoereikend',
            type: 'bar',
            stack: 'total',
            label: {
              show: true,
            },
            emphasis: {
              focus: 'series',
            },
            data: this.chartData.ontoereikendData,
            color: this.legend.find(item => item.label==='ontoereikend').color,
          },
          {
            name: 'Slecht',
            type: 'bar',
            stack: 'total',
            label: {
              show: true,
            },
            emphasis: {
              focus: 'series',
            },
            data: this.chartData.slechtData,
            color: this.legend.find(item => item.label==='slecht').color,

          },
        ]
        return sample
      },

    },
  }

</script>