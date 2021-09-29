<template>
  <v-card class="mapboxgl-ctrl-bottom-right" width="190">
    <v-container fluid>
      <v-row
        v-for="threshold in thresholds"
        :key="threshold.label"
        no-gutters
        align="start"
      >
        <v-col class="pl-6">
          <v-avatar
            :color="threshold.color"
            size="10"
          />
        </v-col>
        <v-col class="pr-6" align="left">
          <label>{{ threshold.label }}</label>
        </v-col>
      </v-row>
    </v-container>
  </v-card>
</template>
<script>
  export default {
    props: {
      legendGraphic: {
        type: Object,
        default: null,
      },
    },
    computed: { 
      thresholds() { 
        if (this.legendGraphic) {
          return this.legendGraphic.legend
        }
        return []
      },
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
