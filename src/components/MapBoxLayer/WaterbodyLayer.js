const SOURCE_ID = 'waterbodies'
const SOURCE_LAYER = 'waterbodies'
const FILL_ID = 'waterbody-highlight-fill'
const LINE_ID = 'waterbody-highlight-line'

export default {
  name: 'waterbody-layer',
  inject: [ 'getMap' ],
  render() {
    return null
  },
  props: {
    tileset: {
      type: String,
      required: true,
    },
    ids: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      isInitialized: false,
    }
  },
  watch: {
    ids() {
      this.updateFilter()
    },
  },
  mounted() {
    if (this.getMap()) {
      this.addLayers()
      this.isInitialized = true
    }
  },
  destroyed() {
    this.removeLayers()
  },
  methods: {
    deferredMountedTo() {
      if (!this.isInitialized) {
        this.addLayers()
        this.isInitialized = true
      }
    },
    filter() {
      return [ 'in', [ 'get', 'owl_code' ], [ 'literal', this.ids ] ]
    },
    addLayers() {
      const map = this.getMap()
      if (!map.getSource(SOURCE_ID)) {
        map.addSource(SOURCE_ID, { type: 'vector', url: `mapbox://${ this.tileset }` })
      }
      map.addLayer({
        id: FILL_ID,
        type: 'fill',
        source: SOURCE_ID,
        'source-layer': SOURCE_LAYER,
        filter: this.filter(),
        paint: {
          'fill-color': '#0077b6',
          'fill-opacity': 0.3,
        },
      })
      map.addLayer({
        id: LINE_ID,
        type: 'line',
        source: SOURCE_ID,
        'source-layer': SOURCE_LAYER,
        filter: this.filter(),
        paint: {
          'line-color': '#005b8f',
          'line-width': 2,
        },
      })
    },
    updateFilter() {
      const map = this.getMap()
      if (map && map.getLayer(FILL_ID)) {
        map.setFilter(FILL_ID, this.filter())
        map.setFilter(LINE_ID, this.filter())
      }
    },
    removeLayers() {
      const map = this.getMap()
      if (!map) {
        return
      }
      [ LINE_ID, FILL_ID ].forEach(id => {
        if (map.getLayer(id)) {
          map.removeLayer(id)
        }
      })
      if (map.getSource(SOURCE_ID)) {
        map.removeSource(SOURCE_ID)
      }
    },
  },
}
