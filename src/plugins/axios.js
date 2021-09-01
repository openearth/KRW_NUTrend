import Vue from 'vue'
import axios from 'axios'

// axios: https://github.com/axios/axios

// request config: https://github.com/axios/axios#request-config
const AXIOS_CONFIG = {
  auth: {
    username: process.env.VUE_APP_API_USERNAME,
    password: process.env.VUE_APP_API_PASSWORD,
  },
  headers: {
    'Content-type': 'application/json; charset=UTF-8',
  },
}

const instance = axios.create(AXIOS_CONFIG)

Vue.prototype.$axios = instance
