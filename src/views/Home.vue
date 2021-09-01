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
                <v-expansion-panel-header class="text-caption">
                  Toetsing stikstof aan normen toetsjaar 2020
                </v-expansion-panel-header>
                <v-expansion-panel-content>
                  <p class="text-body-2">
                    Per waterlichaam wordt voor de toetsjaren 1991 tot en met 2020
                    het resultaat van de toetsing weergegeven. Elk toetsjaar maakt
                    gebruik van de drie voorafgaande jaren; voor bijvoorbeeld 2020
                    zijn de jaren 2017 tot en met 2019 gebruikt. De toetsing is
                    uitgevoerd conform de toetsregels van de Kaderrichtlijn Water.
                  </p>
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
            <v-btn
              block
              elevation="0"
            >
              Download (.csv)
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
    created() {
      this.getExampleData()
    },
    methods: {
      async getExampleData() {
        try {
          const response = await this.$axios.get('http://jsonplaceholder.typicode.com/posts')
          const posts = response.data
          console.log(posts)
        } catch (error) {
          console.log(error)
        }
      },
    },
  }
</script>
