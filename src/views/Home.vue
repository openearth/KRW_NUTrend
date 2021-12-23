<template>
  <div class="home">
    <v-navigation-drawer
      app
      clipped
      permanent
      width="40%"
    >
      <v-container fluid>
        <v-row justify="space-between" no-gutters>
          <v-col cols="5" align-self="center">
            <v-img
              width="110"
              height="50"
              contain
              :src="require(`@/assets/deltares-logo.png`)"
            />
          </v-col>
          <v-col cols="5">
            <v-img
              width="110"
              height="50"
              contain
              :src="require(`@/assets/rws-logo.png`)"
            />
          </v-col>
        </v-row>

        <app-divider />

        <v-row>
          <data-type-form />
        </v-row>

        <app-divider />

        <v-row>
          <v-col
            v-if="selectedType && selectedParticle"
          >
            <content-panels
              :key="panelsResetKey"
              :open-panel="initOpenPanel"
              @active-panel-index="setActivePanelIndex"
            />
          </v-col>
        </v-row>
      </v-container>
    </v-navigation-drawer>

    <v-navigation-drawer
      app
      clipped
      permanent
      right
      width="400"
    >
      <v-container fluid>
        <v-row>
          <filter-data-form @reset-bounds="onResetBounds" />
        </v-row>

        <app-divider />

        <v-fade-transition mode="out-in">
          <!-- TODO: the download button appears only after clicking on the map. Change that -->
          <v-row v-if="csvRows.length">
            <v-col>
              <export-data :csv-rows="csvRows" />  
            </v-col>
          </v-row>
        </v-fade-transition>

        <v-fade-transition mode="out-in">
          <v-row v-if="activeMapLocation">
            <v-col>
              <active-location-card
                :id="activeMapLocation.locationId"
                :name="activeMapLocation.stationName"
                :value="activeMapLocation.value"
                :value2="activeMapLocation.value2"
                :selected-type="selectedType"
                :thresholds="legend"
                :compare-year="compareYear"
              />
            </v-col>
          </v-row>
        </v-fade-transition>

        <v-fade-transition mode="out-in">
          <app-divider v-if="activeMapLocation" />
        </v-fade-transition>
        <!-- concentration graphs -->
        <v-fade-transition mode="out-in">
          <v-row v-if="showConcentrationGraphs">
            <v-col>
              <chart-modal-activator
                :title="activeMapLocation.stationName"
                :modal-title="activeMapLocation.locationId"
              />
            </v-col>
          </v-row>
        </v-fade-transition>
        <v-fade-transition mode="out-in">
          <!-- trend graphs -->
          <v-row v-if="showTrendsGraphs">
            <v-col>
              <chart-modal-activator
                :title="activeMapLocation.stationName"
                :modal-title="activeMapLocation.stationName"
              />
            </v-col>
          </v-row>
        </v-fade-transition>
        <v-fade-transition mode="out-in">
          <!-- TODO: Sub-basin is not included in this logic.-->
          <v-row v-if="showToestandGraphNlModal">
            <v-col>
              <chart-modal-activator
                title="Nederland"
                modal-title="Nederland"
                toestand-chart-type="NL"
              />
            </v-col>
          </v-row>
        </v-fade-transition>
        <v-fade-transition mode="out-in">
          <v-row v-if="showToestandGraphAllBasinsModal"> 
            <v-col>
              <chart-modal-activator
                title="Stroomgebied"
                modal-title="Stroomgebied"
                toestand-chart-type="AllBasins"
              />
            </v-col>
          </v-row>
          <v-row v-if="showToestandGraphSelectedBasinModal">
            <v-col>
              <chart-modal-activator
                :title="selectedBasin"
                :modal-title="selectedBasin"
                toestand-chart-type="selectedBasin"
              />
            </v-col>
          </v-row>
        </v-fade-transition>
        <v-fade-transition mode="out-in">
          <v-row v-if="showToestandGraphAllSubBasinsModal"> 
            <v-col>
              <chart-modal-activator
                title="Deelstroomgebied"
                modal-title="Deelstroomgebied"
                toestand-chart-type="AllSubBasins"
              />
            </v-col>
          </v-row>
          <v-row v-if="showToestandGraphSelectedSubBasinModal">
            <v-col>
              <chart-modal-activator
                :title="selectedSubBasin"
                :modal-title="selectedSubBasin"
                toestand-chart-type="selectedSubBasin"
              />
            </v-col>
          </v-row>
        </v-fade-transition>
        <v-fade-transition mode="out-in">
          <v-row v-if="showToestandGraphAllWatermanagersModal">
            <v-col>
              <chart-modal-activator
                title="Waterbeheerders"
                modal-title="Waterbeheerders"
                toestand-chart-type="AllWaterManagers"
              />
            </v-col>
          </v-row>
          <v-row v-if="showToestandGraphAvailableWatermanagersModal">
            <v-col>
              <chart-modal-activator
                title="Waterbeheerders"
                modal-title="Waterbeheerders"
                toestand-chart-type="AllWaterManagers"
              />
            </v-col>
          </v-row>
          <v-row v-if="showToestandGraphSelectedWaterManagerModal">
            <v-col>
              <chart-modal-activator
                :title="selectedWaterManager"
                :modal-title="selectedWaterManager"
                toestand-chart-type="selectedWaterManager"
              />
            </v-col>
          </v-row>
        </v-fade-transition>
      </v-container>
    </v-navigation-drawer>

    <chart-modal />
  </div>
