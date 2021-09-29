<template>
  <v-card
    v-if="thresholds"
    class="map-legend"
    flat
  >
    <v-list dense>
      <v-list-item-group>
        <v-list-item
          v-for="(threshold, index) in thresholds"
          :key="index"
        >
          <v-list-item-icon>
            <v-sheet
              :color="threshold.color"
              height="24"
              rounded
              width="24"
            />
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title v-text="threshold.label" />
          </v-list-item-content>
        </v-list-item>
      </v-list-item-group>
    </v-list>
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

<style lang="scss">
  .map-legend {
    position: absolute;
    pointer-events: none;
    z-index: 2;
    bottom: $spacing-medium;
    right: $spacing-default;
  }
</style>
