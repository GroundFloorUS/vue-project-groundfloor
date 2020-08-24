<template>
  <b-container>
    <h1 class="title">LOAN</h1>
    <p>Address: {{ investment.address }}</p>
    <p>Purpose: {{ investment.purpose }}</p>
    <p>{{ new Intl.NumberFormat('en', {style: 'currency', currency: 'USD'}).format(investment.loan_amount_dollars) }}</p>
    <section>
      <h3 class="subtitle">
        Invest in Funds
      </h3>
      <b-form>
        <b-form-group label="Invest" label-for="invest-fund">
          <b-form-input id="invest-fund" v-model="form.fundAmount" required placeholder="100" /> 
        </b-form-group>
        <b-button type="button" variant="primary" @click="addFunds">Submit</b-button>
      </b-form>
      <div v-if="showError">
        <p class="text-danger">That fund is larger than the load</p>
      </div>
      <div v-if="showFullyFunded">
        <p class="text-success">This will fully fund the loan.</p>
      </div>
    </section>
    <section class="investment_funds">
      <h3 class="subtitle">Loan Funds</h3>
      <h4>{{ new Intl.NumberFormat('en', {style: 'currency', currency: 'USD'}).format(totalFund) }}</h4>
      <h5>Loan balance: {{ new Intl.NumberFormat('en', {style: 'currency', currency: 'USD'}).format(loanBalance) }}</h5>
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
  async asyncData({ $axios, params }) {
    let investment = await $axios.get(`/api/investment/${params.id}`)
    // let funds = await $axios.get(`/api/investment/${params.id}/funds`)
    return {
      investment: investment.data,
      //funds: funds.data,
      showError: false,
      showFullyFunded: false,
      amount: 0,
      addedFunds: 0,
      form: {
        fundAmount: 0
      }
    }
  },
  computed: {
    totalFund() {
      return this.addedFunds
    },
    loanBalance() {
      return this.investment.loan_amount_dollars - this.totalFund
    }
  },
  methods: {
    async addFunds(ev) {
      ev.preventDefault()
      this.showError = false
      this.showFullyFunded = false
      let amountFromForm = parseInt(this.form.fundAmount)
      if (amountFromForm > this.loanBalance) {
        this.showError = true
        amountFromForm = 0
        this.form.fundAmount = 0
      } else {
        let addedAmount = parseInt(this.addedFunds)
        this.addedFunds = amountFromForm + addedAmount
        let f = {
          investment_id: this.investment.id,
          amount: this.addedFunds,
          created_on: this.investment.created_on
        }
        let funds = await this.$axios({
          method: 'post',
          url: `/api/fund`,
          data: f
        })
        if (this.addedFunds === this.investment.loan_amount_dollars) {
          this.showFullyFunded = true
          let p = {
            address: this.investment.address,
            created_on: this.investment.created_on,
            expected_term_months: this.investment.expected_term_months,
            fully_funded: 1,
            id: this.investment.id,
            loan_amount_dollars: this.investment.loan_amount_dollars,
            purpose: this.investment.purpose,
            rate: this.investment.rate
          }
          console.log(p)
          //This is where I left off, still needs work though
          // this.investment = await this.$axios({
          //   method: 'put',
          //   url: `/api/investment/${this.investment.id}`,
          //   data: p
          // })
        }
      }
    },
    goBack() {
      this.$router.back()
    }
  }
}
</script>
