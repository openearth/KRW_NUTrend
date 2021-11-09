import axios from 'axios'
const qs = require('qs')

// request config: https://github.com/axios/axios#request-config
const AXIOS_CONFIG = {
  baseURL: process.env.VUE_APP_API_ENDPOINT,
  headers: {
    'Content-type': 'application/json; charset=UTF-8',
  },
  paramsSerializer: params => qs.stringify(params, { arrayFormat: 'repeat' }),

}
const instance = axios.create(AXIOS_CONFIG)

export default instance
