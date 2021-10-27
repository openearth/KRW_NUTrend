<template>
  <div />
</template>

<script>
  import { mapActions, mapState } from 'vuex'

  export default {
    inject: [ 'getMap' ],
    props: {
      layer: {
        type: Object,
        default: null,
      },
    },
    data() {
      return {
        map: null,
      }
    },
    computed: {
      ...mapState('filters', [
        'selectedType',
      ]),
    },
    watch: {
      map: {
        handler(value) {
          if (value) {
            this.addEventsToMap()
          }
        },
      },
    },
    mounted() {
      const map = this.getMap()
      if (map) {
        this.map = map
      }
    },
    beforeDestroy() {
      this.removeEventsFromMap()
    },
    methods: {
      ...mapActions('charts', [
        'createImageUrl',
        'getChartsData',
      ]),
      ...mapActions('layers', [ 'setActiveMapLocation' ]),
      deferredMountedTo(map) {
        if (this.layer) {
          this.map = map
        }
      },
      onClick(e) {
        const { locationId, value, name } = e.features[0].properties
        
        this.setActiveMapLocation({ locationId: locationId, value: value, stationName: name })
        
        

        if (this.selectedType === 'trends') {
          console.log('getChartImage was called in MapControls')
          this.createImageUrl()
        } else {
          console.log('getChartsData is called')
          this.getChartsData()
        }
      },
      onMouseEnter() {
        this.map.getCanvas().style.cursor = 'pointer'
      },
      onMouseLeave() {
        this.map.getCanvas().style.cursor = ''
      },
      addEventsToMap() {
        this.map.on('click', this.layer.id, this.onClick)
        this.map.on('mouseenter', this.layer.id, this.onMouseEnter)
        this.map.on('mouseleave', this.layer.id, this.onMouseLeave)
      },
      removeEventsFromMap() {
        this.map.off('click', this.layer.id, this.onClick)
        this.map.off('mouseenter', this.layer.id, this.onMouseEnter)
        this.map.off('mouseleave', this.layer.id, this.onMouseLeave)
      },
    },
  }
</script>
