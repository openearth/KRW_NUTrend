<template>
  <v-dialog
    :value="isOpen"
    class="chart-modal"
    width="90%"
    max-width="1000"
    @click:outside="onClickClose"
  >
    <v-card>
      <v-app-bar flat color="white">
        <v-toolbar-title>
          {{ title }}
        </v-toolbar-title>

        <v-spacer />

        <v-btn icon @click="onClickClose">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-app-bar>

      <app-chart v-if="isOpen" />
    </v-card>
  </v-dialog>
</template>

<script>
  import { mapActions, mapState } from 'vuex'
  import AppChart from '~/components/AppChart/AppChart'

  export default {
    name: 'ChartModal',
    components: {
      AppChart,
    },
    computed: {
      ...mapState('modal', [
        'isOpen',
        'title',
      ]),
    },
    methods: {
      ...mapActions('modal', [
        'setIsOpen',
      ]),
      onClickClose() {
        this.setIsOpen({ isOpen: false })
      },
    },
  }
</script>
