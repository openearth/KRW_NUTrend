<template>
  <div />
</template>

<script>
  import { mapActions } from 'vuex'

  export default {
    inject: [ 'getMap' ],
    props: {
      layer: {
        type: Object,
        default: null,
      },
    },
    mounted() {
      const map = this.getMap()
      if (map) {
        this.addEventsToMap(map)
      }
    },
    methods: {
      ...mapActions('layers', [
        'setActiveMapLocation',
      ]),
      deferredMountedTo(map) {
        if (this.layer) {
          this.addEventsToMap(map)
        }
      },
      addEventsToMap(map) {
        this.handleMapPointClick(map)
        this.handleMapMouseEnter(map)
        this.handleMapMouseLeave(map)
      },
      handleMapPointClick(map) {
        map.on('click', this.layer.id, (e) => {
          const { locationId } = e.features[0].properties
          this.setActiveMapLocation({ activeMapLocation: locationId })
        })
      },
      handleMapMouseEnter(map) {
        map.on('mouseenter', this.layer.id, () => {
          map.getCanvas().style.cursor = 'pointer'
        })
      },
      handleMapMouseLeave(map) {
        map.on('mouseleave', this.layer.id, () => {
          map.getCanvas().style.cursor = ''
        })
      },
    },
  }
</script>
