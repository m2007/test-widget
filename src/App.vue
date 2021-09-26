<template>
  <div class="container sm:mx-4 sm:my-16">
    <div class="header">
      <p class="text-h1 mb-4">Crypto Exchange</p>
      <p class="text-h2">Exchange fast and easy</p>
    </div>
  
    <div class="lg:flex items-center">
      <crypto-input-from v-if="cryptos && exchangeCryptos.from" 
        :cryptos="cryptos" :minAmount="minAmount"
        @setCrypto="setCrypto" @updatedNewAmountFrom="updateAmountTo">
      </crypto-input-from>

      <div class="swap-icon sm:w-full sm:flex sm:my-4 sm:mx-0 sm:justify-end">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 sm:transform sm:rotate-90" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
        </svg>
      </div>
      
      <crypto-input-to v-if="cryptos && exchangeCryptos.to"
        :cryptos="cryptos" :estimatedAmount="estimatedAmount"
        @setCrypto="setCrypto">
      </crypto-input-to>
    </div>

    <div class="mt-8">
      <p class="mb-2">Your Ethereum address</p>
      <div class="lg:flex">
        <input class="adress-input w-full p-4 lg:mr-8 sm:mb-4">
        <button class="btn sm:w-full" :class="{'btn-disabled': err}">
          Exchange
        </button>
      </div>
      <p v-if="err" class="err-alert mt-2">This pair is disabled now</p>
    </div>
    
  </div>
</template>

<script>
import axios from 'axios'
import CryptoInputFrom from './components/CryptoInputFrom.vue'
import CryptoInputTo from './components/CryptoInputTo.vue'
export default {
  name: 'App',
  components: {
    CryptoInputFrom,
    CryptoInputTo
  },
  data: () => ({
    api: process.env.VUE_APP_API_KEY,
    err: false,
    minAmount: '',
    estimatedAmount: '',
    exchangeCryptos: {
      from: null,
      to: null
    },
    cryptos: null
  }),
  mounted() {
    axios.get('https://api.changenow.io/v1/currencies?active=true&fixedRate=true')
    .then(res => {
      this.cryptos = res.data
      this.exchangeCryptos = {from: this.cryptos[0], to: this.cryptos[1]}
    })
    .then(() => this.getMinAmount())
    .then(() => this.getEstimated(this.minAmount))
  },
  methods: {
    updateAmountTo(amount) {
      if (+amount < +this.minAmount) {
        this.estimatedAmount = '-'
      } else {
        this.getEstimated(amount)
      }
    },
    async setCrypto(prop) {
      if (!prop) return

      if (prop.from) {
        this.exchangeCryptos.from = prop.crypto
      } else {
        this.exchangeCryptos.to = prop.crypto
      }
      await this.getMinAmount()
      this.getEstimated(this.minAmount)
    },
    getMinAmount() {
      return axios(`https://api.changenow.io/v1/min-amount/${this.exchangeCryptos.from.ticker}_${this.exchangeCryptos.to.ticker}?api_key=${this.api}`)
      .then(res => {
        this.minAmount = res.data.minAmount.toString()
        this.err = false
      })
      .catch(() => {
        this.minAmount = ''
        this.err = true
      })
    },
    getEstimated(value) {
      return axios(`https://api.changenow.io/v1/exchange-amount/${+value}/${this.exchangeCryptos.from.ticker}_${this.exchangeCryptos.to.ticker}/?api_key=${this.api}`)
      .then(res => {
        this.estimatedAmount = res.data.estimatedAmount.toString()
        this.err = false
      })
      .catch(() => {
        this.estimatedAmount = ''
        this.err = true
      })
    }
  }
}
</script>

<style lang="scss">
$bg-clr: #F6F7F8;
$brd-clr: #E3EBEF;
$brd-act-clr: #C1D9E6;
$gr-blue-clr: #80A2B6;
$br-blue-clr: #11B3FE;
$br-blue-act-clr: #0095E0;

#app {
  color: #282828;
  user-select: none;
}

.container {
  margin: 220px 220px 0;
}

.header {
  margin-bottom: 60px;
}

.crcontainer {
  position: relative;
  background: $bg-clr;
  border: solid $brd-clr 1px;
  border-radius: 5px;
  width: 100%;
  &--active {
    border-color: $brd-act-clr;
  }
}

.crform {
  display: flex;
  align-items: center;
  height: 50px;
  
  &_input {
    background: $bg-clr;
    padding: 16px;
    height: 100%;
    width: 60%;

    &--close {
      width: 100%;
    }
  }

  &_btn {
    display: flex;
    align-items: center;
    width: 40%;
    height: 100%;

    &:hover {
      cursor: pointer;
    }

    &--close {
      width: unset;
    }
  }
  
  &_btn-logo {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 30px;
    width: 100%;
    border-left: solid $brd-clr 1px;
  }

  &_btn-icon {
    color: $gr-blue-clr;
    margin-right: 8px;

    & svg {
      width: 16px;
      height: 16px;
    }
  }

  &-search {
    position: absolute;
    z-index: 100;
    background: $bg-clr;
    border: solid $brd-act-clr 1px;
    border-top: solid $brd-clr 1px;
    border-radius: 0 0 5px 5px;

    width: calc(100% + 2px);
    left:-1px;
  }

  &-option {
    cursor: pointer;
    display: flex;
    padding: 14px 16px;

    & span:last-child {
      color: $gr-blue-clr;
    }

    &:hover {
      background: #EAF1F7;
    }
  }
}

input {
  outline: none;

  &[type=number] {
    -moz-appearance: textfield;
  }

  &::-webkit-outer-spin-button,
  &::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
}

.swap-icon {
  color: $br-blue-clr;
  width: 24px;
  height: 24px;
  margin-left: 29px;
  margin-right: 27px;
}

.adress-input {
  height: 50px;
  background: #F6F7F8;
  border: 1px solid #E3EBEF;
  border-radius: 5px;
}

.btn {
  width: 205px;
  height: 50px;
  color: #FFF;
  background: $br-blue-clr;
  border-radius: 5px;
  font-weight: 700;
  text-transform: uppercase;
  
  &:hover {
    background: $br-blue-act-clr;
  }
  &-disabled {
    background: $br-blue-clr !important;
  }
}

.err-alert {
  text-align: center;
  color: #E03F3F;
}
</style>
