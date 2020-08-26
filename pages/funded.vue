<template>
  <b-container>
    <h2 class="title">FUNDED</h2>

    <ul class="funded-list">
      <li v-for="investment in funded" :key="investment.id">
        <nuxt-link :to="'/investment/' + investment.id">
          {{ investment.address }}
        </nuxt-link>
        <p>
          {{ investment.loan_amount_dollars | currency }}
        </p>
      </li>
    </ul>

  </b-container>
</template>

<script>
import { currencyFilter } from '../shared/number-filters'

export default {
  filters: {
    currency: currencyFilter
  },
  async asyncData({ $axios }) {
    const funded = await $axios.get('/api/funded').catch(error => {
      console.log(error)
    })

    return {
      funded: funded.data
    }
  }
}
</script>
