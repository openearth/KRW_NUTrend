<template>
  <v-dialog
    v-model="show"
    scrollable
    persistent
    :fullscreen="$vuetify.breakpoint.xsOnly"
    :max-width="640"
  >
    <v-card class="d-flex flex-column" style="max-height: 100%; overflow: hidden;">
      <v-card-title class="pa-5">
        <v-toolbar-title>{{ title }}</v-toolbar-title>
      </v-card-title>

      <div class="px-5 flex-grow-1 overflow-y-auto">
        <vue-markdown class="markdown" :source="body" />
      </div>

      <v-card-actions>
        <div class="pa-2" style="width: 100%;">
          <p class="text-caption">
            Deze website maakt gebruik van cookies die noodzakelijk zijn voor het juist functioneren en het verbeteren van de website.
            <a href="http://krw-nutrend.nl/site/data/download/cookies.pdf">Meer informatie over cookies</a>
          </p>
          <form action="" submit.prevent>
            <v-checkbox
              v-for="(label, index) in checkboxes"
              :key="label"
              v-model="accepted[index]"
              :label="label"
              class="ma-0"
              hide-details
            />
          </form>
          <div class="mt-2 d-flex">
            <v-spacer />
            <v-btn
              color="primary"
              :disabled="!allAccepted"
              @click="onAcceptClick"
            >
              {{ buttonText }}
            </v-btn>
          </div>
        </div>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
  import VueMarkdown from 'vue-markdown-render'
  const STORAGE_KEY = '__legal_accepted'
  const STORAGE_MODES = [ 'session', 'local', 'none' ]
  export default {
    components: {
      VueMarkdown,
    },
    props: {
      title: {
        type: String,
        required: true,
      },
      body: {
        type: String,
        required: true,
      },
      checkboxes: {
        type: Array,
        required: true,
      },
      buttonText: {
        type: String,
        required: true,
      },
      storage: {
        type: String,
        default: 'session',
        validator(value) {
          const valid = STORAGE_MODES.includes(value)
          if (!valid) {
            console.warn(`LegalDialog: 'mode' should be one of the following values: ${ STORAGE_MODES.join(', ') }`)
          }
          return valid
        },
      },
    },
    data() {
      return {
        show: false,
        accepted: [],
      }
    },
    computed: {
      allAccepted() {
        return this.accepted[0]
      },
      storageMethod() {
        if (this.storage === 'none') {
          return false
        } else if (STORAGE_MODES.includes(this.storage)) {
          return `${ this.storage }Storage`
        }
        return null
      },
    },
    mounted() {
      this.accepted = this.checkboxes.map(() => false)
      if (this.storageMethod) {
        this.show = !JSON.parse(window[this.storageMethod].getItem(STORAGE_KEY))
      } else {
        this.show = true
      }
    },
    methods: {
      onAcceptClick() {
        this.show = false
        this.$emit('accepted')
        if (this.storageMethod) {
          window[this.storageMethod].setItem(STORAGE_KEY, true)
        }
      },
    },
  }
</script>