<template>
  <b-container>
    <h2 class="title">FUNDING</h2>
    <table class="table table-striped">
      <thead>
        <tr>
          <th>&#160;</th>
          <th>Purpose</th>
          <th>Address</th>
          <th>Rate</th>
          <th>Expected Term</th>
          <th>Loan Amount</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="investment in funding" :key="investment.id">
          <td>
            <nuxt-link :to="'/investment/' + investment.id">View</nuxt-link>
          </td>
          <td>{{ investment.purpose }}</td>
          <td>{{ investment.address }}</td>
          <td>{{ investment.rate }}</td>
          <td>{{ investment.expected_term_months }}</td>
          <td>{{ investment.loan_amount_dollars | asCurrency }}</td>
        </tr>
      </tbody>
    </table>
  </b-container>
</template>

<script>
import { asCurrency } from '../common/filters'

export default {
  async asyncData({ $axios }) {
    let funding = await $axios.get('/api/funding')
    return {
      funding: funding.data
    }
  },
  filters: {
    asCurrency
  }
}
</script>
