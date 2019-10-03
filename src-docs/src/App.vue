<template>
  <div id="app">
    <NavBar></NavBar>
    <Header />

    <transition name="slide-up" appear="appear" mode="out-in">
      <router-view />
    </transition>

    <div class="section">
      <footer class="footer">
        <div class="container">
          <div class="content has-text-centered">
            <p>
              Built using <strong>Bulma Fluent Theme </strong> by
              <a href="http://mubaidr.github.com" target="_blank">
                Muhammad Ubaid Raza
              </a>
              <br />
              Icons from
              <a href="http://fontawesome.io/" target="_blank">Font Awesome </a
              >. <br />
              The source code is licensed under
              <a
                href="http://opensource.org/licenses/mit-license.php"
                target="_blank"
                >MIT </a
              >.
            </p>
          </div>
        </div>
      </footer>
    </div>
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
