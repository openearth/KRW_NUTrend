<template>
  <v-col>
    <v-expansion-panels v-if="selectedType && selectedParticle">
      <v-expansion-panel
        v-for="(panel, index) in panels"
        :key="panel.id"
        :ref="`panel-${ index }`"
      >
        <v-expansion-panel-header
          class="text-caption"
          @transitionend="(event) => onTransitionEnd(event, index, panel)"
        >
          {{ panel.title }}
        </v-expansion-panel-header>
        <v-expansion-panel-content>
          <vue-markdown class="markdown" :source="panel.content" />
        </v-expansion-panel-content>
      </v-expansion-panel>
    </v-expansion-panels>
  </v-col>
</template>

<script>
  import { mapActions, mapState } from 'vuex'
  import VueMarkdown from 'vue-markdown-render'

  import services from '~/config/services.json'

  export default {
    components: {
      VueMarkdown,
    },
    data() { 
      return {
        activePanel: null,
      }
    },
    computed: {
      ...mapState('filters', [
        'selectedType',
        'selectedParticle',
        'selectedTimestamp',
      ]),
      mappedServices() {
        const type = services.find(service => service.id === this.selectedType)
        const spatialPlot = type.spatialPlots.find(spatialPlot => spatialPlot.id === this.selectedParticle)

        return spatialPlot.services
      },
      panels() {
        return this.mappedServices.map(({ id, name, url, legendGraphicId, differenceMap }) => {
          const content = this.importFileContent(id)
          return {
            content: content.default,
            id,
            title: name,
            url,
            differenceMap,
            legendGraphicId,
          }
        })
      },
    },
    watch: {
      selectedTimestamp() {
        
      },
    },

    methods: {
      ...mapActions('layers', [
        'getTimeSeries',
        'getTimeSeriesWithStandardTime',
        'getLegendGraphic',
        'resetActiveMap',
        'resetActiveMapLocation',
        'resetLegend',
        'setActiveMap',
        'setDifferenceMap',
      ]),
      importFileContent(fileName) {
        return require(`~/content/services/${ this.selectedType }/${ this.selectedParticle }/${ fileName }.md`)
      },
      onTransitionEnd(event, index, panel) {
        const { isActive } = this.$refs[`panel-${ index }`][0]
        const { propertyName } = event

        if (propertyName !== 'min-height') {
          return
        }

        if (isActive) {
          this.setActiveMap({ activeMap: panel })
          this.getLegendGraphic()

          // Only the difference maps and the trends have url in the services.json
          if (panel.url && panel.differenceMap) {
            this.setDifferenceMap(true)
            this.getTimeSeriesWithStandardTime()
          } else if (panel.url) {
            this.setDifferenceMap(false)
            this.getTimeSeriesWithStandardTime() //TODO change naming to getTimeSeriesStandardTime
          } else {
            this.setDifferenceMap(false)
            this.getTimeSeries()
          }
        } else {
          this.resetActiveMap()
          this.resetActiveMapLocation()
          this.resetLegend()
        }
      },
    },
  }
</script>
