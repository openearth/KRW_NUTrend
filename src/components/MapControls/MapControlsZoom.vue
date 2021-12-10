<template>
  <div />
</template>

<script>


  export default {
    inject: [ 'getMap' ],
    props: {
      bounds: {
        type: Array,
        default: ()=>[],
      },
    },
    watch: { 
      bounds() { 
        const map = this.getMap()
        this.zoomToExtent(map)
      },
    },
    mounted() {
      const map = this.getMap()
      if (map) {
        this.zoomToExtent(map)
      }
    },

    methods: {
      deferredMountedTo(map) {
        this.zoomToExtent(map)
      },
      zoomToExtent(map) {
        const sw = [ this.bounds[0], this.bounds[1] ]
        const ne = [ this.bounds[2], this.bounds[3] ]
        map.fitBounds([ sw,ne ], {
          padding: 100,
          maxZoom: 12,
        })
      },
    },
  }
</script>
