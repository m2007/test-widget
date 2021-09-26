<template>
  <div class="crcontainer" :class="{'crcontainer--active rounded-b-none': search}">
      <div class="crform">
        <input class="crform_input" :class="{'crform_input--close': search}" :disabled="!search"
         :placeholder="(search ? 'Search' : '')"
        v-model="value">
        <div class="crform_btn" :class="{'crform_btn--close': search}" @click="toogleInput">
          <div class="crform_btn-logo" v-if="!search">
            <img class="mr-3" :src="activeCrypto.image">
            <span class="uppercase">{{activeCrypto.ticker}}</span>
          </div>

          <div class="crform_btn-icon" :class="{'mr-4': search}">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="search ? 'M6 18L18 6M6 6l12 12' : 'M19 9l-7 7-7-7'" />
            </svg>
          </div>
          
        </div>
      </div>

      <div class="crform-search" v-if="search">
        <div class="crform-option" v-for="crypto in cryptoSearchOptions.slice(0, 3)" :key="crypto.ticker" @click="chooseCrypto(crypto)">
          <img class="mr-3" :src="crypto.image">
          <span class="mr-3 uppercase flex items-center">{{crypto.ticker}}</span>
          <span>{{crypto.name}}</span>
        </div>
      </div>
    </div>
</template>

<script>
export default {
  name: "CryptoInput",
  props: {
    estimatedAmount: String,
    cryptos: Array
  },
  data: () => ({
    activeCrypto: {},
    value: '',
    search: false,
    amountStr: null,
    searchStr: ''
  }),
  watch: {
    estimatedAmount() {
      this.value = this.amountStr = this.estimatedAmount
    },
    value() {
      if (this.search) this.searchStr = this.value.toString()
    }
  },
  computed: {
    cryptoSearchOptions() {
      const strToFind = this.searchStr.toLowerCase().trim()
      return this.cryptos.filter(cr => cr.name != this.activeCrypto.name && 
        (cr.name.toLowerCase().includes(strToFind) || cr.ticker.toLowerCase().includes(strToFind)))
    }
  },
  async mounted() {
    this.activeCrypto = this.cryptos[1]
  },
  methods: {
    toogleInput() {
      this.search = !this.search
      if (this.search) this.value = this.searchStr
      else this.value = this.amountStr
    },
    chooseCrypto(crypto) {
      this.value = this.searchStr = ''
      this.activeCrypto = crypto
      this.$emit('setCrypto', {
        to: true,
        crypto: this.activeCrypto
      })

      this.search = !this.search
    }
  }
}
</script>
