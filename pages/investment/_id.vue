<template>
  <b-container>
    <h1 class="title">LOAN <small v-if="!!investment.isLoanFullyFunded">( Fully Funded )</small></h1>
    <p>Address: {{ investment.address }}</p>
    <p>Purpose: {{ investment.purpose }}</p>
    <p>Total Amount Funded: {{ investment.loanAmtFunded }}</p>

    <hr>
    <section class="investment_funds">
      <h3 class="subtitle">Loan Funds </h3>
      <ul>
        <!-- TODO: list all funds -->
        <li v-for="fund in funds" :key="fund.id">
          <p>amount: {{ fund.amount }} <small>(created: {{ fund.created_on }})</small></p>
        </li>
      </ul>
    </section>
    <hr>
    <b-form ref="borrowSubmitForm" @submit="onSubmit">

      <b-form-group label="Fund Amount"
                    label-for="fund_amount_dollars">
        <b-input-group>
          <b-input-group-prepend>
            <span class="input-group-text">$</span>
          </b-input-group-prepend>
          <b-form-input id="fund_amount_dollars"
                        :min="minFundAmount"
                        v-model="fundAmount"
                        type="number"
                        name="fund_amount_dollars"/>
        </b-input-group>
      </b-form-group>

      <label for="">how much loan left after purchase: {{ loanAmtLeftAfterPurchase }}</label>
      <b-button type="submit" variant="primary">Submit</b-button>

    </b-form>

    <hr>
    <b-button type="button" vairant="secondary" @click="goBack">
      Back
    </b-button>

  </b-container>
</template>
<script>
// TODO:
// Show how much of a loan has been funded. Two places for this: the /investment/:id screen and the /funding screen.

export default {
  async asyncData({ $axios, params }) {
    let investment = await $axios.get(`/api/investment/${params.id}`)
    let funds = await $axios.get(`/api/investment/${params.id}/funds`)
    return {
      investment: investment.data,
      funds: funds.data,
      fundAmount: 0,
      minFundAmount: 0
    }
  },
  computed: {
    loanAmtLeftAfterPurchase() {
      let s =
        this.investment.loan_amount_dollars -
        (this.investment.loanAmtFunded + +this.fundAmount)
      return s
    }
  },
  methods: {
    goBack() {
      this.$router.back()
    },
    async onSubmit(ev) {
      ev.preventDefault()
      let { fundAmount, investment } = this
      let b = {
        investment_id: investment.id,
        amount: fundAmount
      }
      let newFund = await this.$axios({
        method: 'post',
        url: '/api/funding',
        data: b
      })
        .then(e => {
          this.funds.push(e.data)
          this.fundAmount = 0

          // update the loan funds list
          this.$axios
            .get(`/api/investment/${e.data.investment_id}/funds`)
            .then(fs => (this.funds = fs.data))
            .then(() => {
              return this.$axios.get(`/api/investment/${e.data.investment_id}`)
            })
            .then(i => {
              this.investment = i.data
            })
        })
        .catch(err => {
          let e = err
          alert(err.response.data)
          return
        })
    }
  }
}
</script>
