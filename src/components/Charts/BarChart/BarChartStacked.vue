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
  import checkTitleForPercentage from '~/lib/toestand-graphs-utils/check-title-for-percentage'

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
        initOptions: { height: '450px', width:'1000px' },
      }
    },
    computed: {
      ...mapState('layers', [ 'legend' ]),
      baseOptions() {
        return {
          title: { text: this.title, padding:[ 0,0,0,80 ] },
          tooltip: {
            trigger: 'axis',
          },
          grid: {
            top: '40px',
            right: '150px',
            bottom: '8px',
            left: 80,
            containLabel: true,
            backgroundColor: '#fff',
          },
          legend: {
            orient: 'vertical',
            right: '2%',
            padding: [ 0,0,10,20 ],
            itemGap:20,
            itemWidth: 10,
            itemHeight: 10,
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
          max: !!this.percentageType ? 100 : null,
        }
      },
      series() {
        const sample = [
          {
            name: 'Goed',
            type: 'bar',
            stack: 'total',
            
            label: {
              fontSize: 10,
              show: true,
              color: 'black',
              formatter: function(param) {
                return param.data == 0 ? '': param.data
              },
            },
            data: this.chartData.goedData,
            color: this.legend.find(item => item.label==='goed').color,
          },
          {
            name: 'Matig',
            type: 'bar',
            stack: 'total',
            label: {
              fontSize: 10,
              show: true,
              color: 'black',
              formatter: function(param) {
                return param.data == 0 ? '': param.data
              },
            },
 
            data: this.chartData.matigData,
            color: this.legend.find(item => item.label==='matig').color,
          },
          {
            name: 'Ontoereikend',
            type: 'bar',
            stack: 'total',
            label: {
              fontSize: 10,
              show: true,
              color: 'black',
              formatter: function(param) {
                return param.data == 0 ? '': param.data
              },
            },

            data: this.chartData.ontoereikendData,
            color: this.legend.find(item => item.label==='ontoereikend').color,
          },
          {
            name: 'Slecht',
            type: 'bar',
            stack: 'total',
            label: {
              fontSize: 10,
              show: true,
              color: 'black',
              formatter: function(param) {
                return param.data == 0 ? '': param.data
              },
            },

            data: this.chartData.slechtData,
            color: this.legend.find(item => item.label==='slecht').color,

          },
        ]
        return sample
      },
      percentageType() {
        return checkTitleForPercentage(this.title)
      },

    },
  }

</script>