<template>
  <v-col>
    <v-expansion-panels v-if="selectedType && selectedParticle">
      <v-expansion-panel v-for="panel in panels" :key="panel.id">
        <v-expansion-panel-header class="text-caption">
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
  import { mapState } from 'vuex'
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
        return this.mappedServices.map(({ id, name }) => {
          const content = this.importFileContent(id)

          return {
            id,
            title: name,
            content: content.default,
          }
        })
      },
    },
    methods: {
      importFileContent(fileName) {
        return require(`~/content/services/${ this.selectedType }/${ this.selectedParticle }/${ fileName }.md`)
      },
    },
  }
</script>
