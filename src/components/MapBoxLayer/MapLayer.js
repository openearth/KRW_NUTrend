export default {
  name: 'map-layer',
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
    // allows to place a layer before another
    before: {
      type: String,
      required: false,
    },
  },
  data() {
    return {
      // used to determine if mounted or deferredMountedTo should be used
      isInitialized: false,
    }
  },
  watch: {
    'options.source.data': {
      handler(newData, oldData) {
        // Update source data when it changes (e.g., when locations are loaded)
        // This avoids recreating the layer when only data changes
        if (!this.isInitialized || !this.getMap() || !this.options.id || !newData) {
          return
        }
        
        // Skip if this is the initial mount (mounted() will handle it)
        // oldData will be undefined on first mount
        if (oldData === undefined) {
          return
        }
        
        // Skip if data reference is the same (already updated)
        if (newData === oldData) {
          return
        }
        
        const map = this.getMap()
        const layer = map.getLayer(this.options.id)
        if (layer) {
          const sourceId = layer.source
          const source = map.getSource(sourceId)
          if (source && source.type === 'geojson') {
            source.setData(newData)
          }
        }
      },
      deep: true,
    },
  },
  mounted() {
    // only execute when map is available and layer is not already initialized
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

      if (this.before && map.getLayer(this.before)) {
        map.addLayer(this.options, this.before)
      } else {
        map.addLayer(this.options)
      }
    },
    rerender() {
      this.removeLayer()
      this.addLayer()
    },
  },
}