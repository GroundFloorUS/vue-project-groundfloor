<template>
  <b-container>
    <h1 class="title">LOAN</h1>
    <InvestmentTable :investments="investment" />
    
    <h3 v-if="fully_funded == 0" class="title">
      Add Funds 
      <small v-if="amount_needed > 0">${{ amount_needed.toString().replace(/(\d)(?=(\d{3})+$)/g, '$1,') }} needed</small>
      <small v-else-if="amount_needed === 0" class="alert-success">This will fund entire loan!</small>
      <small v-else-if="amount_needed<0" class="alert-warning">AMOUNT TOO MUCH</small>
    </h3>
    <b-form v-if="fully_funded == 0" inline class="mb-sm-3" @submit="onSubmit">
      <label for="amount" class="mr-sm-2">Amount</label>
      <b-input-group prepend="$">
        <b-form-input id="amount"
                      v-model="amount"
                      type="number"
                      name="amount"
                      class="mr-sm-2"
                      @keyup="onChange"/>
      </b-input-group>
      <b-button type="submit" variant="primary">Submit</b-button>
    </b-form>

    <section class="investment_funds">
      <h3 class="subtitle">Funds</h3>
      <b-table-lite :items="funds" :fields="fundFields">
        <template v-slot:cell(amount)="data">
          ${{ data.item.amount.toString().replace(/(\d)(?=(\d{3})+$)/g, '$1,') }}
        </template>
      </b-table-lite>
    </section>
    
    <b-button type="button" vairant="success" @click="goBack">
      Back
    </b-button>

  </b-container>
</template>

<script>
import InvestmentTable from '../../components/InvestmentTable.vue'

export default {
  components: {
    InvestmentTable
  },
  async asyncData({ $axios, params }) {
    let investment = await $axios.get(`/api/investment/${params.id}`)
    let funds = await $axios.get(`/api/investment/${params.id}/funds`)
    return {
      investment_id: params.id,
      amount: '',
      investment: [investment.data],
      fully_funded: investment.data.fully_funded || 0,
      loan_amount_dollars: investment.data.loan_amount_dollars || 0,
      total_funding: investment.data.total_funding || 0,
      amount_needed:
        investment.data.loan_amount_dollars - investment.data.total_funding,
      funds: funds.data,
      fundFields: [{ key: 'amount' }]
    }
  },
  methods: {
    goBack() {
      this.$router.back()
    },
    rowClass(fund, type) {
      if (!fund || type !== 'row') return
      if (fund.fully_funded == 1) return 'table-success'
    },
    async onSubmit(ev) {
      ev.preventDefault()
      let errors = []
      let { investment_id, amount } = this
      // validate amount
      if (amount <= 0) {
        errors.push('Fund amount must be greater than $0')
        this.errors = errors
      }
      let b = {
        investment_id,
        amount
      }
      if (errors.length === 0) {
        this.errrors = []
        this.amount = ''
        let investment = await this.$axios({
          method: 'post',
          url: '/api/funding',
          data: b
        })
        this.$router.push({ path: `/funding` })
      }
    },
    onChange(ev) {
      let errors = []
      let { investment_id, loan_amount_dollars, total_funding, amount } = this
      this.amount_needed = loan_amount_dollars - total_funding - amount
    }
  }
}
</script>
