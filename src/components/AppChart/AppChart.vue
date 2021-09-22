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
      <v-chart
        :init-options="initOptions"
        :option="options"
        autoresize
      />
    </div>
  </div>
</template>

<script>
  import { use } from 'echarts/core'
  import { CanvasRenderer } from 'echarts/renderers'
  import { BarChart } from 'echarts/charts'
  import {
    GridComponent,
    TooltipComponent,
    LegendComponent,
  } from 'echarts/components'
  import VChart from 'vue-echarts'

  use([
    CanvasRenderer,
    GridComponent,
    BarChart,
    TooltipComponent,
    LegendComponent,
  ])

  const TIMEOUT_DURATION = 1000 // 1 second

  export default {
    name: 'AppChart',
    components: {
      VChart,
    },
    data() {
      return {
        isLoading: true,
        initOptions: {
          height: '400px',
        },
        options: {
          legend: {
            data: [ 'Goed', 'Matig', 'Ontoereikend', 'Slecht' ],
          },
          grid: {
            top: '10%',
            right: '3%',
            bottom: '3%',
            left: '3%',
            containLabel: true,
            backgroundColor: '#fff',
          },
          xAxis: {
            type: 'value',
          },
          yAxis: {
            type: 'category',
            data: [ 'Eems', 'Maas', 'Rijn', 'Rijn-Noord', 'Rijn-Oost', 'Rijn-West', 'Schelde' ],
          },
          series: [
            {
              name: 'Goed',
              type: 'bar',
              stack: 'total',
              data: [ 320, 302, 301, 334, 390, 330, 320 ],
              label: {
                show: true,
              },
            },
            {
              name: 'Matig',
              type: 'bar',
              stack: 'total',
              data: [ 120, 132, 101, 134, 90, 230, 210 ],
              label: {
                show: true,
              },
            },
            {
              name: 'Ontoereikend',
              type: 'bar',
              stack: 'total',
              data: [ 220, 182, 191, 234, 290, 330, 310 ],
              label: {
                show: true,
              },
            },
            {
              name: 'Slecht',
              type: 'bar',
              stack: 'total',
              data: [ 150, 212, 201, 154, 190, 330, 410 ],
              label: {
                show: true,
              },
            },
          ],
        },
      }
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
    height: 400px;
  }

  .app-chart__loader {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 400px;
  }
</style>
