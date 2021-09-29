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
              src="/assets/images/deltares-logo.png"
            />
          </v-col>
          <v-col cols="5">
            <v-img
              width="110"
              height="50"
              contain
              src="/assets/images/rws-logo.png"
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

        <v-row v-if="activeMapLocation">
          <v-col>
            <active-location-card
              :id="activeMapLocation.locationId"
              :name="activeMapLocation.stationName"
              :value="activeMapLocation.value"
            />
          </v-col>
        </v-row>

        <app-divider v-if="activeMapLocation" />

        <v-row v-if="activeMapLocation">
          <v-col>
            <chart-modal-activator
              :title="activeMapLocation.stationName"
              :modal-title="activeMapLocation.locationId"
            />
          </v-col>
        </v-row>

        <v-row v-else-if="!selectedBasin && !selectedWaterManager">
          <v-col>
            <chart-modal-activator
              title="Nederland"
              modal-title="Nederland"
            />
          </v-col>
        </v-row>

        <v-row v-else-if="!selectedWaterManager">
          <v-col>
            <chart-modal-activator
              title="Stroomgebied"
              modal-title="Stroomgebied"
            />
          </v-col>
        </v-row>

        <v-row v-if="!activeMapLocation">
          <v-col>
            <chart-modal-activator
              title="Waterbeheerders"
              modal-title="Waterbeheerders"
            />
          </v-col>
        </v-row>
      </v-container>
    </v-navigation-drawer>

    <chart-modal />
  </div>
</template>

<script>
  import { mapState } from 'vuex'

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
      ...mapState('filters', [
        'selectedBasin',
        'selectedWaterManager',
      ]),
      ...mapState('layers', [
        'activeMapLocation',
      ]),
    },
  }
</script>
