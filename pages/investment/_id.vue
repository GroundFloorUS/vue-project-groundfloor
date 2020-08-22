<template>
  <b-container>
    <h1 class="title">LOAN</h1>
    <p>Address: {{ investment.address }}</p>
    <p>Purpose: {{ investment.purpose }}</p>
    <p data-cy="amount-funded">Amount funded: {{ amount_funded | currency('$', ',') }}</p>
    <p data-cy="loan-amount">Loan Amount: {{ investment.loan_amount_dollars | currency('$', ',') }}</p>
    <b-form @submit="onSubmit">
      <b-form-group
        :invalid-feedback="invalidFundFeedback"
        :state="fundValidity"
        label="Contribute:"
        label-for="fund_dollars"
      >
        <b-input-group>
          <b-input-group-prepend>
            <span class="input-group-text">$</span>
          </b-input-group-prepend>
          <b-form-input
            id="fund_dollars"
            v-model="fund_dollars"
            data-cy="fund-input"
            type="number"
            name="fund_dollars"
          />
        </b-input-group>
      </b-form-group>

      <b-button
        :disabled="formDisabled"
        class="submit-button"
        data-cy="submit-button"
        type="submit"
        variant="primary"
      >Submit</b-button>
    </b-form>

    <section class="investment_funds">
      <h3 class="subtitle">Loan Funds</h3>
      <b-list-group>
        <b-list-group-item v-for="fund in funds" :key="fund.id"> {{ fund.amount | currency('$', ',') }} </b-list-group-item>
      </b-list-group>
    </section>
    
    <p>
      <b-button type="button" vairant="success" @click="goBack">
        Back
      </b-button>
    </p>

  </b-container>
</template>
<script>
export default {
  data() {
    return {
      fund_dollars: 0
    }
  },
  async asyncData({ $axios, params }) {
    let investment = await $axios.get(`/api/investment/${params.id}`)
    let funds = await $axios.get(`/api/investment/${params.id}/funds`)
    const sum = (accumulator, fund) => accumulator + fund.amount
    const amount_funded = funds.data.reduce(sum, 0)
    const remaining_funding =
      investment.data.loan_amount_dollars - amount_funded
    return {
      investment: investment.data,
      funds: funds.data,
      amount_funded,
      remaining_funding
    }
  },
  computed: {
    fundValidity() {
      return (
        this.fund_dollars > 0 && this.fund_dollars <= this.remaining_funding
      )
    },
    formDisabled() {
      return (
        this.fund_dollars <= 0 ||
        !this.fund_dollars ||
        this.fund_dollars > this.remaining_funding
      )
    },
    invalidFundFeedback() {
      if (this.fund_dollars <= 0) {
        return 'You must contribute a minimum of $1'
      } else if (this.fund_dollars > this.remaining_funding) {
        return 'You cannot contribute more than the amount left'
      } else {
        return ''
      }
    }
  },
  methods: {
    goBack() {
      this.$router.back()
    },
    async onSubmit(ev) {
      ev.preventDefault()
      let { fund_dollars } = this
      let funding = await this.$axios({
        method: 'post',
        url: '/api/funding',
        data: {
          amount: fund_dollars,
          investment_id: this.investment.id
        }
      })
      let funds = await this.$axios.get(
        `/api/investment/${this.investment.id}/funds`
      )
      this.amount_funded = funds.data.reduce(
        (accumulator, fund) => accumulator + fund.amount,
        0
      )
      this.remaining_funding =
        this.investment.loan_amount_dollars - this.amount_funded
      this.funds = funds.data
    }
  }
}
</script>
