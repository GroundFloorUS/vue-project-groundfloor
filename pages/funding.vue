<template>
  <b-container>
    <h2 class="title">FUNDING</h2>
    <table id="funding-table">
      <tr>
        <th>Address</th>
        <th>Amount</th>
        <th>Rate</th>
        <th>Term</th>
        <th>Purpose</th>
        <th>Created</th>
      </tr>
      <tr v-for="investment in funding" :key="investment.id">
        <td>
          <nuxt-link :to="'/investment/' + investment.id">
            {{ investment.address }}
          </nuxt-link>
        </td>
        <td v-text="formatLoanAmount(investment.loan_amount_dollars)"/>
        <td v-text="formatRate(investment.rate)"/>
        <td v-text="investment.expected_term_months"/>
        <td v-text="investment.purpose"/>
        <td v-text="investment['created_on']"/>
      </tr>
    </table>
  </b-container>
</template>

<script>
export default {
  async asyncData({ $axios }) {
    let funding = await $axios.get('/api/funding')
    return {
      funding: funding.data
    }
  },
  methods: {
    formatRate(amount) {
      return new Intl.NumberFormat('en-US', {
        style: 'percent'
      }).format(amount / 100)
    },
    formatLoanAmount(amount) {
      return `$${new Intl.NumberFormat('en-US', {
        style: 'decimal'
      }).format(amount)}`
    }
  }
}
</script>
<style>
#funding-table {
  border-collapse: collapse;
  width: 100%;
}

#funding-table td,
#funding-table th {
  border: 1px solid #ddd;
  padding: 8px;
}

#funding-table tr:nth-child(even) {
  background-color: #f2f2f2;
}

#funding-table tr:hover {
  background-color: #c6c8ca;
}

#funding-table th {
  padding-top: 12px;
  padding-bottom: 12px;
  text-align: left;
  background-color: #40a6cc;
  color: white;
}
</style>
