<template>
  <div />
</template>

<script>
  import { mapActions, mapState } from 'vuex'
  import mapboxgl from 'mapbox-gl'

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
        popup: null,
      }
    },
    computed: {
      ...mapState('filters', [
        'selectedType',
      ]),
      ...mapState('layers', [ 'differenceMap' ]),
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
        this.addPopup()
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
      ...mapActions('layers', [ 'setActiveMapLocation', 'setClickedPointBbox'  ]),
      ...mapActions('charts',[ 'resetChartsData' ]),
      deferredMountedTo(map) {
        if (this.layer) {
          this.map = map
          this.addPopup()
        }
      },
      addPopup() {
        this.popup = new mapboxgl.Popup({
          closeButton: false,
          closeOnClick: false,
        })
      },
      onClick(e) {
        this.resetChartsData()
        const { locationId, value, value2, name } = e.features[0].properties
        const coordinates = e.features[0].geometry.coordinates.slice()
        const layerId = this.layer.id
        //Check only one of the two layers for the difference maps case is enough
       

        if (this.differenceMap === true ) {
          if (layerId.includes('left')) {
            this.setActiveMapLocation({ locationId: locationId, value: value, value2: value2, stationName: name })
          }
        }else{
          this.setActiveMapLocation({ locationId: locationId, value: value, value2: null, stationName: name })
        }
        

        this.setClickedPointBbox(coordinates)
      },
      onMouseEnter(e) {
        this.map.getCanvas().style.cursor = 'pointer'
        // Copy coordinates array
        const { name } = e.features[0].properties
        const coordinates = e.features[0].geometry.coordinates.slice()
        
        // Ensure that if the map is zoomed out such that multiple 
        // copies of the feature are visible, the popup appears
        // over the copy being pointed to.
        while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
          coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360
        }
        // Populate the popup and set its coordinates
        // based on the feature found.
        this.popup.setLngLat(coordinates).setHTML(name).addTo(this.map)

      },
      onMouseLeave() {
        this.map.getCanvas().style.cursor = ''
        this.popup.remove()
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
