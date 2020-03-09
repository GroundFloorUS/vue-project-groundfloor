<template>
  <b-container>
    <h1 class="title">LOAN</h1>
    <p>Address: {{ investment.address }}</p>
    <p>Purpose: {{ investment.purpose }}</p>
    <p>Total Amount Of Loan: ${{ investment.loan_amount_dollars }}</p>
    <p>Total Amount Funded: ${{ investment.funded_amount_dollars }}</p>

    <b-form @submit="onSubmit">
      <b-form-group label="Loan Amount" label-for="amount">
        <b-input-group>
          <b-input-group-prepend>
            <span class="input-group-text">$</span>
          </b-input-group-prepend>
          <b-form-input
            id="amount"
            v-model="amount"
            :class="{ 'is-invalid': attemptSubmit && wrongAmount }"
            type="number"
            name="amount"
          />
          <div class="invalid-feedback">Make sure this is a number greater than 0.</div>
        </b-input-group>
      </b-form-group>

      <b-button type="submit" variant="primary">Submit</b-button>

    </b-form>

    <section class="investment_funds">
      <h3 class="subtitle">Loan Funds</h3>
      <ul class="funds-list">
        <!-- TODO: list all funds -->
        <li v-for="fund in funds" :key="fund.id">
          <p>
            Amount: ${{ fund.amount }}
          </p>
          <p>
            Created On: {{ fund.created_on }} 
          </p>
        </li>
      </ul>
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
      amount: 0,
      attemptSubmit: false
    }
  },
  computed: {
    wrongAmount: function() {
      return this.isNumeric(this.amount) === false || this.amount < 1
    }
  },
  async asyncData({ $axios, params }) {
    let investment = await $axios.get(`/api/investment/${params.id}`)
    let funds = await $axios.get(`/api/investment/${params.id}/funds`)
    return {
      investment: investment.data,
      funds: funds.data
    }
  },
  methods: {
    isNumeric(n) {
      return !isNaN(parseFloat(n)) && isFinite(n)
    },
    async onSubmit(ev) {
      ev.preventDefault()
      this.attemptSubmit = true
      if (this.wrongAmount) return

      let b = {
        investment_id: this.investment.id,
        amount: this.amount
      }

      let funding = await this.$axios({
        method: 'post',
        url: '/api/funding',
        data: b
      })
      this.$router.go()
    },
    goBack() {
      this.$router.push({ path: `/funding` })
    }
  }
}
</script>
<style>
.funds-list {
  list-style-type: none;
  margin: 0;
  padding: 0;
}

.funds-list > li {
  font: 200 20px/1.5 Helvetica, Verdana, sans-serif;
  border: 5px solid #ccc;
  padding: 10px 10px 0px 10px;
  margin-bottom: 10px;
}

.title {
  font: 400 40px/1.5 Helvetica, Verdana, sans-serif;
  margin: 0;
  padding: 0;
}
</style>
