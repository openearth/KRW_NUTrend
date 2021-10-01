<template>
  <v-dialog
    :value="isOpen"
    class="chart-modal"
    width="90%"
    max-width="1000"
    scrollable
    @click:outside="onClickClose"
  >
    <v-card>
      <v-app-bar flat color="white">
        <v-toolbar-title>
          {{ title }}
        </v-toolbar-title>

        <v-spacer />

        <v-btn icon @click="onClickClose">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-app-bar>
      <v-divider />
      <v-card-text>
        <app-chart
          :title="lineChartTitle"
          type="lines"
        />
        <app-chart
          :title="dotsChartTitle"
          type="dots"
        />
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
  import { mapActions, mapState } from 'vuex'
  import AppChart from '~/components/AppChart/AppChart'

  export default {
    name: 'ChartModal',
    components: {
      AppChart,
    },
    computed: {
      ...mapState('modal', [
        'isOpen',
        'title',
      ]),
      lineChartTitle() {
        return `N Totaal ${ this.title } (mg/l)`
      },
      dotsChartTitle() {
        return `N Totaal ${ this.title } (Toetsing)`
      },
    },
    methods: {
      ...mapActions('modal', [
        'setIsOpen',
      ]),
      ...mapActions('charts', [
        'resetChartsData',
      ]),
      onClickClose() {
        this.setIsOpen({ isOpen: false })
        this.resetChartsData()
      },
    },
  }
</script>

<style lang="scss">
  .v-dialog > .v-card > .v-card__text {
    padding: 20px $spacing-medium;
  }
</style>
