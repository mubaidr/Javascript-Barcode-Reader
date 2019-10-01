<template>
  <div id="app">
    <NavBar></NavBar>
    <router-view />
  </div>
</template>
<script>
// @ is an alias to /src
import NavBar from '@/components/NavBar.vue'

export default {
  components: {
    NavBar,
  },
}
</script>
<style lang="scss">
</style>
