<template>
  <div>
    <nav class="navbar">
      <div class="navbar-brand">
        <router-link class="navbar-item" to="/home"
          ><i class="material-icons">
            home
          </i>
          <span>&nbsp; Home</span></router-link
        >
        <div class="navbar-burger burger" @click="toggleNavBar">
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>

      <div class="navbar-menu" :class="{ 'is-active': isActive }">
        <!-- <router-link class="navbar-item" to="/getting-started"
          >Getting Started</router-link
        > -->
        <router-link class="navbar-item" to="/samples"
          ><i class="material-icons">
            play_arrow
          </i>
          <span>&nbsp; Try now</span></router-link
        >
        <div class="navbar-end">
          <a
            class="navbar-item"
            href="https://github.com/mubaidr/Javascript-Barcode-Reader"
            target="_blank"
          >
            <i class="material-icons">
              code
            </i>
            <span>&nbsp;Github</span>
          </a>
          <a
            class="navbar-item"
            href="https://www.npmjs.com/package/javascript-barcode-reader"
            target="_blank"
          >
            <i class="material-icons">
              cloud_download
            </i>
            <span>&nbsp;npm</span>
          </a>
          <a
            class="navbar-item"
            href="https://unpkg.com/javascript-barcode-reader/dist/javascript-barcode-reader.min.js"
            target="_blank"
          >
            <i class="material-icons">
              save
            </i>
            <span>&nbsp; Download</span>
          </a>
        </div>
      </div>
    </nav>
  </div>
</template>

<script>
export default {
  data() {
    return {
      isActive: false,
    }
  },

  methods: {
    toggleNavBar() {
      this.isActive = !this.isActive
    },
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss"></style>
