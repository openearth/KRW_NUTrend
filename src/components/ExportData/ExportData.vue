<template>
  <download-csv
    :data="locationsData"
    :name="fileName"
  >
    <v-btn
      block
      elevation="0"
      @click="onGenerateFileName"
    >
      Download (.csv)
    </v-btn>
  </download-csv>
</template>
<script>
  import Vue from 'vue'
  import JsonCSV from 'vue-json-csv'

  Vue.component('DownloadCsv', JsonCSV)

  export default {
    props: {
      locationsData: {
        type: Array,
        default: () => [],
      },
    },
    data() {
      return { 
        fileName: '',
      }
    },
    methods: {
      onGenerateFileName() {
        const timestamp = Date.now()
        this.fileName = `date_extract_${ timestamp }.csv`
      },
    },

  }

</script>
