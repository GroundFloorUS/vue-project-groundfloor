<template>
  <b-container>
    <h1 class="title">LOAN</h1>
    <p>Address: {{ investment.address }}</p>
    <p>Purpose: {{ investment.purpose }}</p>
    <p>Funding: <span>Loan Amount: {{ investment.total_funded | currency }}</span> | <span>Funding Amount: {{ investment.loan_amount_dollars | currency }}</span> | <span>Percent Complete: {{ percentFunded(investment.loan_amount_dollars, investment.total_funded) }}</span></P>
    <hr class="separator"/>
    <section class="investment_funds">
      <h3 class="subtitle">Loan Funds</h3>
      <ul>
        <li v-for="(fund, index) in funds" :key="index">
          <nuxt-link :to="'/investment/funding/' + fund.id">
            {{ fund.address }}
          </nuxt-link>
          - {{ percentFunded(fund.loan_amount_dollars, fund.total_funded) }} funded of {{ fund.loan_amount_dollars | currency }}</li>
      </ul>
    </section>

    <p>
      <b-button type="button" vairant="success" @click="goBack">
        Back
      </b-button>
    </p>

  </b-container>
</template>
<script>
import { currencyFilter } from '../../shared/number-filters'

export default {
  filters: {
    currency: currencyFilter
  },
  async asyncData({ $axios, params }) {
    const investment = await $axios.get(`/api/investment/${params.id}`)
    const funds = await $axios.get('/api/funding')
    console.log(investment)
    return {
      investment: investment.data,
      funds: funds.data
    }
  },
  methods: {
    percentFunded(wholeAmount, partAmount) {
      return `${Number.parseFloat(
        (Number(partAmount) / Number(wholeAmount)) * 100
      ).toFixed(2)}%`
    },
    goBack() {
      this.$router.back()
    }
  }
}
</script>
