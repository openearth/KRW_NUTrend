<template>
  <v-expansion-panels
    key="selectedType"
    ref="parentPanels"
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
        @click="onClick"
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
        parentPanels: null,
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
      selectedParticle(val) {
        if (val !=='trends') {
          this.setMap(true)
        }
      },
    },
    mounted() {
      this.panelRef = this.$refs[`panel-${ this.panelIndex }`][0]
     
      this.parentPanels = this.$refs['parentPanels']
     
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
        'getTimeSeriesForDownload',
      ]),
      importFileContent(fileName) {
        return require(`~/content/services/${ this.selectedType }/${ this.selectedParticle }/${ fileName }.md`)
      },
      onClick() {
        setTimeout(() => {
          this.checkIfPanelOpen()
        }, 500)
      },
      checkIfPanelOpen() {
        this.parentPanels = this.$refs['parentPanels']
        
        const childrentComponents = this.parentPanels.$children
        const children = childrentComponents.map(child => child.$el)
        
        
        children.forEach((child, index) => {
          const isActive  = this.$refs[`panel-${ index }`][0].isActive
          
          let closedPanels = children.length 
          if (child.className !== 'v-expansion-panel') {
            closedPanels = children.length - 1
            this.setMap(isActive)
          }
        
          if (closedPanels === children.length) {
            this.setMap(false)
          }
        }) 
      },
      setPanelIndex(index){
        this.$emit('active-panel-index', index)
        this.panelIndex = index
        this.resetActiveMapLocation()
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
            this.getTimeSeriesForDownload()
            
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
