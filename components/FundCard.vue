<template>
  <b-card :bg-variant="investment.fully_funded === 1 ? 'success' : ''" no-body>
    <b-card-header>
      <b-row align-h="between">
        <b-col cols="auto">
          {{ investment.address }}
        </b-col>
        <b-col cols="auto" align-self="end">
          <b-badge v-if="investment.fully_funded === 1" variant="primary">Success</b-badge>
        </b-col>
      </b-row>
    </b-card-header>
    <b-card-body>
      <p><b>Loan:</b> ${{ investment.loan_amount_dollars }}</p>
      <p><b>Rate:</b> {{ investment.rate }}%</p>
      <p><b>Purpose:</b> {{ investment.purpose }}</p>
      <p><b>Expected Term Month:</b> {{ investment.expected_term_months }}</p>
      <p v-if="investment.fully_funded === 0"><b>Total amount:</b> ${{ investment.total_amount*1 }}</p>
    </b-card-body>
    <b-card-footer>
      <nuxt-link :to="'/investment/' + investment.id">
        <b-button variant="primary">
          View Loan
        </b-button>
      </nuxt-link>
    </b-card-footer>
  </b-card>
</template>
<script>
export default {
  name: 'FundCard',
  props: {
    investment: { default: null, type: Object }
  }
}
</script>
<style lang="scss">
.fund-card {
  width: 100%;
}
</style>
