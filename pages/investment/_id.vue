<template>
  <b-container>
    <h1 class="title">LOAN</h1>
    <p>Address: {{ investment.address }}</p>
    <p>Purpose: {{ investment.purpose }}</p>

    <section class="investment_funds">
      <h3 class="subtitle">Loan Funds</h3>
      <ul>
        <!-- TODO: list all funds -->
      </ul>
    </section>

    <b-row>
      <b-form @submit="onSubmit">
        <b-form-group label="fund Amount" label-for="fund-amount">
          <b-input-group>
            <b-input-group-prepend>
              <span class="input-group-text">$</span>
            </b-input-group-prepend>
            <b-form-input id="fund_amount" v-model="fund_amount" type="number" name="fund_amount" />
          </b-input-group>
        </b-form-group>
        <b-button type="submit" variant="primary">Submit</b-button>
      </b-form>
    </b-row>

    <p>
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
      funds: funds.data
    }
  },
  methods: {
    goBack() {
      this.$router.back()
    }
  }
}
</script>