</template>

<script>
  import { mapState, mapGetters, mapActions } from 'vuex'

  import ActiveLocationCard from '~/components/ActiveLocationCard/ActiveLocationCard'
  import AppDivider from '~/components/AppDivider/AppDivider'
  import ChartModal from '~/components/ChartModal/ChartModal'
  import ChartModalActivator from '~/components/ChartModalActivator/ChartModalActivator'
  import ContentPanels from '~/components/ContentPanels/ContentPanels'
  import DataTypeForm from '~/components/DataTypeForm/DataTypeForm'
  import FilterDataForm from '~/components/FilterDataForm/FilterDataForm'
  import ExportData from '~/components/ExportData/ExportData'
  
  export default {
    name: 'Home',
    components: {
      ActiveLocationCard,
      AppDivider,
      ChartModal,
      ChartModalActivator,
      ContentPanels,
      DataTypeForm,
      FilterDataForm,
      ExportData,
    },
    data() { 
      return {
        initOpenPanel:0,
        activePanelIndex: 0,
        panelsResetKey: `${ this.selectedType }-${ this.selectedParticle }`,
      }
    },
    computed: {
      ...mapState('layers', [
        'activeMapLocation', 'legend',
      ]),
      ...mapGetters('layers', [ 'csvRows', 'compareYear' ]),
      ...mapState('filters', [
        'selectedType', 'selectedBasin', 'selectedSubBasin', 'selectedWaterManager', 'selectedParticle',
      ]),
      ...mapGetters('charts', [ 'showTrendsGraphs', 'showConcentrationGraphs', 'showToestandGraphNlModal', 
                                'showToestandGraphAllBasinsModal', 'showToestandGraphAllSubBasinsModal','showToestandGraphAllWatermanagersModal', 
                                'showToestandGraphSelectedBasinModal', 'showToestandGraphSelectedSubBasinModal', 'showToestandGraphSelectedWaterManagerModal', 
                                'showToestandGraphAvailableWatermanagersModal' ]),

    },
    watch: { 
      showToestandGraphNlModal() { 
        if (this.showToestandGraphNlModal) {
          this.getChartDataToestandNl()
        }
      },
      showToestandGraphAllBasinsModal() {
        if (this.showToestandGraphAllBasinsModal) {
          this.getChartDataToestandAllBasins()
        }
      },
      showToestandGraphAllSubBasinsModal() {
        if (this.showToestandGraphAllSubBasinsModal) {
          this.getChartDataToestandAllSubBasins()
        }
      },
      showToestandGraphAllWatermanagersModal() {
        if (this.showToestandGraphAllWatermanagersModal) {
          this.getChartDataToestandAllWaterManagers()
        }
      },
      showToestandGraphSelectedWaterManagerModal() {
        if (this.showToestandGraphSelectedWaterManagerModal) {
          this.getChartDataToestandSelectedWaterManager()
        }
      },
      selectedType(){
        this.panelsResetKey=`${ this.selectedType }-${ this.selectedParticle }`
      },
      selectedParticle() {
        //TODO: Not nice solution: Add this if statement to fix bug trends map dont change when particle changes
        if (this.selectedType === 'trends') {
          this.panelsResetKey=`${ this.selectedType }-${ this.selectedParticle }`
        }
        if(this.activePanelIndex === 0) {
          this.panelsResetKey=`${ this.selectedType }-${ this.selectedParticle }`
        }
      },
    },
    methods: { 
      ...mapActions('charts', [ 'getChartDataToestandNl', 'getChartDataToestandAllBasins', 'getChartDataToestandAllSubBasins',
                                'getChartDataToestandAllWaterManagers', 'getChartToestandAvailableWaterManagers', 
                                'getChartDataToestandSelectedBasin', 'getChartDataToestandSelectedWaterManager', 
                                'getChartDataToestandSelectedSubBasin' ]),
      setActivePanelIndex(event) {
        this.activePanelIndex = event
      },
      onResetBounds(event) {
        this.$emit('reset-bounds', event)
      },
    },
  }
</script>
