<template>
  <v-card class="active-location-card" outlined>
    <v-card-title>Punt informatie</v-card-title>
    <v-card-text>
      <p class="text-body-2">
        Naam: {{ name }}
      </p>
      <p class="text-body-2">
        OWL: {{ id }}
      </p>
      <p class="text-body-2">
        Waarde: {{ value }}
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
    },
  }

</script>

<style lang="scss">
  .active-location-card .text-body-2 {
    margin-bottom: 0;
  }
</style>
