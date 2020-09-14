<template>
  <b-container>
    <h2 class="title">FUNDING</h2>

    <div v-for="investment in funding" :key="investment.id" class="my-3">
      <nuxt-link :to="'/investment/' + investment.id" style="text-decoration: none; color: inherit;">
        <b-card
          :title="`Funding ${investment.id} `"
          :sub-title="`created on ${investment.created_on}`"
          border-variant="secondary"
          header-border-variant="secondary"
        >
          <b-card-text class="container">
            <p>expected term months: {{ investment.expected_term_months }}</p>
            <p>expected term months: {{ investment.fully_funded }}</p>
            <p>{{ investment.address }}</p>
            <p>loan amount:
              {{ investment.loan_amount_dollars }}
            </p>
          </b-card-text>
        </b-card>
      </nuxt-link>

    </div>
  </b-container>
</template>

<script>
// TODO:
// Show how much of a loan has been funded. Two places for this: the /investment/:id screen and the /funding screen.
export default {
  async asyncData({ $axios }) {
    let funding = await $axios.get('/api/funding')
    return {
      funding: funding.data
    }
  }
}
</script>
