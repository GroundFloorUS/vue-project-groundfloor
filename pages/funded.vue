<template>
  <b-container>
    <h2 class="title">FUNDED</h2>

    <table class="funded-list table table-striped">
      <thead>
        <tr>
          <th>Address</th>
          <th>Loan Amount</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="investment in funded" :key="investment.id">
          <td>
            <nuxt-link :to="'/investment/' + investment.id">
              {{ investment.address }}
            </nuxt-link>
          </td>
          <td>
            {{ investment.loan_amount_dollars }}
          </td>
        </tr>
      </tbody>

    </table>

  </b-container>
</template>

<script>
export default {
  async asyncData({ $axios }) {
    let funded = await $axios.get('/api/funded')
    return {
      funded: funded.data
    }
  }
}
</script>
