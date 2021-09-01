<template>
  <v-card class="plot-card">
    <div class="d-flex flex-no-wrap justify-space-between">
      <div>
        <v-card-title>{{ title }}</v-card-title>
        <v-card-actions>
          <v-btn depressed>
            View details
          </v-btn>
        </v-card-actions>
      </div>
      <v-avatar
        class="ma-3"
        size="92"
        tile
      >
        <v-img :src="image" />
      </v-avatar>
    </div>
  </v-card>
</template>

<script>
  export default {
    name: 'PlotCard',
    props: {
      title: {
        type: String,
        required: true,
      },
      image: {
        type: String,
        required: true,
      },
    },
  }
</script>
