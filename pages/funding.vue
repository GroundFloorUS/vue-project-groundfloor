<template>
  <b-container>
    <h2 class="title">FUNDING</h2>
    <b-list-group>
      <b-list-group-item v-for="investment in funding" :key="investment.id" data-cy="investment-item">
        <p>
          Investment Property:
          <nuxt-link :to="'/investment/' + investment.id" data-cy="investment-link">{{ investment.address }}</nuxt-link>
        </p>
        <p>Amount funded: {{ investment.amount_funded | currency('$', ',') }}</p>
        <p>Loan Amount: {{ investment.loan_amount_dollars | currency('$', ',') }}</p>
        <b-progress-bar
          :value="investment.amount_funded"
          :max="investment.loan_amount_dollars"
          variant="success"
          show-value
          animated
        >{{ investment.amount_funded | currency('$', ',') }} /  {{ investment.loan_amount_dollars | currency('$', ',') }}</b-progress-bar>
      </b-list-group-item>
    </b-list-group>
  </b-container>
</template>

<script>
export default {
  async asyncData({ $axios }) {
    const sumOfFunds = async fund => {
      const funds = await $axios.get(`/api/investment/${fund.id}/funds`)
      return funds.data.reduce(
        (accumulator, fund) => accumulator + fund.amount,
        0
      )
    }
    const constructFund = async fund => ({
      ...fund,
      amount_funded: await sumOfFunds(fund)
    })

    const constructFunding = async _ => {
      const funding = await $axios.get('/api/funding')
      return Promise.all(
        funding.data.map(async fund => await constructFund(fund))
      )
    }
    return {
      funding: await constructFunding()
    }
  }
}
</script>
