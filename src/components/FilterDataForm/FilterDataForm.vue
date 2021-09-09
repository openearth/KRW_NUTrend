<template>
  <v-container class="filter-data-form" fluid>
    <v-row no-gutters>
      <v-col>
        <div class="text-body-1 pb-3">
          Stroomgebied:
        </div>
        <v-select
          :items="availableBasins"
          :value="selectedBasin"
          placeholder="selecteer gebied"
          append-icon="mdi-chevron-down"
          clearable
          outlined
          dense
          @input="onSelectedBasin"
        />
      </v-col>
    </v-row>

    <v-row v-if="selectedBasinHasSubBasins" no-gutters>
      <v-col>
        <div class="text-body-1 pb-3">
          Deelstroomgebied:
        </div>
        <v-select
          :items="availableSubBasins"
          :value="selectedSubBasin"
          placeholder="selecteer gebied"
          append-icon="mdi-chevron-down"
          clearable
          outlined
          dense
          @input="onSelectedSubBasin"
        />
      </v-col>
    </v-row>

    <v-row no-gutters>
      <v-col>
        <div class="text-body-1 pb-3">
          Waterbeheerder:
        </div>
        <v-select
          :items="availableWaterManagers"
          :value="selectedWaterManager"
          placeholder="selecteer beheerder"
          append-icon="mdi-chevron-down"
          clearable
          outlined
          dense
          @input="onSelectedWaterManager"
        />
      </v-col>
    </v-row>

    <v-row no-gutters>
      <v-col>
        <div class="text-body-1 pb-3">
          Waterlichaam:
        </div>
        <v-select
          :items="availableWaterBodies"
          :value="selectedBodyOfWater"
          placeholder="selecteer water"
          append-icon="mdi-chevron-down"
          clearable
          outlined
          dense
          @input="onSelectedBodyOfWater"
        />
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
  import { mapActions, mapGetters } from 'vuex'

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
      ]),
      onSelectedBasin(value) {
        this.selectedBasin = value
      },
      onSelectedSubBasin(value) {
        this.selectedSubBasin = value
      },
      onSelectedWaterManager(value) {
        this.selectedWaterManager = value
      },
      onSelectedBodyOfWater(value) {
        this.selectedBodyOfWater = value
      },
    },
  }
</script>
