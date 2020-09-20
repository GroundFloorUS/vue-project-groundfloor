<template>
  <b-container>
    <h1 class="title">LOAN</h1>
    <b-jumbotron :header="investment.address" :lead="investment.purpose">
      <p>{{ formatCurrency(investment.current_funding) }} funded out of {{ formatCurrency(investment.loan_amount_dollars) }}</p>
    </b-jumbotron>
    
    <section class="investment_funds">
      <h3 class="subtitle">Loan Funds</h3>
      <div>
        <b-table :fields="fields" :items="funds" empty-text="This investment has no funds yet." striped hover show-empty />
      </div>
    </section>
    
    <b-container>
      <b-alert :show="showError" variant="danger">
        {{ error }}
      </b-alert>

      <b-form @submit="onSubmit">
        <b-form-group label="Amount"
                      label-for="amount">
          <b-input-group>
            <b-input-group-prepend>
              <span class="input-group-text">$</span>
            </b-input-group-prepend>
            <b-form-input id="amount"
                          v-model="amount"
                          :state="amountState"
                          type="number"
                          name="amount" />
            <b-form-invalid-feedback id="address-live-feedback">
              Funding amount must be positive.
            </b-form-invalid-feedback>
          </b-input-group>
        </b-form-group>
        <b-button type="submit" variant="primary">Submit</b-button>
      </b-form>
    </b-container>
    <b-container>
      <div class="py-3">        
        <b-button type="button" variant="success" @click="goBack">
          Back
        </b-button>
      </div>
    </b-container>

  </b-container>
</template>
<style>
.display-3 {
  font-size: 3rem;
}
</style>
<script>
export default {
  async asyncData({ $axios, params }) {
    let investment = await $axios.get(`/api/investment/${params.id}`)
    let funds = await $axios.get(`/api/investment/${params.id}/funds`)
    return {
      investment: investment.data,
      funds: funds.data,
      fields: [
        {
          key: 'amount',
          formatter: 'formatCurrency'
        },
        {
          key: 'created_on',
          formatter: 'formatDate'
        }
      ]
    }
  },
  data() {
    return {
      amount: 500,
      showError: false,
      error: null
    }
  },
  computed: {
    amountState() {
      return this.amount >= 0
    }
  },
  methods: {
    goBack() {
      this.$router.back()
    },
    async onSubmit(ev) {
      ev.preventDefault()
      let { amount } = this
      let b = {
        investment_id: this.$route.params.id,
        amount
      }
      let funding = await this.$axios({
        method: 'post',
        url: '/api/funding',
        data: b
      })

      console.log('Funding data:', funding)
      if (funding.data.error) {
        console.log('Error: ', funding.data.error)
        this.showError = true
        this.error = funding.data.error
      } else {
        this.showError = false
        this.error = null
        location.reload()
      }
    },
    formatCurrency(value) {
      const formatter = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0
      })

      return formatter.format(value)
    },
    formatDate(value) {
      const date = new Date(value)
      if (isNaN(date.getTime())) {
        return ''
      } else {
        return date.toLocaleDateString('en-US')
      }
    }
  }
}
</script>
