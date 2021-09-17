<template>
  <app-shell header-title="KRW: NUTrend">
    <template slot="header-right">
      <v-btn href="http://krw-nutrend.nl/site/data/download/11203728-006-BGS-0002_v1.1-KRW%20-%20Toestand-%20en%20trendanalyse%20voor%20nutrienten1.pdf" text>
        Meer informatie
      </v-btn>
      <v-btn href="mailto:asdf@asdf.nl" text>
        Contact
      </v-btn>
    </template>

    <legal-dialog
      title="KRW-NUTrend"
      button-text="Accepteren"
      :body="legalText"
      :checkboxes="checkboxes"
    />

    <mapbox-map
      slot="map"
      :access-token="accessToken"
    >
      <v-mapbox-layer
        v-for="layer in layers"
        :key="layer.id"
        :options="layer"
      /> 
    </mapbox-map>
  </app-shell>
</template>


<script>
  import { mapActions, mapState, mapGetters } from 'vuex'
  import legalMarkdown from '~/content/legal.md'
  import { MapboxMap } from '@deltares/vue-components'
  import AppShell from '~/components/AppShell/AppShell'
  import LegalDialog from '~/components/LegalDialog/LegalDialog'
  import buildGeojonLayer  from '~/lib/build-geojson-layer'
  
  export default {
    components: {
      AppShell,
      MapboxMap,
      LegalDialog,

    },
    data: () => ({
      accessToken: process.env.VUE_APP_MAPBOX_TOKEN,
      legalText: '',
      checkboxes: [
        'Functionele en analytische cookies accepteren',
        'Alleen functionele cookies',
      ],
      layers: [],

    }),
    computed: { 
      ...mapState('layers', [ 'selectedLayer' ]), 
      ...mapGetters('layers', [ 'availableLayer' ]),

      ...mapGetters('filters', [ 'availableWaterBodies' ]),
    },
    watch: { 
      availableLayer() {
        //Want to empty the layers every time we click to open a new one. 
        this.layers = []
        this.layers.push(buildGeojonLayer(this.availableLayer))
      },
    },

    mounted() {
      this.legalText = legalMarkdown
    },
    created() {
      this.legalText = legalMarkdown
      this.getLocations()
      this.getInitialMapData()
    },
    methods: {
      ...mapActions('locations', [ 'getLocations' ]) ,
      ...mapActions('layers', [ 'getInitialMapData' ]),
    },
  }
</script>
