<template>
  <v-app>
    <app-header
      :title="headerTitle"
      :theme="theme"
    >
      <template slot="right">
        <slot name="header-right" />
      </template>
    </app-header>

    <v-main>
      <router-view v-on="$listeners" />
      <slot />
      <slot name="map" />
    </v-main>
  </v-app>
</template>

<script>
  import AppHeader from '~/components/AppHeader/AppHeader'

  export default {
    components: {
      AppHeader,
    },
    props: {
      headerTitle: {
        type: String,
        default: '',
      },
      theme: {
        type: String,
        default: 'dark',
        validator: value => value === 'dark' || value === 'light',
      },
    },
  }
</script>
