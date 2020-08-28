<template>
  <b-container>
    <b-row>
      <b-col>
        <h1 class="title">LOAN</h1>
        <p>Address: {{ investment.address }}</p>
        <p>Purpose: {{ investment.purpose }}</p>
        <p>Loan Amount: ${{ investment.loan_amount_dollars }}</p>

      </b-col>
      <b-col>
        <h1 class="title">LOAN INVESTMENT</h1>
        <b-form @submit="onSubmit">
          <b-form-group label="Amount"
                        label-for="amount">
            <b-input-group>
              <b-input-group-prepend>
                <span class="input-group-text">$</span>
              </b-input-group-prepend>
              <b-form-input id="amount"
                            v-model="amount"
                            type="number"
                            name="amount"/>
            </b-input-group>
            <p v-if="userInput.amount.isInvalid">
              <span class="error-text">{{ userInput.amount.message }}</span> 
            </p>
          </b-form-group>

          <b-button type="submit" variant="primary">Submit</b-button>

        </b-form>
      </b-col>
    </b-row>

    <section class="investment_funds">
      <h3 class="subtitle">Loan Funds</h3>
      <ul>
        <li v-for="investment in funds" :key="investment.id">
          <p>
            Received <strong>${{ investment.amount }}</strong> on {{ new Date(investment.created_on).toLocaleString('en-US').split(', ')[0] }}
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
      userInput: {
        amount: {
          isInvalid: false,
          message: 'Please enter an amount greater than $0'
        }
      }
    }
  },
  async asyncData({ $axios, params }) {
    let investment = await $axios.get(`/api/investment/${params.id}`)
    let funds = await $axios.get(`/api/investment/${params.id}/funds`)

    return {
      investment: investment.data,
      funds: funds.data,
      investment_id: params.id
    }
  },
  methods: {
    goBack() {
      this.$router.back()
    },
    async onSubmit(ev) {
      ev.preventDefault()
      // I believe there should be a better way to retrieve the id
      let investment_id = this.$data.investment_id
      let { amount } = this

      let payload = {
        investment_id,
        amount
      }

      let errorCount = 0
      if (this.amount === 0) {
        this.userInput.amount.isInvalid = true
        errorCount++
      } else {
        this.userInput.amount.isInvalid = false
      }

      if (errorCount > 0) {
        return
      }

      let investment = await this.$axios({
        method: 'post',
        url: '/api/funding',
        data: payload
      })
      // Need to update the code to instruct view to update the list of funds
    }
  }
}
</script>
