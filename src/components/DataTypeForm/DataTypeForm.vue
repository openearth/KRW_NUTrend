<template>
  <v-container class="data-type-form" fluid>
    <v-row>
      <v-col>
        <div class="text-body-1 pb-3">
          Soort informatie:
        </div>
        <v-select
          :items="typeList"
          :value="selectedType"
          append-icon="mdi-chevron-down"
          outlined
          dense
          @input="onSelectedType"
        />
      </v-col>
    </v-row>

    <v-row no-gutters>
      <v-col>
        <div class="text-body-1 pb-3">
          Stof:
        </div>
        <v-select
          :items="particleList"
          :value="selectedParticle"
          append-icon="mdi-chevron-down"
          outlined
          dense
          @input="onSelectedParticle"
        />
      </v-col>
    </v-row>

    <v-row no-gutters>
      <v-col v-if="timeOption">
        <div class="text-body-1 pb-3">
          Jaar:
        </div>
        <v-slider
          min="1991"
          max="2024"
          :value="selectedYear"
          thumb-label="always"
          ticks="always"
          @change="updateSelectedYear"
          @end="onSelectedYear"
        />
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
  import { mapActions, mapState } from 'vuex'

  import getISOTimestamp from '~/lib/get-iso-timestamp'

  import services from '~/config/services.json'

  export default {
    name: 'DataTypeForm',
    data() {
      return {
        typeList: [],
        selectedYear: '',
        particleList: [],
      }
    },
    computed: {
      ...mapState('layers', [
        'activeMap', 'timeOption',
      ]),
      ...mapState('filters', [
        'selectedTimestamp',
        'selectedType',
        'selectedParticle',
      ]),
    },
    watch: {
      selectedTimestamp: {
        immediate: true,
        handler(value) {
          if (value) {
            this.selectedYear = new Date(value).getFullYear().toString()
          }
        },
      },
    },
    created() {
      this.createTypeList(services)
      this.createParticleList(services)
    },
    methods: {
      ...mapActions('filters', [
        'setSelectedType',
        'setSelectedParticle',
        'setSelectedTimestamp',
      ]),
      ...mapActions('layers', [
        'getTimeSeries',
        'resetActiveMap',
        'resetActiveMapLocation',
        'resetLegend',
      ]),
      ...mapActions('charts', [
        'resetChartsData',
        'getChartToestandAvailableWaterManagers', 
        'getChartDataToestandSelectedSubBasin', 
        'getChartDataToestandSelectedBasin',
      ]),
      onSelectedType(value) {
        this.setSelectedType({ selectedType: value })
        this.resetMap()
        this.resetChartsData()

      },
      onSelectedParticle(value) {
        this.setSelectedParticle({ selectedParticle: value })
        //get chart data when particle changes
        setTimeout(() => { //TODO: perhaps could be moved at home.vue
          this.getChartDataToestandSelectedBasin()
          this.getChartDataToestandSelectedSubBasin()
          this.getChartToestandAvailableWaterManagers()
        }, 2000)
        this.resetMap()
      },
      onSelectedYear(value) {
        if (value !== parseInt(this.selectedYear)) {
          const timestamp = getISOTimestamp(value)
          this.setSelectedTimestamp({ selectedTimestamp: timestamp })
          this.getTimeSeries()
          this.resetMap()
        }
      },
      updateSelectedYear(value) {
        this.selectedYear = value
      },
      resetMap() {
        this.resetActiveMap()
        this.resetActiveMapLocation()
        this.resetLegend()
      },
      createTypeList(services) {
        this.typeList = services
          .map(service => ({ text: service.name, value: service.id }))
        

        // set first option as selected by default.
        this.setSelectedType({ selectedType: this.typeList[0].value })
      },
      createParticleList(services) {
        const service = services.find(service => service.id === this.selectedType)

        this.particleList = service.spatialPlots
          .map(spatialPlot => ({ text: spatialPlot.name, value: spatialPlot.id }))
          .sort((a, b) => a.text.localeCompare(b.text))
        this.setSelectedParticle({ selectedParticle: this.particleList[2].value })
      },
    },
  }
</script>
