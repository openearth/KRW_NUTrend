<template>
  <app-shell header-title="KRW-NUTrend">
    <template slot="header-right">
      <v-btn href="http://krw-nutrend.nl/site/data/download/11203728-006-BGS-0002_v1.1-KRW%20-%20Toestand-%20en%20trendanalyse%20voor%20nutrienten1.pdf" text>
        Meer informatie
      </v-btn>
      <v-btn href="mailto:@krw-nutrend@deltares.nl" text>
        Contact
      </v-btn>
    </template>

    <legal-dialog
      title="KRW-NUTrend"
      button-text="Accepteren"
      :body="legalText"
      :checkboxes="checkboxes"
    />
    <v-fade-transition mode="out-in">
      <map-title v-if="activeMap" :title="activeMap.title" />
    </v-fade-transition>
    <v-fade-transition mode="out-in">
      <map-title v-if="activeMap && timeOption" :title="activeMap.title + selectedTimestamp.substring(0,4)" />
    </v-fade-transition>
    <v-fade-transition mode="out-in">
      <map-legend v-if="showLegend" :items="legend" />
    </v-fade-transition>
    <mapbox-map
      slot="map"
      :access-token="accessToken"
    >
      <base-layer
        v-if="availableBaseMap"
        :options="availableBaseMap"
        @base-layer-is-loaded="onBaseLayerIsLoaded"
      />
      
      <div v-if="baseLayerIsAvailable && activeMapLayer" :key="activeMapLayer.id">
        <v-mapbox-layer
          :options="activeMapLayer"
        />
      </div>
      <v-mapbox-scale-control :options="scaleBarOptions" />
      <map-controls v-if="activeMapLayer" :layer="activeMapLayer" />
      <map-controls-zoom
        v-if="zoomBounds.length"
        :bounds="zoomBounds"
      />
    </mapbox-map>
  </app-shell>
</template>


<script>
  import { mapActions, mapGetters, mapState } from 'vuex'

  import legalMarkdown from '~/content/legal.md'
  

  import { MapboxMap } from '@deltares/vue-components'

  import AppShell from '~/components/AppShell/AppShell'
  import LegalDialog from '~/components/LegalDialog/LegalDialog'
  import MapControls from '~/components/MapControls/MapControls'
  import MapLegend from '~/components/MapLegend/MapLegend'
  import MapTitle from '~/components/MapTitle/MapTitle'
  import BaseLayer from '~/components/MapBoxLayer/BaseLayer'
  import MapControlsZoom from '~/components/MapControls/MapControlsZoom'


  export default {
    components: {
      AppShell,
      MapboxMap,
      LegalDialog,
      MapControls,
      MapLegend,
      MapTitle,
      BaseLayer,
      MapControlsZoom,
    },
    data: () => ({
      accessToken: process.env.VUE_APP_MAPBOX_TOKEN,
      legalText: '',
      checkboxes: [
        'Functionele en analytische cookies accepteren',
        'Alleen functionele cookies',
      ],
      layers: [],
      scaleBarOptions: {
        maxWidth: 80,
        unit: 'metric',
      },
      mapLayer: null,
      baseLayerIsAvailable: false,
      zoomBounds: [],
    }),
    computed: {
      ...mapState('layers', [ 'activeMap', 'legend', 'timeOption', 'clickedPointBbox' ]),
      ...mapState('filters', [ 'selectedTimestamp' ]),
      ...mapGetters('layers', [ 'activeMapLayer', 'availableBaseMap', 'layerBbox' ]),
      showLegend() {
        return this.legend.length
      },
    },
    watch: { 
      clickedPointBbox() {
        console.log('clickedPointBbox changed', this.clickedPointBbox)
        if (this.clickedPointBbox.length) {
          this.zoomBounds = this.clickedPointBbox
        }
      },
      layerBbox() { 
        console.log('layerBbox changed', this.layerBbox)
        this.zoomBounds  = this.layerBbox
      },
    },
    created() {
      this.legalText = legalMarkdown
      this.getLocations()
    },
    methods: {
      ...mapActions('locations', [ 'getLocations' ]),
      onBaseLayerIsLoaded(){
        this.baseLayerIsAvailable = true
      },
    },
  }
</script>
