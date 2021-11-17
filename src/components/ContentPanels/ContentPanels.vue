<template>
  <v-expansion-panels
    key="selectedType"
    v-model="selectedPanel"
  >
    <v-expansion-panel
      v-for="(panel, index) in panels"
      :key="panel.id"
      :ref="`panel-${ index }`"
      @change="setPanelIndex(index)"
    >
      <v-expansion-panel-header
        class="text-caption"
        @transitionend="(event) => onTransitionEnd(event)"
      >
        {{ panel.title }}
      </v-expansion-panel-header>
      <v-expansion-panel-content>
        <vue-markdown class="markdown" :source="panel.content" />
      </v-expansion-panel-content>
    </v-expansion-panel>
  </v-expansion-panels>
</template>

<script>
  import { mapActions, mapState } from 'vuex'
  import VueMarkdown from 'vue-markdown-render'

  import services from '~/config/services.json'


  export default {
    components: {
      VueMarkdown,
    },
    props:{ 
      openPanel:{
        type: Number,
        required: true,
        default: 0,
      },
    },
    data() { 
      return {
        panelRef: null,
        panelIndex: 0,
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
      selectedPanel: {
        get() {
          return this.openPanel
        },
        set(index) {
          if(!index){
            return 0
          }
         
          return index
        },
        
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
      activePanel() {
        return this.panels[this.panelIndex]
      },
    },
    watch: {


      selectedTimestamp() {
        const isActive  = this.$refs[`panel-${ this.panelIndex }`][0].isActive
        this.setMap(isActive)
      },
      panelRef() {
        const isActive = this.panelRef.isActive
        this.setMap(isActive)
      },
    },
    mounted() {
      this.panelRef = this.$refs[`panel-${ this.panelIndex }`][0]
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
        'setTimeOption',
      ]),
      importFileContent(fileName) {
        return require(`~/content/services/${ this.selectedType }/${ this.selectedParticle }/${ fileName }.md`)
      },
      onTransitionEnd(event) {
        
        const isActive  = this.$refs[`panel-${ this.panelIndex }`][0].isActive
        const { propertyName } = event

        if (propertyName === 'min-height') {
          return
        }
       
        this.setMap(isActive)
      },
      setPanelIndex(index){
        this.$emit('active-panel-index', index)
        this.panelIndex = index
    
      },
      setMap(isActive) {
   
        if (isActive) {
        
          this.setActiveMap({ activeMap: this.activePanel })
          this.getLegendGraphic()

          // Only the difference maps and the trends have uFmaprl in the services.json
          if (this.activePanel.url && this.activePanel.differenceMap) {
            this.setDifferenceMap(true)
            this.getTimeSeriesWithStandardTime()
            this.setTimeOption(false)
          } else if (this.activePanel.url) {
            this.setDifferenceMap(false)
            this.getTimeSeriesWithStandardTime()
            this.setTimeOption(false)
          } else {
            this.setDifferenceMap(false)
            this.getTimeSeries()
            this.setTimeOption(true)
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
