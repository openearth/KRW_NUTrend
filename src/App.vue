
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
      :access-token="accessToken"
    >
      <map-layer
        v-for="layer in layers"
        :key="layer.id"
        :options="layer" 
      /> 
    </mapbox-map>
  </app-shell>
</template>

<script>
  
  import legalMarkdown from '~/docs/legal.md'

  import { MapboxMap } from '@deltares/vue-components'

  import AppShell from '~/components/AppShell/AppShell'
  import LegalDialog from '~/components/LegalDialog/LegalDialog'
  import MapLayer from './map-layer'
  import { mapState } from 'vuex'

  export default {
    components: {
      AppShell,
      MapboxMap,
      LegalDialog,
      MapLayer,
    },
    data: () => ({
      accessToken: process.env.VUE_APP_MAPBOX_TOKEN,
      legalText: '',
      checkboxes: [
        'Functionele en analytische cookies accepteren',
        'Alleen functionele cookies',
      ],
      /*       geojson_data: {
        "type": "FeatureCollection",
        "features": [
          {
            "type": "Feature",
            "properties": {
              "locationId": "NL02L10a",
              "value": 4,
            },
            "geometry": {
              "type": "Point",
              "coordinates": [
                6.235080651990514,
                53.016662661129416,
              ],
            },
          },
          {
            "type": "Feature",
            "properties": {
              "locationId": "NL12_210",
              "value": 3,
            },
            "geometry": {
              "type": "Point",
              "coordinates": [
                4.841526304081336,
                52.55228533949656,
              ],
            },
          },
        ],
      }, */
      layers: [],

    }),
    computed: { 
      ...mapState({ 
        testData: (state) => state.testData,
      }),
    },
    watch: {
      testData() {
        console.log('testData in App.vue', this.testData)
        this.addLayer()
      },

    },
    mounted() {
      this.legalText = legalMarkdown
     
    },
    methods: { 
      addLayer(){
        const layer =  {
          'id': 'test-layer',
          'type': 'circle',
          'source': {
            'type':'geojson',
            'data': this.testData,
          },
          'paint': {
            'circle-radius': 6,
            'circle-color': [
              'match',
              [ 'get', 'value' ],
              '4',
              '#E51B23',
              '3',
              '#a0ee45',
              '#ccc',

            ],
        
          },
        }
        this.layers.push(layer)
        console.log("layers after push", this.layers)
      },
    },
  }
</script>
