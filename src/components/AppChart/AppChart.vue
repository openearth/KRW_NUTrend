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
      <line-chart v-if="isLinesChart" :title="title" />
      <dots-chart v-if="isDotsChart" :title="title" />
    </div>
  </div>
</template>

<script>
  import DotsChart from '~/components/Charts/DotsChart/DotsChart'
  import LineChart from '~/components/Charts/LineChart/LineChart'

  const TIMEOUT_DURATION = 1000 // 1 second

  export default {
    name: 'AppChart',
    components: {
      DotsChart,
      LineChart,
    },
    props: {
      title: {
        type: String,
        default: '',
      },
      type: {
        type: String,
        default: '',
        validator(value) {
          return [ 'dots', 'lines' ].indexOf(value) !== -1
        },
      },
    },
    data() {
      return {
        isLoading: true,
      }
    },
    computed: {
      isDotsChart() {
        return this.type === 'dots'
      },
      isLinesChart() {
        return this.type === 'lines'
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
