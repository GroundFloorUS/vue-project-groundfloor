<template>
  <b-container>
    <h2 class="title mb-3">FUNDING</h2>
    <section class="investment_container d-flex">
      <b-card 
        v-for="investment in funding" 
        :key="investment.id"
        :title="investment.address"
        class="investment" >
        <section class="investment_info mb-3 d-flex flex-row">
          <div class="cell">
            <span class="font-weight-bold">{{ investment.rate }}%</span>
            <small>rate</small>
          </div>
          <div class="cell">
            <span>{{ investment.expected_term_months }} mo.</span>
            <small>expected term</small>
          </div>
          <div class="cell">
            <span class="text-right">${{ investment.loan_amount_dollars.toLocaleString() }}</span>
            <small>Loan amount</small>
          </div>
        </section>
        <b-button :href="'/investment/' + investment.id" class="text-center" size="lg">View More Details</b-button>
      </b-card>
    </section>

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
.investment_container {
  flex-wrap: wrap;
}

/* I debated on a two vs. three column layout here. I'm assuming that users want to peruse funding here, 
   similar to something like Pinterest. I think three columns makes that a bit easier, but it also felt a bit cramped. 
   */
.investment {
  margin-bottom: 1em;
  box-shadow: inset 0 4px 0 #40a6cc, 0px 3px 12px rgba(0, 0, 0, 0.1);
  width: 48%;
  margin-right: 2%;
}

.investment .btn {
  background-color: #40a6cc;
  border: 0;
}

.investment_info {
  justify-content: space-between;
}

.investment_info .cell {
  display: flex;
  flex-direction: column;
}

small {
  color: #666;
}
</style>
