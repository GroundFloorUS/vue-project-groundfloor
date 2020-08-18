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
    <section class="investment_form">
      <h3 class="subtitle">Invest</h3>
      <b-form @submit="onSubmit">
        <b-form-group label="Amount" label-for="amount">
          <b-input-group>
            <b-input-group-prepend>
              <span class="input-group-text">$</span>
            </b-input-group-prepend>
            <b-form-input
              id="amount"
              v-model="amount"
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
        <b-row v-for="fund in funds.reverse()" :key="fund.id">
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
    let investment = await $axios.get(`/api/investment/${params.id}`)
    let funds = await $axios.get(`/api/investment/${params.id}/funds`)
    return {
      amount: 0,
      errors: {},
      investment_id: params.id,
      investment: investment.data,
      funds: funds.data
    }
  },
  methods: {
    validate() {
      if (!this.amount || this.amount <= 0) {
        this.$set(this.errors, 'amount', 'Amount must be over $0')
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
      let { investment_id, amount } = this
      let b = {
        amount,
        investment_id
      }

      if (!this.validate()) {
        return
      }

      let investment = await this.$axios({
        method: 'post',
        url: '/api/funding',
        data: b
      })
      let funds = await this.$axios.get(
        `/api/investment/${investment_id}/funds`
      )
      this.funds = funds.data
    },
    goBack() {
      this.$router.back()
    }
  }
}
</script>
