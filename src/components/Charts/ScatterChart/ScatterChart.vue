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
  import { mapState } from 'vuex'
  import { use } from 'echarts/core'
  import { CanvasRenderer } from 'echarts/renderers'
  import { ScatterChart } from 'echarts/charts'
  import {
    GridComponent,
    TitleComponent,
    LegendComponent,
    TooltipComponent,
  } from 'echarts/components'
  import VChart from 'vue-echarts'
  import createSeriesScatterData from '~/lib/create-series-scatter-data'
  use([
    CanvasRenderer,
    GridComponent,
    ScatterChart,
    TitleComponent,
    LegendComponent,
    TooltipComponent,
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
      ...mapState('charts', [ 'data' ]),
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
            data: this.getLegendData(this.scatterChartData), 
            orient: 'vertical',
            x: 'right',
            right: '20%',
          
          },
        }
      },
      scatterChartData() {
        return this.data.filter(data => data.name === 'scatter')
      },
     
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
          data: this.labels,
        }
      },
      yAxis() {
        return {
          type: 'value', // min, max ?
        }
      },
      series() {
        return this.getSeriesData(this.scatterChartData)
      },
      labels() { 
        return this.fullDates.map(date => date.split('-')[0])
      },
      fullDates() {
        return  this.getXAxisData(this.scatterChartData)
      },
    },
    methods: {
      getLegendData(data) {
        const stationNames =  data.map(({ location })=> {
          return location.stationName
        })
        return stationNames
      },
      //NOTE leave the whole date or only the year ?
      getXAxisData(data) {
        let labelsDateType = []
        data.forEach(({ series })=> {
      
          let seriesLabelsDateType = series.map(serie => new Date (serie.label))
          labelsDateType = [ ...labelsDateType, ...seriesLabelsDateType ]
        })
        let sortedLabelsDateType = labelsDateType.sort((a,b)=> a - b)
        let labels = sortedLabelsDateType.map(label => label.toISOString().slice(0, 10))

        return labels
      },
      getSeriesData(data) {
        const series = data.map(({ location, name, series }) => {
          return {
            'name': location.stationName,
            'type': name,
            'data': createSeriesScatterData(this.fullDates, series),
          }
        })
       
        return series
      },
    },
  }

</script>