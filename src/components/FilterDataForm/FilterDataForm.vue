<template>
  <v-container class="filter-data-form" fluid>
    <v-row no-gutters>
      <v-col>
        <select-input
          label="Stroomgebied:"
          :items="areaList"
          :value="selectedArea"
          placeholder="selecteer gebied"
          clearable
        />
      </v-col>
    </v-row>

    <v-row no-gutters>
      <v-col>
        <select-input
          label="Waterbeheerder:"
          :items="waterManagerList"
          :value="selectedWaterManager"
          placeholder="selecteer beheerder"
          clearable
        />
      </v-col>
    </v-row>

    <v-row no-gutters>
      <v-col>
        <select-input
          label="Waterlichaam:"
          :items="bodyOfWaterList"
          :value="selectedBodyOfWater"
          placeholder="selecteer water"
          clearable
        />
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
  import SelectInput from '~/components/SelectInput/SelectInput'

  export default {
    name: 'FilterDataForm',
    components: {
      SelectInput,
    },
    data() {
      return {
        areaList: [ 'Eems', 'Maas', 'Rijn', 'Rijn-Noord', 'Rijn-Oost', 'Rijn-West', 'Schelde' ],
        selectedArea: '',
        waterManagerList: [ 'Aa en Maas', 'Amstel Gooi en Vecht', 'Brabantse Delta', 'Delfland', 'Dommel', 'Drents Overijsselse Delta', 'Fryslan', 'Hollands Noorderkwartier', 'Hollandse Delta', 'Hunze en Aa\'s', 'Limburg', 'Noorderzijlvest', 'Rijkswaterstaat', 'Rijn en IJssel', 'Rijnland', 'Rivierenland', 'Scheldestromen', 'Schieland en Krimpenerwaard', 'Stichtse Rijnlanden', 'Vallei en Veluwe', 'Vechtstromen', 'Zuiderzeeland' ],
        selectedWaterManager: '',
        bodyOfWaterList: [ 'NL02L1', 'NL02L10a', 'NL02L10b', 'NL02L11', 'NL02L12', 'NL02L13', 'NL02L14', 'NL02L16' ],
        selectedBodyOfWater: '',
      }
    },
  }
</script>
