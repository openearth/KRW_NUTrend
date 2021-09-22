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
    computed: {
      ...mapState('filters', [
        'selectedType',
        'selectedParticle',
      ]),
      mappedServices() {
        const type = services.find(service => service.id === this.selectedType)
        const spatialPlot = type.spatialPlots.find(spatialPlot => spatialPlot.id === this.selectedParticle)

        return spatialPlot.services
      },
      panels() {
        return this.mappedServices.map(({ id, name, paint, url }) => {
          const content = this.importFileContent(id)
          return {
            content: content.default,
            id,
            title: name,
            paint,
            url,
          }
        })
      },
    },
   
    methods: {
      ...mapActions('layers', [ 'getTimeSeries', 'setActiveMapLayer', 'getTimeSeriesDifferenceMaps' ]),
      importFileContent(fileName) {
        return require(`~/content/services/${ this.selectedType }/${ this.selectedParticle }/${ fileName }.md`)
      },
      onTransitionEnd(event, index, panel) {
        const { isActive } = this.$refs[`panel-${ index }`][0]
        const { propertyName } = event
        
        if (isActive && propertyName === 'min-height' ) {
          if (panel.url) {
            this.setActiveMapLayer({ activeMapLayer: panel }) 
            this.getTimeSeriesDifferenceMaps()
          }else{
            this.setActiveMapLayer({ activeMapLayer: panel }) 
            this.getTimeSeries() 
          }
          
        }
      },
    },
  }
</script>
