<template>
  <v-chart
    v-if="scatterChartData"
    ref="scatterChart"
    class="scatter-chart"
    :init-options="initOptions"
    :option="options"
    autoresize
  />
</template>

<script>
  import { mapActions, mapState } from 'vuex'
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
        initOptions: { height: '450px', width:'1000px' },
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
            right: '150px',
            bottom: '8px',
            left: '8px',
            containLabel: true,
            backgroundColor: '#fff',
          },
          legend: {
            //data: this.getLegendData(this.scatterChartData), 
            orient: 'vertical',
            right: '0%',
            padding: [ 0,0,10,20 ],
            itemGap:20,
            itemWidth: 10,
            itemHeight: 10,
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
          type: 'time',
          min: '1991',
          max: '2022',
        }
      },
      yAxis() {
        return {
          type: 'value', 
        }
      },
      series() {
        return this.getSeriesData(this.scatterChartData)
      },
    },
    methods: {
      getLegendData(data) {
        const stationNames =  data.map(({ location })=> {
          return location.stationName
        })
        //console.log('')
        return stationNames
      },
      getSeriesData(data) {
        const series = data.map(({ location, name, series }) => {
          return {
            'symbolSize': 8,
            'name': this.formatStationNameToFit(location.stationName),
            'type': name,
            'data': series,
          }
        })
       
        return series
      },
      formatStationNameToFit(name) {
       
        const subNames = name.split(',')

        let stationName = ''
        if (subNames.length === 1) {
          stationName = name
        }
        if (subNames.length === 2) {
          stationName = `${ subNames[0].trim() },${ subNames[1].trim() },`
        }
        if (subNames.length > 2) {
          
          subNames.forEach((subName, index) => {
            
            // console.log(index, 'subname', subName)
            if ((index%2===0) && !(index === (subNames.length -1))) {
             
              stationName = stationName + `\n${ subName.trim() },${ subNames[index+1] },`
            }
            if (index === (subNames.length -1) && (index%2===0)) {
              stationName = stationName + `\n${ subName.trim() }`
            }
           
          })
        }
        
        if (stationName.charAt(stationName.length-1) === ',') {
          stationName = stationName.slice(0, -1)
        }
        
        return stationName
      },
    },
  }

</script>