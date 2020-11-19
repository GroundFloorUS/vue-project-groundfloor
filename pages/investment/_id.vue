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

    <b-card class="investment_fund w-50 mb-3" title="Invest in this loan">
      <b-form @submit="onSubmit">
        <b-form-group label="Amount"
                      label-for="loan_amount_dollars">
          <b-input-group>
            <b-input-group-prepend>
              <span class="input-group-text">$</span>
            </b-input-group-prepend>
            <b-form-input id="amount"
                          v-model="amount"
                          type="number"
                          name="amount" />

          </b-input-group>
        </b-form-group>
        <b-button type="submit" variant="primary">Submit</b-button>
      </b-form>
    </b-card>
    
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
    let funds = await $axios.get(`/api/investment/${params.id}/funds`)
    return {
      investment: investment.data,
      funds: funds.data
    }
  },
  methods: {
    goBack() {
      this.$router.back()
    },
    onSubmit() {
      // placeholder
    }
  }
}
</script>
