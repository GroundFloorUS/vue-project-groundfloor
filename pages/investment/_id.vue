<style scoped>
@import '../form.scss';
@import '../list.scss';
.investment_form {
  padding: 20px;
}
</style>
<template>
  <b-container>
    <h1 class="title">LOAN</h1>
    <p>Address: {{ investment.address }}</p>
    <p>Purpose: {{ investment.purpose }}</p>
    <section v-if="fullyFunded">
      <h4>This loan is fully funded</h4>
      <b-button type="button" vairant="success" @click="goBack">Go back to find other loans</b-button>
    </section>
    <section v-if="!fullyFunded" class="investment_form">
      <h3 class="subtitle">Invest</h3>
      <p>${{ maxAmountAllowed }} will fully fund the loan</p>
      <b-form @submit="onSubmit">
        <b-form-group label="Amount" label-for="amount">
          <b-input-group>
            <b-input-group-prepend>
              <span class="input-group-text">$</span>
            </b-input-group-prepend>
            <b-form-input
              id="amount"
              v-model="amount"
              :max="maxAmountAllowed"
              type="number"
              name="amount"
              @change="onChange"
            />
          </b-input-group>
          <p v-if="errors.amount" class="error">{{ errors.amount }}</p>
        </b-form-group>
        <b-container>
          <b-button type="button" vairant="success" @click="goBack">Back</b-button>
          <b-button :disabled="!validate()" type="submit" variant="primary">Submit</b-button>
        </b-container>
      </b-form>
    </section>
    <section v-if="funds.length > 0" class="investment_funds">
      <h3 class="subtitle">Loan Funds</h3>
      <b-container class="list">
        <b-row class="heading">
          <b-col>Address</b-col>
          <b-col>Created</b-col>
        </b-row>
        <b-row v-for="fund in funds" :key="fund.id">
          <b-col>${{ fund.amount }}</b-col>
          <b-col>{{ fund.created_on }}</b-col>
        </b-row>
      </b-container>
    </section>
  </b-container>
</template>
<script>
const requiredLabelMap = {
  amount: 'Amount'
}
export default {
  async asyncData({ $axios, params }) {
    const investment = await $axios.get(`/api/investment/${params.id}`)
    const funds = await $axios.get(`/api/investment/${params.id}/funds`)
    const totalAmountFunded = funds.data.reduce(
      (sum, curr) => sum + curr.amount,
      0
    )
    const maxAmountAllowed =
      investment.data.loan_amount_dollars - totalAmountFunded
    return {
      totalAmountFunded,
      maxAmountAllowed,
      fullyFunded: totalAmountFunded >= maxAmountAllowed,
      amount: 0,
      errors: {},
      investment_id: params.id,
      investment: investment.data,
      funds: funds.data.reverse()
    }
  },
  methods: {
    validate() {
      console.log(this.maxAmountAllowed)
      if (!this.amount || this.amount <= 0) {
        this.$set(this.errors, 'amount', 'Amount must be over $0')
      } else if (!this.amount || this.amount > this.maxAmountAllowed) {
        this.$set(
          this.errors,
          'amount',
          `Amount must be under $${this.maxAmountAllowed}`
        )
      } else {
        this.$set(this.errors, 'amount', '')
      }
      return Object.values(this.errors).filter(error => !!error).length === 0
    },
    onChange(ev) {
      this.validate()
    },
    async onSubmit(ev) {
      ev.preventDefault()
      const { investment_id, amount, maxAmountAllowed } = this
      const b = {
        fullyFunded: amount < maxAmountAllowed ? 0 : 1,
        amount,
        investment_id
      }

      if (!this.validate()) {
        return
      }

      await this.$axios({
        method: 'post',
        url: '/api/funding',
        data: b
      })
      const funds = await this.$axios.get(
        `/api/investment/${investment_id}/funds`
      )
      this.totalAmountFunded = this.totalAmountFunded + amount
      this.maxAmountAllowed = this.maxAmountAllowed - amount
      this.funds = funds.data.reverse()
    },
    goBack() {
      this.$router.back()
    }
  }
}
</script>
