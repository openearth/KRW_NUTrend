<template>
  <v-card
    class="map-legend"
    flat
    max-height="300"
    max-width="250"
  >
    <div class="legend-content">
      <v-card-title class="justify-center legend-title">
        {{ title }}
      </v-card-title>
      <v-list>
        <v-list-item-group>
          <v-list-item
            v-for="(item, index) in legendItems"
            :key="index"
          >
            <v-list-item-avatar
              class="border"
              :color="item.color"
              size="9"
            />
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
      title: {
        type: String,
        default: '',
      },
    },
    computed: {
      legendItems() {
        if (!this.items.length) {
          return []
        }
        const transparentItem = {
          color: 'rgba(255, 255, 255, 0)',
          label: 'Geen data',
        }
        return [ ...this.items, transparentItem ]
      },
    },
    watch: {
      items() {
        console.log('item', this.items)
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
 .legend-title {
   font-size: 0.875rem;
   padding-bottom: 0px;
  
 }

  .v-application .text-body-2 {
    font-size: 0.75rem !important;
  }

  .v-list-item {
    height: 30px;
    min-height: 30px;
  }
  .border {
    border: 0.5px solid black !important;
  }

</style>
