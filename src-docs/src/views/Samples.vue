<template>
  <section class="section">
    <div class="container">
      <h1 class="title is-3">Try now</h1>
      <h2 class="subtitle is-4">
        Choose an image file, barcode type and click extract.
      </h2>
      <div class="field">
        <label class="label">Barcode Image</label>
        <div class="file has-name is-fullwidth">
          <label class="file-label">
            <input
              type="file"
              @change="chooseImage"
              class="file-input"
              name="resume"
            />
            <span class="file-cta">
              <i class="material-icons">file</i>
              <span class="file-label"> Choose Image</span>
            </span>
            <span class="file-name">{{ image }}</span>
          </label>
        </div>
      </div>
      <div class="field">
        <label class="label">Barcode Type</label>
        <select class="control" v-model="barcode">
          <option
            v-for="(barcode, index) in barcodes"
            :key="index"
            :value="barcode"
            :selected="barcode.barcode === 'Code-128'"
            >{{ `${barcode.barcode} ${barcode.type}` }}</option
          >
        </select>
      </div>

      <img :src="image" ref="image" />
      <div v-if="result || error">
        <div class="notification is-success" v-if="result">
          <span>Code: {{ result }}</span>
          <br />
          <br />
          <span>Decoded in : {{ timeTaken }}ms</span>
        </div>
        <div class="notification is-danger" v-else>{{ error }}</div>
      </div>
      <br />

      <!-- <br /> -->
      <button @click="decode" class="button is-primary">
        <i class="material-icons">flash</i>
        <span> Decode</span>
      </button>
    </div>
  </section>
</template>

<script>
import javascriptBarcodeReader from '../../../src/index'

export default {
  data() {
    return {
      image: null,
      result: null,
      error: null,
      timeTaken: 0,
      barcode: { barcode: 'Code-128', type: '' },
      barcodes: [
        {
          barcode: 'EAN-13',
          type: '',
        },
        {
          barcode: 'EAN-8',
          type: '',
        },
        {
          barcode: 'Code-39',
          type: '',
        },
        {
          barcode: 'Code-93',
          type: '',
        },
        {
          barcode: 'Code-2of5',
          type: 'Industrial',
        },
        {
          barcode: 'Code-2of5',
          type: 'Interleaved',
        },
        {
          barcode: 'Codabar',
          type: '',
        },
        {
          barcode: 'Code-128',
          type: '',
        },
      ],
    }
  },

  methods: {
    chooseImage(evt) {
      this.image = URL.createObjectURL(evt.target.files[0])
    },

    decode() {
      let sTime = Date.now()

      javascriptBarcodeReader(this.$refs.image, this.barcode)
        .then(result => {
          this.timeTaken = Date.now() - sTime
          this.result = result
        })
        .catch(err => {
          this.result = null
          this.error = err
        })
    },
  },
}
</script>
