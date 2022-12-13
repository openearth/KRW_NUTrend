import Vue from 'vue'
import VueGtag from 'vue-gtag'
import router from '../router'
//TODO: disabled before user accepts analytical cookies
Vue.use(VueGtag, {
  config: {
    id: 'UA-251801081-1',
    anonymize_ip: true,
  },
}, router)
