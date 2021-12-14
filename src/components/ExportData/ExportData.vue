<template>
  <div>
    <download-csv
      :data="csvRows"
      :name="fileName"
    >
      <v-btn
        block
        elevation="0"
        @click="onCreatFileName"
      >
        Download (.csv)
      </v-btn>
    </download-csv>
  </div>
</template>
<script>
  import Vue from 'vue'
  import JsonCSV from 'vue-json-csv'

  Vue.component('DownloadCsv', JsonCSV)

  export default {
    props: {
      csvRows: {
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
      onCreatFileName() {
        const timestamp = Date.now()
        this.fileName = `date_extract_${ timestamp }.csv`
      },
    },

  }

</script>
