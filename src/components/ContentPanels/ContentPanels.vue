<template>
  <v-col>
    <v-expansion-panels v-if="selectedType && selectedParticle">
      <v-expansion-panel v-for="panel in panels" :key="panel.id">
        <v-expansion-panel-header class="text-caption" @click="onPanelHeaderClick(panel.layer)">
          {{ panel.title }}
        </v-expansion-panel-header>
        <v-expansion-panel-content>
          <vue-markdown class="markdown" :source="panel.content" />
        </v-expansion-panel-content>
      </v-expansion-panel>
    </v-expansion-panels>
  </v-col>
</template>

<script>
  import { mapActions, mapState } from 'vuex'
  import VueMarkdown from 'vue-markdown-render'

  import services from '~/config/services.json'

  export default {
    components: {
      VueMarkdown,
    },
    computed: {
      ...mapState('filters', [
        'selectedType',
        'selectedParticle',
      ]),
      mappedServices() {
        const type = services.find(service => service.id === this.selectedType)
        const area = type.areas.find(area => area.id === this.selectedParticle)

        return area.services
      },
      panels() {
        return this.mappedServices.map(({ id, name, layer }) => {
          const content = this.importFileContent(id)

          return {
            content: content.default,
            id,
            title: name,
            layer,
          }
        })
      },
    },
    methods: {
      ...mapActions('map', [ 'getTimeSeries' ]),
      importFileContent(fileName) {
        return require(`~/content/services/${ this.selectedType }/${ this.selectedParticle }/${ fileName }.md`)
      },
      onPanelHeaderClick(layer) {
        if (!layer.url) {
          return
        }

        this.getTimeSeries({ url: layer.url })
      },
    },
  }
</script>
