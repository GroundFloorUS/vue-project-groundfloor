<style scope>
@import './list.scss';
</style>
<template>
  <div>
    <h2 class="title">FUNDING</h2>

    <b-container class="list">
      <b-row class="heading">
        <b-col>Address</b-col>
        <b-col>Purpose</b-col>
        <b-col>Amount</b-col>
        <b-col>Rate</b-col>
        <b-col>Term</b-col>
        <b-col>&nbsp;&nbsp;></b-col>
      </b-row>
      <b-row v-for="investment in funding" :key="investment.id">
        <b-col>{{ investment.address }}</b-col>
        <b-col>{{ investment.purpose }}</b-col>
        <b-col>${{ investment.loan_amount_dollars }}</b-col>
        <b-col>{{ investment.rate }}</b-col>
        <b-col>{{ investment.expected_term_months }}</b-col>
        <b-col>
          <nuxt-link :to="'/investment/' + investment.id">Invest</nuxt-link>
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>

<script>
export default {
  async asyncData({ $axios }) {
    let funding = await $axios.get('/api/funding')
    return {
      funding: funding.data
    }
  }
}
</script>
