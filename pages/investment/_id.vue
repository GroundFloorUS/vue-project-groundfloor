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

    <p>
      <b-form type="button" vairant="success" @submit="onSubmit">
        <b-form-group label="Amount you want to fund"
                      label-for="amount">
          <b-form-input id="amout"
                        v-model="amount"
                        type="number"
                        name="amount" />
        </b-form-group>
        <b-button type="button" vairant="success" @click="goBack">Back</b-button>
        <b-button type="submit" variant="primary">Submit</b-button>
      </b-form>
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
      id: investment.data.id
    }
  },
  methods: {
    goBack() {
      this.$router.back()
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
      location.reload()
    }
  }
}
</script>
