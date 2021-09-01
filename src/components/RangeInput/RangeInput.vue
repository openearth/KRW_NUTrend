<template>
  <div class="range-input">
    <div v-if="label" class="text-body-1 pb-3">
      {{ label }}
    </div>
    <v-slider
      v-bind="$attrs"
    />
  </div>
</template>

<script>
  export default {
    name: 'RangeInput',
    inheritAttrs: false,
    props: {
      label: {
        type: String,
        default: '',
      },
    },
  }
</script>
