<template>
  <v-container class="data-type-form" fluid>
    <v-row>
      <v-col>
        <div class="text-body-1 pb-3">
          Soort informatie:
        </div>
        <v-select
          :items="typeList"
          :value="selectedType"
          append-icon="mdi-chevron-down"
          outlined
          dense
          @input="onSelectedType"
        />
      </v-col>
    </v-row>

    <v-row no-gutters>
      <v-col>
        <div class="text-body-1 pb-3">
          Stof:
        </div>
        <v-select
          :items="particalList"
          :value="selectedPartical"
          append-icon="mdi-chevron-down"
          outlined
          dense
          @input="onSelectedPartical"
        />
      </v-col>
    </v-row>

    <v-row no-gutters>
      <v-col>
        <div class="text-body-1 pb-3">
          Jaar:
        </div>
        <v-slider
          :thumb-label="true"
          min="1991"
          :max="currentYear"
          :value="selectedYear"
        />
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
  import { mapActions } from 'vuex'

  export default {
    name: 'DataTypeForm',
    data() {
      return {
        typeList: [
          { text: 'Toestand', value: 'state' },
          { text: 'Trends', value: 'trends' },
          { text: 'Concentratie', value: 'concentration' },
        ],
        selectedType: 'state',
        particalList: [
          { text: 'Stikstof', value: 'ntot' },
          { text: 'Fosfor', value: 'ptot' },
          { text: 'DIN (Anorganisch stikstof)', value: 'din' },
        ],
        selectedPartical: 'ntot',
        currentYear: new Date().getFullYear(),
        selectedYear: new Date().getFullYear(),
      }
    },
    watch: {
      selectedType(value) {
        this.setSelectedType({ selectedType: value })
      },
      selectedPartical(value) {
        this.setSelectedPartical({ selectedPartical: value })
      },
    },
    methods: {
      ...mapActions('filters', [
        'setSelectedType',
        'setSelectedPartical',
      ]),
      onSelectedType(value) {
        this.selectedType = value
      },
      onSelectedPartical(value) {
        this.selectedPartical = value
      },
    },
  }
</script>
