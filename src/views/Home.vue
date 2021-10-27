<template>
  <div class="home">
    <v-navigation-drawer
      app
      clipped
      permanent
      width="350"
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
          <content-panels />
        </v-row>
      </v-container>
    </v-navigation-drawer>

    <v-navigation-drawer
      app
      clipped
      permanent
      right
      width="350"
    >
      <v-container fluid>
        <v-row>
          <filter-data-form />
        </v-row>

        <app-divider />

        <v-fade-transition mode="out-in">
          <v-row v-if="activeMapLocation">
            <v-col>
              <v-btn
                block
                elevation="0"
              >
                Download (.csv)
              </v-btn>
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
                :modal-title="activeMapLocation.locationId"
              />
            </v-col>
          </v-row>
        </v-fade-transition>
        <v-fade-transition mode="out-in">
          <!-- TODO: Sub-basin is not included in this logic.-->
          <v-row v-if="showToestandGraphNl">
            <v-col>
              <chart-modal-activator
                title="Nederland"
                modal-title="Nederland"
              />
            </v-col>
          </v-row>
        </v-fade-transition>
        <v-fade-transition mode="out-in">
          <v-row v-if="showToestandGraphAllBasins"> 
            <v-col>
              <chart-modal-activator
                title="Stroomgebied"
                modal-title="Stroomgebied"
              />
            </v-col>
          </v-row>
          <v-row v-else-if="showToestandGraphSelectedBasin">
            <v-col>
              <chart-modal-activator
                :title="selectedBasin"
                :modal-title="selectedBasin"
              />
            </v-col>
          </v-row>
        </v-fade-transition>
        <v-fade-transition mode="out-in">
          <v-row v-if="showToestandGraphAllWatermanagers">
            <v-col>
              <chart-modal-activator
                title="Waterbeheerders"
                modal-title="Waterbeheerders"
              />
            </v-col>
          </v-row>
          <v-row v-if="showToestandGraphSelectedWaterManager">
            <v-col>
              <chart-modal-activator
                :title="selectedWaterManager"
                :modal-title="selectedWaterManager"
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
  import { mapState, mapGetters } from 'vuex'

  import ActiveLocationCard from '~/components/ActiveLocationCard/ActiveLocationCard'
  import AppDivider from '~/components/AppDivider/AppDivider'
  import ChartModal from '~/components/ChartModal/ChartModal'
  import ChartModalActivator from '~/components/ChartModalActivator/ChartModalActivator'
  import ContentPanels from '~/components/ContentPanels/ContentPanels'
  import DataTypeForm from '~/components/DataTypeForm/DataTypeForm'
  import FilterDataForm from '~/components/FilterDataForm/FilterDataForm'

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
    },
    computed: {
      ...mapState('layers', [
        'activeMapLocation',
      ]),
      ...mapState('filters', [
        'selectedType', 'selectedBasin', 'selectedSubBasin', 'selectedWaterManager',
      ]),
      ...mapGetters('charts', [ 'showTrendsGraphs', 'showConcentrationGraphs', 'showToestandGraphNl', 
                                'showToestandGraphAllBasins', 'showToestandGraphAllWatermanagers', 
                                'showToestandGraphSelectedBasin', 'showToestandGraphSelectedWaterManager' ]),

    },
    watch: { 
      showToestandGraphNl() {
        console.log('send request for NL')
      },
      showToestandGraphAllBasins() {
        console.log('send request for showToestandGraphAllBasins')
      },
      showToestandGraphAllWatermanagers() {
        console.log('send request for showToestandGraphAllWatermanagers')
      },
      showToestandGraphSelectedBasin() {
        console.log('send request for showToestandGraphSelectedBasin')
      },
      showToestandGraphAllBasins() {
        console.log('send request for showToestandGraphSelectedWaterManager')
      },
    },
  }
</script>
