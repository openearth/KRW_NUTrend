<template>
  <v-card
    class="map-legend"
    flat
    max-height="200"
    max-width="150"
  >
    <div class="legend-content">
      <v-list>
        <v-list-item-group>
          <v-list-item
            v-for="(item, index) in items"
            :key="index"
          >
            <v-list-item-avatar :color="item.color" size="8" />
            <v-list-item-content>
              <span class="text-body-2">
                {{ item.label | capitalize }}
              </span>
            </v-list-item-content>
          </v-list-item>
        </v-list-item-group>
      </v-list>
    </div>
  </v-card>
</template>

<script>
  import capitalizeString from '~/lib/capitalize-string'

  export default {
    filters: {
      capitalize: (value) => {
        if (!value) {
          return ''
        }
        return capitalizeString(value)
      },
    },
    props: {
      items: {
        type: Array,
        default: () => [],
      },
    },
  }
</script>

<style scoped lang="scss">
  .map-legend {
    position: absolute;
    z-index: 5;
    right: $spacing-default;
    bottom: $spacing-large;
    pointer-events: none;
  }

  .v-application .text-body-2 {
    font-size: .625rem !important;
  }

  .v-list-item {
    height: 30px;
    min-height: 30px;
  }

</style>
