<template>
  <b-container>
    <h2 class="title">FUNDING</h2>
    <b-card 
      v-for="investment in funding" 
      :key="investment.id"
      :title="investment.address"
      class="investment" >
      <section class="investment_info">
        <div class="cell">
          <span>{{ investment.rate }}%</span>
          <small>Rate</small>
        </div>
        <div class="cell">
          <span>{{ investment.expected_term_months }}</span>
          <small>Expected term months</small>
        </div>
        <div class="cell">
          <span>${{ investment.loan_amount_dollars.toLocaleString() }}</span>
          <small>Loan amount</small>
        </div>

      </section>
      <b-button href="'/investment/' + investment.id">View More Details</b-button>

    </b-card>
  </b-container>
</template>

<script>
export default {
  async asyncData({ $axios }) {
    let funding = await $axios.get('/api/funding')
    console.log(funding.data)
    return {
      funding: funding.data
    }
  }
}
</script>

<style scoped>
.investment {
  margin-bottom: 1em;
  box-shadow: inset 0 4px 0 #40a6cc;
}

.investment .btn {
  background-color: #40a6cc;
  border: 0;
}
</style>
