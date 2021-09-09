
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
      <mapbox-wms-layer
        v-for="layer in wmsLayers"
        :key="layer.id"
        :layer="layer"
      />
    </mapbox-map>
  </app-shell>
</template>

<script>
  import { mapActions, mapState } from 'vuex'

  import legalMarkdown from '~/content/legal.md'

  import { MapboxMap, MapboxWmsLayer } from '@deltares/vue-components'

  import AppShell from '~/components/AppShell/AppShell'
  import LegalDialog from '~/components/LegalDialog/LegalDialog'

  export default {
    components: {
      AppShell,
      MapboxMap,
      MapboxWmsLayer,
      LegalDialog,
    },
    data: () => ({
      accessToken: process.env.VUE_APP_MAPBOX_TOKEN,
      legalText: '',
      checkboxes: [
        'Functionele en analytische cookies accepteren',
        'Alleen functionele cookies',
      ],
    }),
    computed: {
      ...mapState({
        wmsLayers: ({ map }) => map.wmsLayers,
      }),
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
