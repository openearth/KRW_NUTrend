<template>
  <app-sidebar>
    <h1>Home</h1>
    <p>
      Lorem, ipsum dolor sit amet consectetur adipisicing elit. Culpa aperiam a,
      fuga corporis laboriosam rem placeat vero ipsam blanditiis unde inventore
      doloribus cupiditate dolor praesentium at non! Laudantium, accusamus
      obcaecati.
    </p>
    <img
      src="/assets/images/deltares-logo.png"
      width="150"
      alt=""
    >
    <img
      src="/assets/images/rws-logo.png"
      width="150"
      alt=""
    >
    <blubje-asdf />
  </app-sidebar>
</template>

<script>
  import { AppSidebar } from '@deltares/vue-components'

  export default {
    name: 'Home',
    components: {
      AppSidebar,
    },
  }
</script>
