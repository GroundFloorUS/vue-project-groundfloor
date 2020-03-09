<template>
  <div class="investment">
    <div>
      <span class="label">Address</span>
      <nuxt-link :to="'/investment/' + investment.id">
        {{ investment.address }}
      </nuxt-link>
    </div>
    <div>
      <span class="label">Amount</span>{{ investment.loan_amount_dollars }}
    </div>
    <div>
      <span class="label">Rate</span>{{ investment.rate }}
    </div>
    <div>
      <span class="label">Purpose</span>{{ investment.purpose }}
    </div>
    <div>
      <span class="label">Expected Term Length</span>{{ investment.expected_term_months }}
    </div>
    <div>
      <span class="label">Total Amount Funded</span>{{ total }}
    </div>
    <div>
      <span class="label">Is Fully Funded</span>{{ Boolean(investment.fully_funded) ? 'Yes' : 'No' }}
    </div>
  </div>
</template>

<script>
export default {
  name: 'Investment',
  props: { investment: { default: null, type: Object } },
  data() {
    return {
      total: 0
    }
  },
  created() {
    this.getTotal()
  },
  methods: {
    async getTotal() {
      let funds = await this.$axios.get(
        `/api/investment/${this.$props.investment.id}/funds`
      )
      let total = 0
      funds.data.forEach(fund => (total += fund.amount))
      this.funds = funds
      this.total = total
    }
  }
}
</script>

<style scoped>
.investment {
  margin-bottom: 10px;
}

.investment:last-child {
  margin-bottom: 0;
}

.label {
  font-weight: bold;
}

.label::after {
  content: ':';
  margin-right: 10px;
}
</style>
