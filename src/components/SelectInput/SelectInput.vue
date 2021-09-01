<template>
  <div class="select-input">
    <div v-if="label" class="text-body-1 pb-3">
      {{ label }}
    </div>
    <v-select
      v-bind="$attrs"
      append-icon="mdi-chevron-down"
      outlined
      dense
    />
  </div>
</template>

<script>
  export default {
    name: 'SelectInput',
    inheritAttrs: false,
    props: {
      label: {
        type: String,
        default: '',
      },
    },
  }
</script>
