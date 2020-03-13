<template>
  <b-container>
    <h1 class="title">LOAN</h1>
    <p>Address: {{ investment.address }}</p>
    <p>Purpose: {{ investment.purpose }}</p>

    <section class="investment_funds">
      <h3 class="subtitle">Loan Funds</h3>
      <b-progress
        :max="investment.loan_amount_dollars"
        height="30px"
        show-progress
        class="mb-3"
      >
        <template v-for="(fund, index) in funds">
          <b-progress-bar
            v-b-tooltip.hover.html="{title: `Invested Amount: $${fund.amount} <br> Invested On: ${formatDate(fund.created_on)}`,
                                     html: true
            }"
            :key="'med-screen-' + index"
            :value="fund.amount"
            :variant="index % 2 === 0 ? 'primary' : 'info'"
            class="d-none d-md-flex"
          >
            ${{ fund.amount }}
          </b-progress-bar>
          <b-progress-bar
            :key="'small-screen-'+ index"
            :value="fund.amount"
            variant="primary"
            class="d-md-none"
          >&nbsp;
          </b-progress-bar>
        </template>
      </b-progress>
    </section>
    <div class="scroll">
      <table class="table table-striped">
        <thead>
          <tr class="text-center">
            <th scope="col">Invested Amount</th>
            <th scope="col">Invested Date</th>
          </tr>
        </thead>
        <tbody>
          <template v-for="(fund, index) in funds">
            <tr
              :key="'table-row-' + index"
              class="text-center"
            >
              <!-- <th scope="row">{{ index }}</th> -->
              <td>${{ fund.amount }}</td>
              <td>{{ formatDate(fund.created_on) }}</td>
            </tr>
          </template>
        </tbody>
      </table>
    </div>
    <b-form @submit="submitInvestment">
      <b-form-group
        label="Invest in this loan"
        label-for="invest-amount-dollars"
        label-cols-md="3"
        class="mt-3"
      >
        <b-input-group>
          <b-input-group-prepend>
            <span class="input-group-text">$</span>
          </b-input-group-prepend>
          <b-form-input
            id="invest-amount-dollars"
            v-model="investmentAmount"
            type="number"
            name="invest-amount-dollars"
          />
          <b-form-invalid-feedback id="invest-amount-dollars-error">
            Enter an amount above $10
          </b-form-invalid-feedback>
          <!-- TODO: Disable if fully funded -->
          <b-button
            type="submit"
            variant="primary"
            class="ml-3"
          >
            Invest
          </b-button>
        </b-input-group>
      </b-form-group>
    </b-form>
    <p class="mt-3">
      <b-button
        type="button"
        variant="success"
        @click="goBack"
      >
        Back
      </b-button>
    </p>

  </b-container>
</template>
<script>
import axios from 'axios'
export default {
  data() {
    return {
      investmentAmount: 0
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
    goBack() {
      this.$router.back()
    },
    // Convert the date from YYYY-MM-DD, TODO: Move to utils
    formatDate(dateToFormat) {
      dateToFormat = dateToFormat.split(' ')[0]
      dateToFormat = dateToFormat.split('-')
      return dateToFormat[1] + '/' + dateToFormat[2] + '/' + dateToFormat[0]
    },
    async submitInvestment(ev) {
      ev.preventDefault()
      console.log(this.$route.params.id, this.investmentAmount)
      let funds = await axios({
        method: 'POST',
        url: '/api/funding',
        data: {
          investment_id: this.$route.params.id,
          amount: this.investmentAmount
        }
      })
      let updatedFunds = await axios.get(
        `/api/investment/${this.$route.params.id}/funds`
      )
      if (updatedFunds.status === 200 && updatedFunds.data) {
        this.funds = updatedFunds.data
      }
    }
  }
}
</script>
<style scoped>
.scroll {
  max-height: 250px;
  overflow-y: auto;
}
</style>
