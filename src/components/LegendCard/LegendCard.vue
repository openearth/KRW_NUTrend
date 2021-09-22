<template>
  <v-card
    class="mapboxgl-ctrl-bottom-right"
    width="200"
  >
    <v-container fluid>
      <v-row
        v-for="feature in legendGraphics"
        :key="feature.label"
        dense
        align-content
      >
        <v-col>
          <v-avatar
            :color="feature.color"
            size="10"
          />
        </v-col>
        <v-col class="p-0 m-0">
          <label style="widht: 50px;">{{ feature.label }}</label>
        </v-col>
      </v-row>
    </v-container>
  </v-card>
</template>
<script>
  export default {
    props: {
      layer: {
        type:Object,
        default: null,
      },
    },
    data() { 
      return{
        legendGraphics: [ 
          {
            'label': 'kleiner dan 2 mg/l',
            'lowerValue': 0.0,
            'color': '#eff7ff',
          },
          {
            'label': '2 - 4 mg/l',
            'lowerValue': 2.0,
            'color': '#8ee2ec',
          },
          {
            'label': '4 - 6 mg/l',
            'lowerValue': 4.0,
            'color': '#2b65ec',
          },
          {
            'label': '6 - 12 mg/l',
            'lowerValue': 6.0,
            'color': '#151b7e',
          },
          {
            'label': 'groter dan 12 mg/l',
            'lowerValue': 12.0,
            'color': '#000000',
          },
        ],
      }
    },
  }
</script>
<style>
.colored-circles {
  width: 10px;
  height: 10px;
  border-radius: 5px;
}
</style>
