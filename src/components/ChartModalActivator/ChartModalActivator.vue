<template>
  <v-card class="chart-modal-activator" outlined>
    <div class="d-flex flex-no-wrap justify-space-between">
      <div>
        <v-card-title>{{ title }}</v-card-title>
        <v-card-actions>
          <v-btn depressed @click="onButtonClick">
            Bekijken
          </v-btn>
        </v-card-actions>
      </div>
      <v-avatar
        class="ma-3"
        size="92"
        tile
      >
        <v-img :src="require(`@/assets/graph-icon.jpeg`)" />
      </v-avatar>
    </div>
  </v-card>
</template>

<script>
  import { mapActions } from 'vuex'

  export default {
    name: 'ChartModalActivator',
    inheritAttrs: false,
    props: {
      title: {
        type: String,
        required: true,
      },
      modalTitle: {
        type: String,
        required: true,
      },
      toestandChartType: {
        type: String,
        required: false,
        default: '',
      },
    },
    methods: {
      ...mapActions('modal', [
        'setIsOpen',
        'setModalTitle',
        'setToestandChartType',
      ]),
      onButtonClick() {
        this.setIsOpen({ isOpen: true })
        this.setModalTitle({ title: this.modalTitle })
        this.setToestandChartType({ type: this.toestandChartType })
      },
    },

  }
</script>
