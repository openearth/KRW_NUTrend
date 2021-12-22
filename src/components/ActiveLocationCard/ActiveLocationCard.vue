<template>
  <v-card class="active-location-card" outlined>
    <v-card-title class="text-title">
      Punt informatie
    </v-card-title>
    <v-card-text>
      <p class="text-body-2">
        Naam: {{ name }}
      </p>
      <p class="text-body-2">
        OWL: {{ id }}
      </p>
      <div v-if="!showTwoValues">
        <p class="text-body-2">
          Waarde: {{ formattedValue }}
        </p>
      </div>
      <div v-if="showTwoValues">
        <p class="text-body-2">
          {{ compareYear }}: {{ formattedValue }}
        </p>
        <p class="text-body-2">
          2020: {{ formattedValue2 }}
        </p>
      </div>
    </v-card-text>
  </v-card>
</template>

<script>
  export default {
    props: {
      name: {
        type: String,
        default: '',
      },
      id: {
        type: String,
        default: '',
      },
      value: {
        type: [ String, Number ],
        default: '',
      },
      value2: {
        type: [ String, Number ],
        default: null,
      },
      selectedType: {
        type: String, 
        default: '',
      },
      thresholds: {
        type: Array,
        default: ()=>[],
      },
      compareYear: { 
        type: String,
        default: '',
      },
    },
    computed: {
      formattedValue() {
        if (this.selectedType === 'state') {
          return this.formatValue(this.value)
        }
        return this.value
      },
      formattedValue2() {
        if (this.selectedType === 'state') {
          return this.formatValue(this.value2)
        }
        return this.value2
      },
      showTwoValues() {
        if (this.value2) {
          return true
        }
        return false
      },
    },
    methods: { 
      formatValue(value) {
        if (!value || value === '999.0') {
          return 'Geen data'
        }
        const filterByValue = ({ lowerValue }) => lowerValue === parseInt(value)
        return this.thresholds.find(filterByValue).label
      },
    },
  }

</script>

<style lang="scss">
  .text-title {
    font-size: 1rem !important;
  }

  .active-location-card .text-body-2 {
    margin-bottom: 0;
  }

</style>
