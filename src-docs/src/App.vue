<template>
  <div id="app">
    <NavBar></NavBar>
    <Header />

    <transition name="slide-up" appear="appear" mode="out-in">
      <router-view />
    </transition>
  </div>
</template>
<script>
// @ is an alias to /src
import NavBar from '@/components/NavBar.vue'
import Header from '@/components/Header.vue'

export default {
  components: {
    NavBar,
    Header,
  },
}
</script>
<style lang="scss"></style>
