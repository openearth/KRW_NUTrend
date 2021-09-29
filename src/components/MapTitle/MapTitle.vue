<template>
  <v-card class="map-title" flat>
    <p class="map-title-text text-body-2">
      {{ title }}
    </p>
  </v-card>
</template>

<script>
  export default {
    props: {
      title: {
        type: String,
        default: '',
      },
    },
  }
</script>

<style lang="scss">
  .map-title {
    position: absolute;
    z-index: 1;
    top: $spacing-default;
    left: $spacing-default;
    padding: $spacing-smaller $spacing-small;
    background-color: $color-white;
    user-select: none;
  }

  .map-title .map-title-text {
    margin: 0;
  }
</style>
