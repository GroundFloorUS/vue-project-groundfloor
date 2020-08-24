<template>
  <b-container>
    <h2 class="title">FUNDING</h2>

    <b-list-group class="funding-list">
      <div v-for="investment in funding" :key="investment.id">
        <b-list-group-item>
          <span class="font-weight-bolder">Address: </span>
          <nuxt-link :to="'/investment/' + investment.id">
            {{ investment.address }} <br>
          </nuxt-link>
          <span class="font-weight-bolder">Purpose: </span> {{ investment.purpose }}<br>
          <span class="font-weight-bolder">Term: </span> {{ investment.expected_term_months }} months <br>
          <span class="font-weight-bolder">Created on: </span> {{ new Date(investment.created_on).toLocaleDateString() }}<br>
          <span class="font-weight-bolder">Amount: </span> {{ new Intl.NumberFormat('en', {style: 'currency', currency: 'USD'}).format(investment.loan_amount_dollars) }}
        </b-list-group-item>
      </div>
    </b-list-group>
  </b-container>
</template>

<style>
span,
h2 {
  color: #343a40;
}
a {
  color: #68b6c8;
}
.list-group div:nth-child(even) .list-group-item {
  background: #f5f5f5;
}
</style>
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
