<template>
  <v-container class="data-type-form" fluid>
    <v-row>
      <v-col>
        <div class="text-body-1 pb-3">
          Soort informatie:
        </div>
        <v-select
          :items="typeList"
          :value="selectedType"
          append-icon="mdi-chevron-down"
          outlined
          dense
          @input="onSelectedType"
        />
      </v-col>
    </v-row>

    <v-row no-gutters>
      <v-col>
        <div class="text-body-1 pb-3">
          Stof:
        </div>
        <v-select
          :items="particleList"
          :value="selectedParticle"
          placeholder="selecteer stof"
          append-icon="mdi-chevron-down"
          outlined
          dense
          @input="onSelectedParticle"
        />
      </v-col>
    </v-row>

    <v-row no-gutters>
      <v-col>
        <div class="text-body-1 pb-3">
          Jaar:
        </div>
        <v-slider
          :thumb-label="true"
          min="1991"
          :max="currentYear"
          :value="selectedYear"
          @change="updateSelectedYear"
          @end="onSelectedYear"
        />
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
  import { mapActions, mapState } from 'vuex'

  import getISOTimestamp from '~/lib/get-iso-timestamp'

  import services from '~/config/services.json'

  export default {
    name: 'DataTypeForm',
    data() {
      return {
        typeList: [],
        currentYear: new Date().getFullYear(),
        selectedYear: '',
      }
    },
    computed: {
      ...mapState('filters', [
        'selectedTimestamp',
        'selectedType',
        'selectedParticle',
      ]),
      particleList() {
        const service = services.find(service => service.id === this.selectedType)

        return service.areas
          .map(area => ({ text: area.name, value: area.id }))
          .sort((a, b) => a.text.localeCompare(b.text))
      },
    },
    watch: {
      selectedTimestamp: {
        immediate: true,
        handler(value) {
          if (value) {
            this.selectedYear = new Date(value).getFullYear().toString()
          }
        },
      },
    },
    created() {
      this.createTypeList(services)
    },
    methods: {
      ...mapActions('filters', [
        'setSelectedType',
        'setSelectedParticle',
        'setSelectedTimestamp',
      ]),
      onSelectedType(value) {
        this.setSelectedType({ selectedType: value })
      },
      onSelectedParticle(value) {
        this.setSelectedParticle({ selectedParticle: value })
      },
      onSelectedYear(value) {
        const timestamp = getISOTimestamp(value)
        this.setSelectedTimestamp({ selectedTimestamp: timestamp })
      },
      updateSelectedYear(value) {
        this.selectedYear = value
      },
      createTypeList(services) {
        this.typeList = services
          .map(service => ({ text: service.name, value: service.id }))
          .sort((a, b) => a.text.localeCompare(b.text))

        // set first option as selected by default.
        this.setSelectedType({ selectedType: this.typeList[0].value })
      },
    },
  }
</script>
