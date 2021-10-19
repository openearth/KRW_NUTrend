<template>
  <v-chart
    v-if="scatterChartData"
    class="scatter-chart"
    :init-options="initOptions"
    :option="options"
    autoresize
  />
</template>

<script>
 
  import { use } from 'echarts/core'
  import { CanvasRenderer } from 'echarts/renderers'
  import { ScatterChart } from 'echarts/charts'
  import {
    GridComponent,
    TitleComponent,
  } from 'echarts/components'
  import VChart from 'vue-echarts'

  use([
    CanvasRenderer,
    GridComponent,
    ScatterChart,
    TitleComponent,
  ])


  export default {
    name: 'ScattChart',
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
          type: 'scatter',
        },
      }
    },
    computed: {
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
          legend: {
            data: [ 'MonitoringLocationId1', 'MonitoringLocationId2' ], //TODO replace with real data
          },
        }
      },
      scatterChartData() {
        return true
      },
      //TODO options need work
      options() {
        return {
          ...this.baseOptions,
          xAxis: this.xAxis,
          yAxis: this.yAxis,
          series: this.series,
        }
      },
      xAxis() {
        return {
          type: 'category',
          boundaryGap: false,
          data: [ '1991', '1992', '1993', '1994', '1995', '1996', '1997' ], // this.getXAxisData
        }
      },
      yAxis() {
        return {
          type: 'value', // min, max ?
        }
      },
      series() {
        const sampleData = [
          {
            name: 'MonitoringLocationId1',
            type: 'scatter',
     
            data: [ 120, 132, 101, 134, 290, 230, 210 ],
          },
          {
            name: 'MonitoringLocationId2',
            type: 'scatter',
     
            data: [ 120, 182, 191, 234, 290, 330, 310 ],
          },

        ]
        return sampleData// this.getSeriesData(this.filterdData)
      },

      
    },
    mounted() {

    },

  }

</script>