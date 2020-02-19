<template>
  <b-container>
    <h1 class="title">LOAN</h1>
    <p>Address: {{ investment.address }}</p>
    <p>Purpose: {{ investment.purpose }}</p>
    <p>Id: {{ investment.id }}</p>

    <section class="investment_funds">
      <h3 class="subtitle">Loan Funds</h3>
      <p>Total Funds Acquired: {{ totalfunds }}</p>
      <p>Total Funds Needed: {{ fundsLeft }}</p>
      <ul>
        <!-- TODO: list all funds -->
        <li v-for="fund in funds" :key="fund.id">
          <span>{{ fund.amount }}</span>
        </li>
      </ul>
    </section>

    <b-row>
      <b-form @submit="onSubmit">
        <b-form-group label="Fund Amount" label-for="amount">
          <b-input-group>
            <b-input-group-prepend>
              <span class="input-group-text">$</span>
            </b-input-group-prepend>
            <b-form-input id="amount" v-model="amount" type="number" name="amount" />
          </b-input-group>
          <b-button type="submit" variant="primary">Submit</b-button>
        </b-form-group>
      </b-form>
    </b-row>

    <p>
      <b-button type="button" variant="success" @click="goBack">Back</b-button>
    </p>
  </b-container>
</template>
<script>
export default {
  async asyncData({ $axios, params }) {
    let investment = await $axios.get(`/api/investment/${params.id}`)
    let funds = await $axios.get(`/api/investment/${params.id}/funds`)
    let fundTotal = investment.data.loan_amount_dollars
    let newfunds = await funds.data.map(fund => {
      let n = 0
      n = n + fund.amount
      return n
    })
    let findTotal = function(arr) {
      let sum = 0
      for (let i = 0; i < arr.length; i++) {
        sum += arr[i]
      }
      return sum
    }
    let totalfunds = await findTotal(newfunds)

    return {
      investment: investment.data,
      funds: funds.data,
      amount: 0,
      fundTotal,
      newfunds,
      totalfunds,
      fundsLeft: investment.data.loan_amount_dollars - totalfunds
    }
  },
  computed: {
    findTotal(arr) {
      let sum = 0
      for (let i = 0; i < arr.length; i++) {
        sum += arr[i]
      }
      return sum
    }
  },
  methods: {
    goBack() {
      this.$router.back()
    },
    async onSubmit(ev) {
      ev.preventDefault()
      let {
        investment,
        funds,
        amount,
        findTotal,
        fundTotal,
        totalfunds,
        newfunds,
        fundsLeft
      } = this

      let b = {
        amount: this.amount,
        investment_id: this.investment.id
      }

      let funding = await this.$axios({
        method: 'post',
        url: '/api/funding',
        data: b
      })

      this.fundsLeft = this.fundsLeft - this.amount
    }
  }
}
</script>
