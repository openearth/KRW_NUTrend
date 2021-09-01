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
          <v-col>
            <v-expansion-panels>
              <v-expansion-panel>
                <v-expansion-panel-header>Item</v-expansion-panel-header>
                <v-expansion-panel-content>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                </v-expansion-panel-content>
              </v-expansion-panel>
            </v-expansion-panels>
          </v-col>
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

        <v-row>
          <v-col>
            <v-btn block large>
              Download
            </v-btn>
          </v-col>
        </v-row>

        <v-row>
          <v-col>
            <plot-card title="Nederland" image="https://cdn.vuetifyjs.com/images/cards/docks.jpg" />
          </v-col>
        </v-row>

        <v-row>
          <v-col>
            <plot-card title="Stroomgebied" image="https://cdn.vuetifyjs.com/images/cards/docks.jpg" />
          </v-col>
        </v-row>

        <v-row>
          <v-col>
            <plot-card title="Waterbeheerders" image="https://cdn.vuetifyjs.com/images/cards/docks.jpg" />
          </v-col>
        </v-row>
      </v-container>
    </v-navigation-drawer>
  </div>
</template>

<script>
  import AppDivider from '~/components/AppDivider/AppDivider'
  import DataTypeForm from '~/components/DataTypeForm/DataTypeForm'
  import FilterDataForm from '~/components/FilterDataForm/FilterDataForm'
  import PlotCard from '~/components/PlotCard/PlotCard'

  export default {
    name: 'Home',
    components: {
      AppDivider,
      DataTypeForm,
      FilterDataForm,
      PlotCard,
    },
    data() {
      return {
        typeList: [ 'Toestand', 'Trends', 'Concentratie' ],
        selectedType: 'Toestand',
        particalList: [ 'Stikstof', 'Fosfor', 'DIN (Anorganisch stikstof)' ],
        selectedPartical: 'Stikstof',
        currentYear: new Date().getFullYear(),
        selectedYear: new Date().getFullYear(),
      }
    },
  }
</script>
