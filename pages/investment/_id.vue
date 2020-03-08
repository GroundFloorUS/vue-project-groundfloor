<template>
  <b-container>
    <h1 class="title">LOAN</h1>
    <p>Address: {{ investment.address }}</p>
    <p>Amount requested: ${{ investment.loan_amount_dollars }}</p>
    <p>Purpose: {{ investment.purpose }}</p>

    <section class="investment_funds">
      <h3 class="subtitle">Loan Funds</h3>
      <table class="table table-striped">
        <thead>
          <tr>
            <th>Amount</th>
            <th>Date Funded</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="fund in funds" :key="fund.id">
            <td>${{ fund.amount }}</td>
            <td>{{ fund.created_on }}</td>
          </tr>
        </tbody>
      </table>
    </section>
    <p v-if="fullyFunded" class="text-success">This loan is fully funded!</p>
    <p v-if="thisWillFullyFund" class="text-success">This amount will fully fund this loan!</p>
    <p>
      <b-form v-if="!fullyFunded" class="mb-2" type="button" vairant="success" @submit="onSubmit" @keyup="onKeyUp">
        <b-form-group label="Amount you want to fund"
                      label-for="amount">
          <b-form-input id="amout"
                        v-model="amount"
                        type="number"
                        name="amount" />
        </b-form-group>
        <b-button type="submit" variant="primary">Submit</b-button>
      </b-form>
      <b-button type="button" vairant="success" @click="goBack">Back</b-button>
    </p>

  </b-container>
</template>
<script>
export default {
  async asyncData({ $axios, params }) {
    let investment = await $axios.get(`/api/investment/${params.id}`)
    let funds = await $axios.get(`/api/investment/${params.id}/funds`)
    return {
      investment: investment.data,
      funds: funds.data,
      amount: '',
      id: investment.data.id,
      fullyFunded: false,
      thisWillFullyFund: false
    }
  },
  mounted() {
    if (this.isAlreadyFullyFunded()) {
      this.fullyFunded = true
    }
  },
  methods: {
    goBack() {
      this.$router.back()
    },

    calculateTotalFunded(funds) {
      let total = 0
      this.funds.forEach(fund => {
        total += parseInt(fund.amount)
      })
      return total
    },

    isAlreadyFullyFunded() {
      const totalFundedSoFar = this.calculateTotalFunded()
      return totalFundedSoFar >= this.investment.loan_amount_dollars
    },

    checkIfWillBeFullyFunded(keyedAmount) {
      const totalFundedSoFar = this.calculateTotalFunded()
      if (
        parseInt(keyedAmount) + parseInt(totalFundedSoFar) >=
        this.investment.loan_amount_dollars
      ) {
        return true
      }
      return false
    },

    onKeyUp(ev) {
      this.thisWillFullyFund = false
      let { amount } = this
      if (this.checkIfWillBeFullyFunded(amount)) {
        this.thisWillFullyFund = true
      }
    },

    setFunded() {
      let { id } = this
      this.$axios({
        method: 'post',
        url: '/api/setFunded',
        data: {
          investment_id: id
        }
      })
    },

    async onSubmit(ev) {
      ev.preventDefault()
      let { amount, id } = this
      await this.$axios({
        method: 'post',
        url: '/api/funding',
        data: {
          amount,
          investment_id: id
        }
      })
      if (this.thisWillFullyFund) {
        this.setFunded()
      }
      // hack
      // TODO: learn best way to dynamically reload a VUE component
      location.reload()
    }
  }
}
</script>
