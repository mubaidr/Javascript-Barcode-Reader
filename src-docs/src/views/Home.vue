<template>
  <div class="home">
    <Header msg="Welcome to Your Vue.js App" />
  </div>
</template>

<script>
import javascriptBarcodeReader from '../../../src/index'

// @ is an alias to /src
import Header from '@/components/Header.vue'

console.log(javascriptBarcodeReader)

export default {
  name: 'home',
  components: {
    Header,
  },
}
</script>
