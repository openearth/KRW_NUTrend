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
      <v-fade-transition mode="out-in">
        <map-title v-if="activeMap" :title="activeMap.title" />
      </v-fade-transition>

      <v-mapbox-layer
        v-for="layer in layers"
        :key="layer.id"
        :options="layer"
      />

      <map-controls v-if="filteredMap" :layer="filteredMap" />

      <v-fade-transition mode="out-in">
        <map-legend v-if="showLegend" :items="legendGraphic" />
      </v-fade-transition>
    </mapbox-map>
  </app-shell>
</template>


<script>
  import { mapActions, mapGetters, mapState } from 'vuex'

  import legalMarkdown from '~/content/legal.md'
  import buildGeojonLayer  from '~/lib/build-geojson-layer'

  import { MapboxMap } from '@deltares/vue-components'

  import AppShell from '~/components/AppShell/AppShell'
  import LegalDialog from '~/components/LegalDialog/LegalDialog'
  import MapControls from '~/components/MapControls/MapControls'
  import MapLegend from '~/components/MapLegend/MapLegend'
  import MapTitle from '~/components/MapTitle/MapTitle'

  export default {
    components: {
      AppShell,
      MapboxMap,
      LegalDialog,
      MapControls,
      MapLegend,
      MapTitle,
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
      ...mapState('layers', [ 'activeMap', 'legendGraphic' ]),
      ...mapGetters('layers', [ 'filteredMap' ]),
      showLegend() {
        return this.legendGraphic.length
      },
    },
    watch: {
      filteredMap: {
        handler(value) {
          this.layers = []
          if (value) {
            const layers = buildGeojonLayer(this.filteredMap)
            this.layers.push(layers)
          }
        },
      },
    },
    created() {
      this.legalText = legalMarkdown
      this.getLocations()
    },
    methods: {
      ...mapActions('locations', [ 'getLocations' ]),
    },
  }
</script>
