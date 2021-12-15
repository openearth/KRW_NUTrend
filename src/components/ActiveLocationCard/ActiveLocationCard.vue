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
      <p class="text-body-2">
        Waarde: {{ formattedValue }}
      </p>
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
      valueOld: {
        type: [ String, Number ],
        default: '',
        required: false,
      },
      selectedType: {
        type: String, 
        default: '',
      },
      thresholds: {
        type: Array,
        default: ()=>[],
      },
    },
    computed: {
      formattedValue() {
        if (this.selectedType === 'state') {
          console.log('call format function for state')
          return this.formatValue(this.value)
        }
        return this.value
      },
    },
    methods: { 
      formatValue(value) {
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
