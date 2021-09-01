<template>
  <v-container class="data-type-form" fluid>
    <v-row>
      <v-col>
        <select-input
          label="Soort informatie:"
          :items="typeList"
          :value="selectedType"
        />
      </v-col>
    </v-row>

    <v-row no-gutters>
      <v-col>
        <select-input
          label="Stof:"
          :items="particalList"
          :value="selectedPartical"
        />
      </v-col>
    </v-row>

    <v-row no-gutters>
      <v-col>
        <range-input
          label="Jaar:"
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
  import RangeInput from '~/components/RangeInput/RangeInput'
  import SelectInput from '~/components/SelectInput/SelectInput'

  export default {
    name: 'DataTypeForm',
    components: {
      RangeInput,
      SelectInput,
    },
    data() {
      return {
        typeList: ['Toestand', 'Trends', 'Concentratie'],
        selectedType: 'Toestand',
        particalList: ['Stikstof', 'Fosfor', 'DIN (Anorganisch stikstof)'],
        selectedPartical: 'Stikstof',
        currentYear: new Date().getFullYear(),
        selectedYear: new Date().getFullYear(),
      }
    },
  }
</script>
