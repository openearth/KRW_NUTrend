export default {
  name: 'v-mapbox-layer',
  inject: [ 'getMap' ],
  render() {
    return null
  },
  props: {
    options: {
      default: () => {
        return {}
      },
      type: [ Object, String ],
    },
  },
  data() {
    return {
      // used to determine if mounted or deferredMountedTo should be used
      isInitialized: false,
    }
  },
  mounted() {
    console.log('options', this.options)
    if (this.getMap()) {
      this.rerender()
      this.isInitialized = true
    }
  },
  destroyed() {
    this.removeLayer()
  },
  methods: {
    deferredMountedTo() {
      // only execute when layer is not already initialized
      if (!this.isInitialized) {
        this.rerender()
        this.isInitialized = true
      }
    },
    removeLayer() {
     
      const map = this.getMap()
      if (map) {
        const layer = map.getLayer(this.options.id)

        if (layer) {
          map.removeLayer(this.options.id)
          try {
            map.removeSource(layer.source)
          } catch {
            console.warn('could not remove source', layer.source)
          }
        }
      }
    },
    addLayer() {
      const map = this.getMap()
        map.addLayer(this.options)
    },
    checkIfLayerLoaded() { 
     
      const map = this.getMap()
         
      if (map.getLayer(this.options.id)) {
        this.$emit('base-layer-is-loaded', true)
      }

    },
    rerender() {
      this.removeLayer()
      this.addLayer()
      this.checkIfLayerLoaded()

      
      
    },
  },
}
