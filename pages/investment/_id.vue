<template>
  <b-container>
    
    <b-link @click="goBack">
      Back
    </b-link>
    <h1 class="title">
      {{ investment.address }} <small class="text-muted">{{ investment.purpose }}</small>
    </h1>
    <b-row>
      <b-col>
        <b-card>
          <h3 class="subtitle">Loan Funds</h3>
          <b-alert :show="funds.length === 0">There are no investments on this loan</b-alert>
          <b-list-group flush>
            <b-list-group-item v-for="fund in funds" :key="fund.id" class="d-flex">
              <strong class="mr-auto">${{ fund.amount | formatDollars }}</strong>{{ fund.created_on | formatDate }}
            </b-list-group-item>
          </b-list-group>    
        </b-card>
      </b-col>
      <b-col cols="6">
        <b-card>
          <h3 class="subtitle">Invest</h3>
          <b-form @submit="onSubmit">
            <label for="amount">${{ amountRemaining | formatDollars }} until fully funded</label>
            <b-input-group>
              <b-input-group-prepend>
                <span class="input-group-text">$</span>
              </b-input-group-prepend>
              <b-form-input id="amount"
                            :state="investmentState"
                            v-model="amount"
                            type="number"
                            name="amount"/>
              <b-form-invalid-feedback>Investment can't be more than remaining ${{ amountRemaining | formatDollars }}</b-form-invalid-feedback>
            </b-input-group>
            <b-form-text v-show="amountRemainingAfterPurchase > 0">
              ${{ amountRemainingAfterPurchase | formatDollars }} remaining after your investment
            </b-form-text>
            <b-form-text v-show="amountRemainingAfterPurchase === 0">
              Your investment will fully fund this loan
            </b-form-text>

            <b-button type="submit" variant="primary" class="mt-3">Submit</b-button>
          </b-form>
        </b-card>
      </b-col>
      
    </b-row>
  </b-container>
</template>
<script>
export default {
  data: function() {
    return {
      amount: 0
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
  computed: {
    amountRemaining() {
      let { loan_amount_dollars } = this.investment
      let totalFunded = this.funds.reduce((acc, item) => acc + item.amount, 0)
      return loan_amount_dollars - totalFunded
    },
    investmentState() {
      return this.amount === 0 ? null : this.amount <= this.amountRemaining
    },
    amountRemainingAfterPurchase() {
      return this.amountRemaining - this.amount
    }
  },
  methods: {
    goBack() {
      this.$router.back()
    },
    async onSubmit(ev) {
      ev.preventDefault()
      let { amount } = this
      let { id: investment_id } = this.investment
      let b = {
        investment_id,
        amount
      }
      let investment = await this.$axios({
        method: 'post',
        url: '/api/funding',
        data: b
      })

      this.amount = 0
      this.$nuxt.refresh()
    }
  }
}
</script>
