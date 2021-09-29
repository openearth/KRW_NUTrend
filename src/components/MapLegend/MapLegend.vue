<template>
  <v-card class="map-legend" flat>
    <v-list dense>
      <v-list-item-group>
        <v-list-item v-for="(item, index) in items" :key="index">
          <v-list-item-icon>
            <v-sheet
              :color="item.color"
              height="24"
              rounded
              width="24"
            />
          </v-list-item-icon>
          <v-list-item-content>
            <span class="text-body-2">
              {{ item.label }}
            </span>
          </v-list-item-content>
        </v-list-item>
      </v-list-item-group>
    </v-list>
  </v-card>
</template>

<script>
  export default {
    props: {
      items: {
        type: Array,
        default: () => [],
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
