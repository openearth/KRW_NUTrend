<template>
  <v-dialog
    :value="isOpen"
    class="chart-modal"
    width="100%"
    max-width="1300"
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
      <v-card-text v-if="displayToestandChartsNlCard">
        <div>
          <!-- normal -->
          <app-chart
            :title="toestandChartTitle"
            type="barStackedYears"
            :chart-data="toestandDataNl.aantal"
          />
          <!-- percentage-->
          <app-chart
            :title="toestandChartTitlePer"
            type="barStackedYears"
            :chart-data="toestandDataNl.percentage"
          />
        </div>
      </v-card-text>
      <v-card-text v-else-if="displayToestandChartsAllBasinsCard" class="chart-content">
        <v-carousel
          hide-delimiters
          height="1000"
        >
          <v-carousel-item
            v-for="toestandData in sortedToestandDataAllBasins"
            :key="toestandData.year"
          >
            <div>
              <!-- normal -->
              <app-chart
                :title="toestandChartTitle + toestandData.year.substring(0,4)"  
                type="barStacked"
                :chart-data="toestandData.data.aantal"
              />
              <!-- percentage-->
              <app-chart
                :title="toestandChartTitlePer + toestandData.year.substring(0,4)"
                type="barStacked"
                :chart-data="toestandData.data.percentage"
              />
            </div>
          </v-carousel-item>
        </v-carousel>
      </v-card-text>
      <v-card-text v-else-if="displayToestandChartsAllSubBasinsCard" class="chart-content">
        <v-carousel
          hide-delimiters
          height="1000"
        >
          <v-carousel-item
            v-for="toestandData in sortedToestandDataAllSubBasins"
            :key="toestandData.year"
          >
            <div>
              <!-- normal -->
              <app-chart
                :title="toestandChartTitle + toestandData.year.substring(0,4)"  
                type="barStacked"
                :chart-data="toestandData.data.aantal"
              />
              <!-- percentage-->
              <app-chart
                :title="toestandChartTitlePer + toestandData.year.substring(0,4)"
                type="barStacked"
                :chart-data="toestandData.data.percentage"
              />
            </div>
          </v-carousel-item>
        </v-carousel>
      </v-card-text>
      <v-card-text v-else-if="displayToestandChartsWaterManagersCard">
        <v-carousel
          hide-delimiters
          height="1000"
        >
          <v-carousel-item
            v-for="toestandData in sortedToestandDataAllWaterManagers"
            :key="toestandData.year"
          >
            <div>
              <!-- normal -->
              <app-chart
                :title="toestandChartTitle + toestandData.year.substring(0,4)"
                type="barStacked"
                :chart-data="toestandData.data.aantal"
              />
              <!-- percentage-->
              <app-chart
                :title="toestandChartTitlePer + toestandData.year.substring(0,4)"
                type="barStacked"
                :chart-data="toestandData.data.percentage"
              />
            </div>
          </v-carousel-item>
        </v-carousel>
      </v-card-text>
      <v-card-text v-else-if="displayToestandChartsSelectedBasinCard">
        <div>
          <!-- normal -->
          <app-chart
            :title="toestandChartTitle"
            type="barStackedYears"
            :chart-data="toestandDataSelectedBasin.aantal"
          />
          <!-- percentage-->
          <app-chart
            :title="toestandChartTitlePer"
            type="barStackedYears"
            :chart-data="toestandDataSelectedBasin.percentage"
          />
        </div>
      </v-card-text>
      <v-card-text v-else-if="displayToestandChartsSelectedSubBasinCard">
        <div>
          <!-- normal -->
          <app-chart
            :title="toestandChartTitle"
            type="barStackedYears"
            :chart-data="toestandDataSelectedSubBasin.aantal"
          />
          <!-- percentage-->
          <app-chart
            :title="toestandChartTitlePer"
            type="barStackedYears"
            :chart-data="toestandDataSelectedSubBasin.percentage"
          />
        </div>
      </v-card-text>
      <v-card-text v-else-if="displayToestandChartsSelectedWaterManagerCard">
        <div>
          <!-- normal -->
          <app-chart
            :title="toestandChartTitle"
            type="barStackedYears"
            :chart-data="toestandDataSelectedWaterManager.aantal"
          />
          <!-- percentage-->
          <app-chart
            :title="toestandChartTitlePer"
            type="barStackedYears"
            :chart-data="toestandDataSelectedWaterManager.percentage"
          />
        </div>
      </v-card-text>
      <v-card-text v-else-if="hasDataToDisplayInCharts">
        <div>
          <app-chart
            :title="scatterChartTitle"
            type="scatter"
          />
          <app-chart
            :title="lineChartTitle"
            type="lines"
          />
          <app-chart
            :title="dotsChartTitle"
            type="dots"
          />
        </div>
      </v-card-text>
      <v-card-text v-else-if="hasChartImageToDisplay" class="d-flex justify-center">
        <v-img
          v-if="image"
          width="500"
          height="400"
          contain
          :src="image"
        />
      </v-card-text>
      <v-card-text v-else>
        <p class="text-body-1">
          No chart to display.
        </p>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
  import { mapActions, mapState } from 'vuex'
  import AppChart from '~/components/AppChart/AppChart'
  import sortDataBasedOnDate from '~/lib/toestand-graphs-utils/sort-data-based-on-date'
  
  export default {
    name: 'ChartModal',
    components: {
      AppChart,
    },
    computed: {
      ...mapState('charts', [
        'data',
        'image',
        'toestandDataNl',
        'toestandDataAllBasins',
        'toestandDataAllSubBasins',
        'toestandDataAllWaterManagers',
        'toestandDataSelectedBasin',
        'toestandDataSelectedSubBasin',
        'toestandDataSelectedWaterManager',

      ]),
      ...mapState('modal', [
        'isOpen',
        'title',
        'toestandChartType',
      ]),
      ...mapState('filters', [ 'selectedParticle' ]),
 
      hasDataToDisplayInCharts() {
        return this.data.length
      },
      hasChartImageToDisplay() {
        return this.image
      },
      displayToestandChartsNlCard() {
        const display = this.toestandDataNl
          &&this.toestandChartType === 'NL' 
          ? true : false
        return display
      },
      displayToestandChartsAllBasinsCard() {
        const display = this.toestandDataAllBasins.length
          &&this.toestandChartType === 'AllBasins' 
          ? true : false
        return display
      },
      displayToestandChartsAllSubBasinsCard() {
        const display = this.toestandDataAllSubBasins.length
          &&this.toestandChartType === 'AllSubBasins' 
          ? true : false
        return display
      },
      sortedToestandDataAllBasins() {
        return sortDataBasedOnDate(this.toestandDataAllBasins)
      },
      sortedToestandDataAllSubBasins() {
        return sortDataBasedOnDate(this.toestandDataAllSubBasins)
      },
      sortedToestandDataAllWaterManagers() { 
        return sortDataBasedOnDate(this.toestandDataAllWaterManagers)
      },
      displayToestandChartsWaterManagersCard() {
        const display = this.toestandDataAllWaterManagers.length 
          &&this.toestandChartType === 'AllWaterManagers' 
          ? true : false
        return display
      },
      displayToestandChartsSelectedBasinCard() {
        const display = this.toestandDataSelectedBasin 
          &&this.toestandChartType === 'selectedBasin' 
          ? true : false
        return display
      },
      displayToestandChartsSelectedSubBasinCard() {
        const display = this.toestandDataSelectedSubBasin 
          &&this.toestandChartType === 'selectedSubBasin' 
          ? true : false
        return display
      },
      displayToestandChartsSelectedWaterManagerCard() {
        const display = this.toestandDataSelectedWaterManager 
          &&this.toestandChartType === 'selectedWaterManager' 
          ? true : false
        return display
      },
      titleParticle() { 
        //TODO: Can we move that to a config file?
        const title = this.selectedParticle === 'ntot' ? 'N Totaal' 
          :this.selectedParticle === 'ptot' ? 'P Totaal'
            :this.selectedParticle === 'din' ? 'DIN'
              :this.selectedParticle ==='nh4' ? 'Ammonium'
                :this.selectedParticle ==='no3' ? 'Nitraat'
                  :null
        return title
      },
      scatterChartTitle() {
        return `${ this.titleParticle } ${ this.title } (KRW monitoringslocatie in mg/l)`
      },
      lineChartTitle() {
        return `${ this.titleParticle } ${ this.title } (mg/l)`
      },
      dotsChartTitle() {
        return `${ this.titleParticle } ${ this.title } (Toetsing)`
      },
      toestandChartTitle() {
        return `${ this.title } (aantal waterlichamen) `
      },
      toestandChartTitlePer() {
        return `${ this.title } (% waterlichamen) `
      },
    },

    methods: {
      ...mapActions('modal', [
        'setIsOpen',
        'resetToestandChartType',
      ]),
      onClickClose() {
        this.setIsOpen({ isOpen: false })
        this.resetToestandChartType()
      },
    },

  }
</script>

<style lang="scss">
  .v-dialog > .v-card > .v-card__text {
    height: 1500px;
    padding: 20px $spacing-medium;
  }

  .v-dialog .app-chart {
    margin-top: $spacing-small;

    + .app-chart {
      margin-top: $spacing-medium;
    }
  }

  .v-window > .v-item-group > .v-carousel {
    height: 1000px;
  }
</style>
