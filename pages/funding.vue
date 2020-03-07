<template>
  <b-container>
    <h2 class="title">FUNDING</h2>

    <table class="funding-list table table-striped">
      <thead>
        <tr>
          <th>Address</th>
          <th>Loan Amount</th>
          <th>Rate</th>
          <th>Term (mos)</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="investment in funding" :key="investment.id">
          <td>
            <nuxt-link :to="'/investment/' + investment.id">
              {{ investment.address }}
            </nuxt-link>
          </td>
          <td>
            ${{ investment.loan_amount_dollars }}
          </td>
          <td>
            {{ investment.rate }}
          </td>
          <td>
            {{ investment.expected_term_months }}
          </td>
        </tr>
      </tbody>

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
  }
}
</script>
