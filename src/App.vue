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
        <div v-if="activeMap" class="mapbox-map__title">
          <p class="mapbox-map__title-text text-body-2">
            {{ activeMap.title }}
          </p>
        </div>
      </v-fade-transition>
      <v-mapbox-layer
        v-for="layer in layers"
        :key="layer.id"
        :options="layer"
      />
      <map-controls v-if="activeMap" :layer="activeMap" />
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


  export default {
    components: {
      AppShell,
      MapboxMap,
      LegalDialog,
      MapControls,

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
      ...mapState('layers', [ 'activeMap' ]),
      ...mapGetters('layers', [ 'filteredMap' ]),
    },
    watch: {
      filteredMap: {
        handler(value) {
          if (value) {
            // Want to empty the layers every time we click to open a new one.
            this.layers = []
            if (this.filteredMap?.data) {
              this.layers.push(buildGeojonLayer(this.filteredMap))
            }
          }
        },
      },
    },
    created() {
      this.legalText = legalMarkdown
      this.getLocations()
    },
    methods: {
      ...mapActions('locations', [ 'getLocations' ]) ,
      ...mapActions('layers', [ 'getDefaultMapLayer' ]),
    },
  }
</script>

<style lang="scss">
  .mapbox-map__title {
    position: absolute;
    z-index: 1;
    top: $spacing-default;
    left: $spacing-default;
    padding: $spacing-smaller $spacing-small;
    background-color: $color-white;
    user-select: none;
  }

  .mapbox-map__title .text-body-2 {
    margin: 0;
  }
</style>
