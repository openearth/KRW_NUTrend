<template>
  <v-container class="filter-data-form" fluid>
    <v-row no-gutters>
      <v-col>
        <div class="pb-3">
          <v-btn
            depressed
            block
            color="primary"
            @click="onResetAllChoices"
          >
            LANDELIJK
          </v-btn>
        </div>
      </v-col>
    </v-row>
    <v-row no-gutters>
      <v-col>
        <div class="text-body-1 pb-3">
          Stroomgebied:
        </div>
        <v-select
          v-model="selectedBasin"
          :items="availableBasins"
          :value="selectedBasin"
          placeholder="selecteer gebied"
          append-icon="mdi-chevron-down"
          clearable
          outlined
          dense
        />
      </v-col>
    </v-row>

    <v-row v-if="selectedBasinHasSubBasins" no-gutters>
      <v-col>
        <div class="text-body-1 pb-3">
          Deelstroomgebied:
        </div>
        <v-select
          v-model="selectedSubBasin"
          :items="availableSubBasins"
          :value="selectedSubBasin"
          placeholder="selecteer gebied"
          append-icon="mdi-chevron-down"
          clearable
          outlined
          dense
        />
      </v-col>
    </v-row>

    <v-row no-gutters>
      <v-col>
        <div class="text-body-1 pb-3">
          Waterbeheerder:
        </div>
        <v-select
          v-model="selectedWaterManager"
          :items="availableWaterManagers"
          :value="selectedWaterManager"
          placeholder="selecteer beheerder"
          append-icon="mdi-chevron-down"
          clearable
          outlined
          dense
        />
      </v-col>
    </v-row>

    <v-row no-gutters>
      <v-col>
        <div v-if="selectedType==='trends'" class="text-body-1 pb-3">
          Monitoringslocatie:
        </div>
        <div v-else class="text-body-1 pb-3">
          Waterlichaam:
        </div>
        <v-select
          v-model="selectedBodyOfWater"
          :items="availableWaterBodies"
          :value="selectedBodyOfWater"
          placeholder="selecteer water"
          append-icon="mdi-chevron-down"
          clearable
          outlined
          dense
        />
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
  import { mapState, mapActions, mapGetters } from 'vuex'

  export default {
    name: 'FilterDataForm',
    data() {
      return {
        selectedBasin: '',
        selectedSubBasin: '',
        selectedWaterManager: '',
        selectedBodyOfWater: '',
      }
    },
    computed: {
      ...mapState('filters', [ 'selectedType' ] ),
      ...mapGetters('filters', [
        'availableBasins',
        'availableSubBasins',
        'availableWaterBodies',
        'availableWaterManagers',
       
        
      ]),
      selectedBasinHasSubBasins() {
        return this.selectedBasin === 'Rijn'
      },
      
    },
    watch: {
      selectedBasin(value) {
        this.setSelectedBasin({ selectedBasin: value })
        this.selectedSubBasin = null
        this.selectedWaterManager = null
        this.selectedBodyOfWater = null
      },
      selectedSubBasin(value) {
        this.setSelectedSubBasin({ selectedSubBasin: value })
      },
      selectedWaterManager(value) {
        this.setSelectedWaterManager({ selectedWaterManager: value })
      },
      selectedBodyOfWater(value) {
        this.setSelectedBodyOfWater({ selectedBodyOfWater: value })
      },

    },

    methods: {
      ...mapActions('filters', [
        'setSelectedBasin',
        'setSelectedSubBasin',
        'setSelectedWaterManager',
        'setSelectedBodyOfWater',
        'resetSelectedSubBasin',
        'resetSelectedBodyOfWater',
        'resetSelectedWaterManager',
      ]),
      ...mapActions('layers',[ 'resetActiveMapLocation' ]),

      onResetAllChoices() {
        //FIXME: it doesn't zoom out when clicked point or zoomed with mouse.
        //What is the general zoom level?
        this.selectedBasin = null
        this.selectedSubBasin = null
        this.selectedWaterManager = null
        this.selectedBodyOfWater = null
        this.resetActiveMapLocation()
        const nlBounds = [ 3.3776388197376783, 50.79448191127488,
                           7.202833778514265, 53.444481041016566 ]
        this.$emit('reset-bounds', nlBounds )
      },
    },

  }
</script>
