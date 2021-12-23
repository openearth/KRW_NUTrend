<template>
  <app-shell header-title="KRW-NUTrend" @reset-bounds="onResetBounds">
    <template slot="header-right">
      <v-menu offset-y>
        <template #activator="{ on, attrs }">
          <v-btn 
            text
            v-bind="attrs"
            v-on="on"
          >
            Meer informatie
          </v-btn>
        </template>
        <v-list>
          <v-list-item
            v-for="(report, index) in reports"
            :key="index"
            :href="report.url"
            target="_blank"
          >
            <v-list-item-title>{{ report.title }}</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
     
      <v-btn href="mailto:krw-nutrend@deltares.nl" text>
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
      <map-title v-if="activeMap" :title="activeMap.title " />
    </v-fade-transition>
    <v-fade-transition mode="out-in">
      <map-legend
        v-if="showLegend"
        :items="legend"
        :title="legendTitle"
      />
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
        <map-layer
          :options="activeMapLayer"
        />
      </div>
      <div v-if="activeDiffMapLayers.length">
        <map-layer
          v-for="layer in activeDiffMapLayers"
          :key="layer.id" 
          :options="layer"
        /> 
      </div>
      <v-mapbox-scale-control :options="scaleBarOptions" />
      <map-controls v-if="activeMapLayer" :layer="activeMapLayer" />
      <div v-if="activeDiffMapLayers.length">
        <map-controls
          v-for="layer in activeDiffMapLayers"
          :key="layer.id" 
          :layer="layer"
        /> 
      </div>
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
  import MapLayer from '~/components/MapBoxLayer/MapLayer'
  import MapControlsZoom from '~/components/MapControls/MapControlsZoom'
  import reports from '~/config/reports.json'

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
      MapLayer,
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
      reports: reports,
      diffLayers: [],
    }),
    computed: {
      ...mapState('layers', [ 'activeMap', 'legend', 'timeOption', 'clickedPointBbox' ]),
      ...mapState('filters', [ 'selectedTimestamp' ]),
      ...mapGetters('layers', [ 'activeMapLayer', 'activeDiffMapLayers', 'availableBaseMap', 'layerBbox', 'legendTitle' ]),
      showLegend() {
        return this.legend.length
      },
    },
    watch: { 
      clickedPointBbox() {
        if (this.clickedPointBbox.length) {
          this.zoomBounds = this.clickedPointBbox
        }
      },
      layerBbox() { 
        this.zoomBounds  = this.layerBbox
      },
      activeDiffMapLayers() {
        if (this.activeDiffMapLayers.length === 3) {
          this.diffLayers = this.activeDiffMapLayers
          this.hardReload = true
        }else{
          this.diffLayers = []
          this.hardReload = false
        }
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
      onResetBounds(event) {
        this.zoomBounds = event
      },
    },
  }
</script>
