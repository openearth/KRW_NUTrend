<template>
  <div />
</template>

<script>


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
      
      }
    },
    watch: {

    },
    mounted() {
      console.log('in map controls')
      const map = this.getMap()
      // if we are already loaded
      if (map) {
        this.addClickEventOnMap(map)
      }
    },

    methods: {
      deferredMountedTo(map) {
        console.log('in map controls')
        if (this.layer) {
          this.addClickEventOnMap(map)
        }
      },

      addClickEventOnMap(map) {
        map.on('click', this.layer.id, e =>{
          const features = e.features[0].properties
          console.log('clicked feature properties', features)
        })
        map.on('mouseenter', this.layer.id, () => {
          map.getCanvas().style.cursor = 'pointer'
        })
        map.on('mouseleave', this.layer.id, () => {
          map.getCanvas().style.cursor = ''
        })

      },
    },
  }
</script>